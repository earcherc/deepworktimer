# /backend/app/auth/auth_routes.py
from fastapi import APIRouter, Depends, Response, HTTPException, Request
from .auth_utils import create_session
from ..dependencies import get_redis
from ..api_schemas import LoginRequest

router = APIRouter()


@router.post("/login")
async def login(
    response: Response, login_request: LoginRequest, redis=Depends(get_redis)
):
    # Dummy user authentication logic for testing
    user_id = authenticate_user(login_request.username, login_request.password)
    if not user_id:
        raise HTTPException(status_code=401, detail="Incorrect username or password")

    # On successful authentication:
    session_id = await create_session(redis, user_id)
    response.set_cookie(key="session_id", value=session_id, httponly=True, secure=True)
    return {"message": "Logged in"}


@router.get("/hello")
async def hello():
    return {"message": "Logged in"}


def authenticate_user(username: str, password: str) -> int:
    # Dummy authentication: always returns user ID 1
    return "1"
