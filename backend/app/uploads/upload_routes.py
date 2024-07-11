from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from ..models import User
from ..auth.auth_utils import get_user_id_from_session
from ..database import get_session
from ..dependencies import get_redis
from .upload_services import (
    get_presigned_url_for_upload,
    get_presigned_url_for_image,
)
from redis.asyncio import Redis

router = APIRouter()

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


def allowed_file(filename: str):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@router.post("/get-presigned-url")
async def get_upload_url(
    request: Request,
    filename: str,
    redis: Redis = Depends(get_redis),
    session: AsyncSession = Depends(get_session),
):
    session_id = request.cookies.get("session_id")
    if not session_id:
        raise HTTPException(status_code=401, detail="No session ID found")

    user_id = await get_user_id_from_session(redis, session_id)
    if not user_id:
        raise HTTPException(
            status_code=401, detail="Invalid session or session expired"
        )

    if not allowed_file(filename):
        raise HTTPException(status_code=400, detail="File type not allowed")

    upload_data = await get_presigned_url_for_upload(filename)

    result = await session.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.profile_photo_url = upload_data["file_url"]
    await session.commit()

    return upload_data


@router.post("/confirm-upload")
async def confirm_upload(
    request: Request,
    file_url: str,
    redis: Redis = Depends(get_redis),
    session: AsyncSession = Depends(get_session),
):
    session_id = request.cookies.get("session_id")
    if not session_id:
        raise HTTPException(status_code=401, detail="No session ID found")

    user_id = await get_user_id_from_session(redis, session_id)
    if not user_id:
        raise HTTPException(
            status_code=401, detail="Invalid session or session expired"
        )

    result = await session.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.profile_photo_url != file_url:
        raise HTTPException(
            status_code=400, detail="File URL does not match the one in presigned URL"
        )

    # Here you could add additional checks, like verifying the file exists in S3

    return {"message": "Upload confirmed successfully"}


@router.get("/get-profile-photo-url")
async def get_profile_photo_url(
    request: Request,
    redis: Redis = Depends(get_redis),
    session: AsyncSession = Depends(get_session),
):
    session_id = request.cookies.get("session_id")
    if not session_id:
        raise HTTPException(status_code=401, detail="No session ID found")

    user_id = await get_user_id_from_session(redis, session_id)
    if not user_id:
        raise HTTPException(
            status_code=401, detail="Invalid session or session expired"
        )

    result = await session.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.profile_photo_url:
        presigned_url = await get_presigned_url_for_image(user.profile_photo_url)
        return {"profile_photo_presigned_url": presigned_url}
    else:
        return {"profile_photo_presigned_url": None}
