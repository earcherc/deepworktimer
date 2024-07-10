from fastapi import FastAPI, Request
from redis.asyncio import Redis
from contextlib import asynccontextmanager
from .routers import daily_goal_router, user_router, study_block_router, study_category_router
from .auth import auth_router
from .uploads import upload_router
from .auth.auth_utils import get_user_id_from_session

@asynccontextmanager
async def app_lifespan(app: FastAPI):
    redis_client = Redis.from_url("redis://redis:6379")
    app.state.redis = redis_client
    yield
    await redis_client.close()

app = FastAPI(lifespan=app_lifespan)

# Middleware for authentication
@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    request.state.user_id = None
    session_id = request.cookies.get("session_id")
    if session_id:
        redis = request.app.state.redis
        user_id = await get_user_id_from_session(redis, session_id)
        if user_id:
            request.state.user_id = int(user_id)
    response = await call_next(request)
    return response

# Include routers
app.include_router(auth_router, prefix="/auth")
app.include_router(daily_goal_router, prefix="/daily-goals")
app.include_router(user_router, prefix="/users")
app.include_router(study_block_router, prefix="/study-blocks")
app.include_router(study_category_router, prefix="/study-categories")
app.include_router(upload_router, prefix="/upload")
