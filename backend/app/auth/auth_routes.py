from fastapi import APIRouter, Depends, Response, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from .auth_utils import (
    create_session,
    verify_password,
    delete_session,
    get_user_id_from_session,
    hash_password,
)
from .auth_schemas import RegistrationRequest, LoginRequest, PasswordChangeRequest
from ..dependencies import get_redis
from ..database import get_session
from ..models import User as UserModel
from ..uploads.upload_services import get_profile_photo_urls 
from redis.asyncio import Redis
from urllib.parse import urlparse

router = APIRouter()


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
    session_id = await create_session(redis, user_id)
    result = await session.execute(select(UserModel).where(UserModel.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    response.set_cookie(key="session_id", value=session_id, httponly=True, secure=False)
    user_data = user.__dict__
    user_data.pop("hashed_password", None)
    # Generate presigned URLs for profile photos if they exist
    user_data["profile_photo_urls"] = await get_profile_photo_urls(user.profile_photo_key)
    return user_data


@router.post("/logout")
async def logout(
    response: Response, request: Request, redis: Redis = Depends(get_redis)
):
    session_id = request.cookies.get("session_id")
    if session_id:
        await delete_session(redis, session_id)
    response.delete_cookie(key="session_id")
    return {"message": "Logged out"}


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
    new_user = UserModel(
        username=registration_request.username,
        email=registration_request.email,
        hashed_password=hashed_password,
    )

    session.add(new_user)
    await session.commit()
    await session.refresh(new_user)
    return {"id": new_user.id}


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
