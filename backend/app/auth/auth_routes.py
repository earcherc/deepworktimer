# /backend/app/auth/auth_routes.py
from fastapi import APIRouter, Depends, Response, HTTPException, Request
from .auth_utils import (
    create_session,
    pwd_context,
    delete_session,
    get_user_id_from_session,
)
from .auth_schemas import RegistrationRequest, LoginRequest
from ..dependencies import get_redis
from ..database import get_session
from ..models import User as UserModel
from sqlmodel import Session, col, or_, select

router = APIRouter()


def authenticate_user(username: str, password: str, session: Session) -> int:
    user_statement = select(UserModel).where(UserModel.username == username)
    user = session.exec(user_statement).first()
    if user and pwd_context.verify(password, user.hashed_password):
        return user.id
    return None


@router.post("/login")
async def login(
    response: Response,
    login_request: LoginRequest,
    redis=Depends(get_redis),
    session: Session = Depends(get_session),
):
    user_id = authenticate_user(login_request.username, login_request.password, session)
    if not user_id:
        raise HTTPException(status_code=401, detail="Incorrect username or password")

    session_id = await create_session(redis, user_id)
    user = session.exec(select(UserModel).where(UserModel.id == user_id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Secure False for local dev only (localhost)
    response.set_cookie(key="session_id", value=session_id, httponly=True, secure=False)

    # Serialize user data and exclude sensitive field
    user_data = user.dict(exclude={"hashed_password"})
    return user_data


@router.post("/logout")
async def logout(response: Response, request: Request, redis=Depends(get_redis)):
    session_id = request.cookies.get("session_id")
    if session_id:
        await delete_session(redis, session_id)
    response.delete_cookie(key="session_id")
    return {"message": "Logged out"}


@router.post("/register")
def register(
    registration_request: RegistrationRequest, session: Session = Depends(get_session)
):
    user_exists_statement = select(UserModel).where(
        or_(
            col(UserModel.username) == registration_request.username,
            col(UserModel.email) == registration_request.email,
        )
    )

    existing_user = session.exec(user_exists_statement).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already exists")

    hashed_password = pwd_context.hash(registration_request.password)
    new_user = UserModel(
        username=registration_request.username,
        email=registration_request.email,
        hashed_password=hashed_password,
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return {"id": new_user.id}


@router.post("/validate-session")
async def validate_session(request: Request, session=Depends(get_session)):
    user_id = getattr(request.state, "user_id", None)
    print(f"User ID: {user_id} ")
    print(f"Request: {request} ")
    print(f"Session: {session} ")
    if user_id:
        statement = select(UserModel).where(UserModel.id == user_id)
        db_user = session.exec(statement).first()
        if db_user:
            user_data = db_user.dict()
            print(f"User data backend: {user_data} ")
            return {"user": user_data}
    return {"user": None}
