from fastapi import FastAPI, Request, Depends
from redis.asyncio import Redis
from strawberry.fastapi import GraphQLRouter
from .graphql.queries import schema
from .database import get_session
from .auth.auth_routes import router as auth_router
from .auth.auth_utils import get_user_id_from_session
from contextlib import asynccontextmanager


@asynccontextmanager
async def app_lifespan(app: FastAPI):
    redis_client = Redis.from_url("redis://redis:6379")
    app.state.redis = redis_client
    yield
    await redis_client.close()


async def get_graphql_context(request: Request):
    session = Depends(get_session)
    return {
        "request": request,
        "user_id": request.state.user_id,
        "session": session,
    }


graphql_app = GraphQLRouter(schema, context_getter=get_graphql_context)
app = FastAPI(lifespan=app_lifespan)


# Middleware for authentication
@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    request.state.user_id = None  # Default to no user
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
app.include_router(graphql_app, prefix="/graphql")
