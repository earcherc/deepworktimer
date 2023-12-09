import uuid
from passlib.context import CryptContext


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str):
    return pwd_context.hash(password)


async def create_session(redis, user_id: int):
    session_id = str(uuid.uuid4())
    await redis.setex(f"session:{session_id}", 3600, user_id)
    return session_id


async def get_user_id_from_session(redis, session_id: str):
    user_id = await redis.get(f"session:{session_id}")
    if user_id:
        await redis.expire(f"session:{session_id}", 3600)  # Reset the expiry to 1 hour
        return int(user_id)
    return None


async def delete_session(redis, session_id: str):
    await redis.delete(f"session:{session_id}")
