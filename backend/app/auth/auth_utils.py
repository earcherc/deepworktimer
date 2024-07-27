import uuid

from passlib.context import CryptContext
from redis import Redis

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


async def create_session(redis: Redis, user_id: int, expiry: int = 3600) -> str:
    session_id = str(uuid.uuid4())
    await redis.setex(f"session:{session_id}", expiry, str(user_id))
    return session_id


async def get_user_id_from_session(redis: Redis, session_id: str) -> int | None:
    key = f"session:{session_id}"
    user_id = await redis.get(key)
    if user_id:
        await redis.expire(key, 3600)
    return int(user_id) if user_id else None


async def delete_session(redis, session_id: str) -> None:
    await redis.delete(f"session:{session_id}")
