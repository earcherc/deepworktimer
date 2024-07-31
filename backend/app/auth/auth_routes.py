import logging

import httpx
from fastapi import APIRouter, Depends, HTTPException, Query, Request, Response, logger
from fastapi.security import OAuth2AuthorizationCodeBearer
from httpx import AsyncClient
from pydantic import BaseModel, EmailStr
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from ..config import settings
from ..database import get_session
from ..dependencies import get_redis
from ..email.email_service import send_email
from ..models.user import User as UserModel
from ..uploads.upload_services import get_profile_photo_urls
from .auth_schemas import (
    EmailVerificationRequest,
    LoginRequest,
    PasswordChangeRequest,
    RegistrationRequest,
    ResendVerificationEmailRequest,
    SocialLoginRequest,
)
from .auth_utils import (
    create_session,
    delete_session,
    generate_verification_token,
    get_user_id_from_session,
    hash_password,
    send_verification_email,
    verify_email_token,
    verify_password,
)

router = APIRouter()

oauth2_scheme = OAuth2AuthorizationCodeBearer(
    authorizationUrl="/auth/login",
    tokenUrl="/auth/token",
)


async def authenticate_user(
    username: str, password: str, session: AsyncSession
) -> int | None:
    result = await session.execute(
        select(UserModel).where(UserModel.username == username)
    )
    user = result.scalar_one_or_none()
    if user and verify_password(password, user.hashed_password):
        return user.id
    return None


async def get_or_create_user(
    session: AsyncSession,
    email: str,
    username: str,
    social_provider: str,
    social_id: str,
) -> UserModel:
    result = await session.execute(select(UserModel).where(UserModel.email == email))
    user = result.scalar_one_or_none()
    if user:
        user.social_provider = social_provider
        user.social_id = social_id
        user.is_email_verified = True
    else:
        user = UserModel(
            email=email,
            username=username,
            social_provider=social_provider,
            social_id=social_id,
            is_email_verified=True,
        )
        session.add(user)
    await session.commit()
    await session.refresh(user)
    return user


