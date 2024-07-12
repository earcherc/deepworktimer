from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from redis.asyncio import Redis

from .auth import auth_router
from .auth.auth_utils import get_user_id_from_session
from .config import settings
from .routers import (
    daily_goal_router,
    study_block_router,
    study_category_router,
    user_router,
)
from .uploads import upload_router


@asynccontextmanager
async def app_lifespan(app: FastAPI):
    # Setup
    redis_client = Redis.from_url(settings.REDIS_URL)
    app.state.redis = redis_client
    yield
    # Teardown
    await redis_client.close()


def create_app() -> FastAPI:
    app = FastAPI(
        title="Deep Work",
        description="Productivity tracker",
        version="1.0.0",
        lifespan=app_lifespan,
    )

    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Authentication middleware
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
    app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
    app.include_router(daily_goal_router, prefix="/daily-goals", tags=["Daily Goals"])
    app.include_router(user_router, prefix="/users", tags=["Users"])
    app.include_router(
        study_block_router, prefix="/study-blocks", tags=["Study Blocks"]
    )
    app.include_router(
        study_category_router, prefix="/study-categories", tags=["Study Categories"]
    )
    app.include_router(upload_router, prefix="/upload", tags=["Uploads"])

    return app


app = create_app()
