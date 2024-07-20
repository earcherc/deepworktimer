from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware
from redis.asyncio import Redis

from .auth.auth_utils import get_user_id_from_session
from .config import settings
from .routers.daily_goal import router as daily_goal_router
from .routers.study_category import router as study_category_router
from .routers.user import router as user_router
from .routers.study_block import router as study_block_router
from .uploads.upload_routes import router as upload_router
from .auth.auth_routes import router as auth_router
from .routers.time_settings import router as time_settings_router


@asynccontextmanager
async def app_lifespan(app: FastAPI):
    redis_client = Redis.from_url(settings.REDIS_URL)
    app.state.redis = redis_client
    yield

    await redis_client.close()


def create_app() -> FastAPI:
    app = FastAPI(
        title="Deep Work Timer",
        description="Productivity tracker",
        version="1.0.0",
        lifespan=app_lifespan,
    )

    # Middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=settings.ALLOWED_HOSTS,
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
    app.include_router(
        time_settings_router, prefix="/time-setttings", tags=["Time Settings"]
    )

    return app


app = create_app()