@router.post("/login")
async def login(
    response: Response,
    login_request: LoginRequest,
    redis: Redis = Depends(get_redis),
    session: AsyncSession = Depends(get_session),
):
    user_id = await authenticate_user(
        login_request.username, login_request.password, session
    )
    if not user_id:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    result = await session.execute(select(UserModel).where(UserModel.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not user.is_email_verified:
        raise HTTPException(status_code=403, detail="Email not verified")
    session_id = await create_session(redis, user_id, expiry=30 * 24 * 3600)
    response.set_cookie(
        key="session_id",
        value=session_id,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=30 * 24 * 3600,
    )
    user_data = user.__dict__
    user_data.pop("hashed_password", None)
    user_data["profile_photo_urls"] = await get_profile_photo_urls(
        user.profile_photo_key
    )
    return user_data


@router.post("/github-login")
async def github_login(
    response: Response,
    code: str,
    redis: Redis = Depends(get_redis),
    session: AsyncSession = Depends(get_session),
):
    # Exchange code for access token
    async with AsyncClient() as client:
        token_response = await client.post(
            "https://github.com/login/oauth/access_token",
            data={
                "client_id": settings.GITHUB_CLIENT_ID,
                "client_secret": settings.GITHUB_CLIENT_SECRET,
                "code": code,
            },
            headers={"Accept": "application/json"},
        )
    token_data = token_response.json()
    access_token = token_data.get("access_token")

    if not access_token:
        raise HTTPException(status_code=400, detail="Failed to obtain access token")

    # Get user info from GitHub
    async with AsyncClient() as client:
        user_response = await client.get(
            "https://api.github.com/user",
            headers={"Authorization": f"token {access_token}"},
        )
    github_user = user_response.json()

    user = await get_or_create_user(
        session,
        email=github_user["email"],
        username=github_user["login"],
        social_provider="GITHUB",
        social_id=str(github_user["id"]),
    )

    session_id = await create_session(redis, user.id, expiry=30 * 24 * 3600)
    response.set_cookie(
        key="session_id",
        value=session_id,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=30 * 24 * 3600,
    )

    user_data = user.__dict__
    user_data.pop("hashed_password", None)
    user_data["profile_photo_urls"] = await get_profile_photo_urls(
        user.profile_photo_key
    )
    return user_data


logger = logging.getLogger(__name__)


@router.post("/google-login")
async def google_login(
    response: Response,
    redis: Redis = Depends(get_redis),
    session: AsyncSession = Depends(get_session),
    access_token: str = Query(..., description="Google access token"),
):
    try:
        # Fetch user info from Google
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                headers={"Authorization": f"Bearer {access_token}"},
            )
            resp.raise_for_status()
            user_info = resp.json()

        # Extract necessary information
        userid = user_info["sub"]
        email = user_info["email"]
        name = user_info.get("name", email.split("@")[0])

        if not email:
            raise HTTPException(status_code=400, detail="Email not provided by Google")

        # Get or create user
        user = await get_or_create_user(
            session,
            email=email,
            username=name,
            social_provider="GOOGLE",
            social_id=userid,
        )

        # Create session
        session_id = await create_session(redis, user.id, expiry=30 * 24 * 3600)
        response.set_cookie(
            key="session_id",
            value=session_id,
            httponly=True,
            secure=True,
            samesite="lax",
            max_age=30 * 24 * 3600,
        )

        # Prepare user data for response
        user_data = user.__dict__
        user_data.pop("hashed_password", None)
        user_data["profile_photo_urls"] = await get_profile_photo_urls(
            user.profile_photo_key
        )

        return user_data

    except httpx.HTTPError as e:
        raise HTTPException(
            status_code=400, detail=f"Failed to fetch user info from Google: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"An unexpected error occurred: {str(e)}"
        )


@router.post("/register")
async def register(
    registration_request: RegistrationRequest,
    session: AsyncSession = Depends(get_session),
):
    result = await session.execute(
        select(UserModel).where(
            (UserModel.username == registration_request.username)
            | (UserModel.email == registration_request.email)
        )
    )
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Username or email already exists")

    hashed_password = hash_password(registration_request.password)
    verification_token = await generate_verification_token()
    new_user = UserModel(
        username=registration_request.username,
        email=registration_request.email,
        hashed_password=hashed_password,
        is_email_verified=False,
        email_verification_token=verification_token,
    )

    session.add(new_user)
    await session.commit()
    await session.refresh(new_user)

    await send_verification_email(new_user.email, verification_token)

    return {
        "id": new_user.id,
        "message": "Please check your email to verify your account",
    }


@router.post("/verify-email")
async def verify_email(
    verification_request: EmailVerificationRequest,
    session: AsyncSession = Depends(get_session),
):
    if await verify_email_token(session, verification_request.token):
        return {"message": "Email verified successfully"}
    raise HTTPException(status_code=400, detail="Invalid or expired verification token")


@router.post("/resend-verification-email")
async def resend_verification_email(
    request: ResendVerificationEmailRequest,
    session: AsyncSession = Depends(get_session),
):
    result = await session.execute(
        select(UserModel).where(UserModel.email == request.email)
    )
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.is_email_verified:
        raise HTTPException(status_code=400, detail="Email already verified")

    verification_token = await generate_verification_token()
    user.email_verification_token = verification_token
    await session.commit()

    await send_verification_email(user.email, verification_token)
    return {"message": "Verification email sent"}


@router.post("/logout")
async def logout(
    response: Response, request: Request, redis: Redis = Depends(get_redis)
):
    session_id = request.cookies.get("session_id")
    if session_id:
        await delete_session(redis, session_id)
    response.delete_cookie(key="session_id")
    return {"message": "Logged out"}


@router.post("/validate-session")
async def validate_session(request: Request):
    user_id = getattr(request.state, "user_id", None)
    return {"isValid": user_id is not None}


@router.post("/change-password")
async def change_password(
    request: Request,
    password_change: PasswordChangeRequest,
    redis: Redis = Depends(get_redis),
    session: AsyncSession = Depends(get_session),
):
    session_id = request.cookies.get("session_id")
    if not session_id:
        raise HTTPException(status_code=401, detail="No session ID found")

    user_id = await get_user_id_from_session(redis, session_id)
    if not user_id:
        raise HTTPException(
            status_code=401, detail="Invalid session or session expired"
        )

    result = await session.execute(select(UserModel).where(UserModel.id == user_id))
    user = result.scalar_one_or_none()
    if not user or not verify_password(
        password_change.current_password, user.hashed_password
    ):
        raise HTTPException(status_code=403, detail="Current password is incorrect")

    user.hashed_password = hash_password(password_change.new_password)
    await session.commit()

    return {"message": "Password changed successfully"}


@router.post("/test-email")
async def test_email(email: EmailStr):
    await send_email(
        email,
        "Deep Work Timer Validation",
        "<h1>This is an email to validate Deep Work Timer</h1>",
    )
    return {"message": "Test email sent"}
