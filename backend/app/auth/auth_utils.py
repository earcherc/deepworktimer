import uuid
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


async def create_session(redis, user_id: int) -> str:
    session_id = str(uuid.uuid4())
    await redis.setex(f"session:{session_id}", 3600, str(user_id))
    return session_id


async def get_user_id_from_session(redis, session_id: str) -> int | None:
    user_id = await redis.get(f"session:{session_id}")
    if user_id:
        await redis.expire(f"session:{session_id}", 3600)  # Reset the expiry to 1 hour
        return int(user_id)
    return None


async def delete_session(redis, session_id: str) -> None:
    await redis.delete(f"session:{session_id}")
