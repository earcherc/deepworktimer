import strawberry
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from redis.asyncio import Redis
from strawberry.fastapi import GraphQLRouter
from .graphql import (
    Query,
    DailyGoalMutations,
    UserMutations,
    StudyCategoryMutations,
    StudyBlockMutations,
)
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
    return {
        "request": request,
        "user_id": request.state.user_id,
    }


@strawberry.type
class CombinedMutation(
    DailyGoalMutations, UserMutations, StudyBlockMutations, StudyCategoryMutations
):
    pass


schema = strawberry.Schema(query=Query, mutation=CombinedMutation)

graphql_app = GraphQLRouter(schema, context_getter=get_graphql_context)
app = FastAPI(lifespan=app_lifespan)

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
