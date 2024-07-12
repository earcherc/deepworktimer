from fastapi import APIRouter, Depends, HTTPException, Request, File, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from ..models import User
from ..auth.auth_utils import get_user_id_from_session
from ..database import get_session
from ..dependencies import get_redis
from .upload_services import process_and_upload_image, generate_profile_photo_view_url, generate_profile_photo_upload_url
from redis.asyncio import Redis
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB

def allowed_file(filename: str):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@router.post("/upload-profile-photo")
async def upload_profile_photo(
    request: Request,
    file: UploadFile = File(...),
    redis: Redis = Depends(get_redis),
    session: AsyncSession = Depends(get_session),
):
    try:
        user_id = await get_user_id_from_session(redis, request.cookies.get("session_id"))
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid session or session expired")

        if not allowed_file(file.filename):
            raise HTTPException(status_code=400, detail="File type not allowed")

        file_content = await file.read()
        if len(file_content) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File size exceeds maximum limit of 5MB")

        file_urls = await process_and_upload_image(file_content, file.filename)

        user = await session.execute(select(User).where(User.id == user_id))
        user = user.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        user.profile_photo_url = file_urls['original_url']
        user.profile_photo_medium_url = file_urls['medium_url']
        user.profile_photo_thumbnail_url = file_urls['thumbnail_url']
        await session.commit()

        return file_urls
    except Exception as e:
        logger.error(f"Error in upload_profile_photo: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/get-profile-photo-view-url")
async def get_profile_photo_view_url(
    request: Request,
    redis: Redis = Depends(get_redis),
    session: AsyncSession = Depends(get_session),
):
    try:
        user_id = await get_user_id_from_session(redis, request.cookies.get("session_id"))
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid session or session expired")

        user = await session.execute(select(User).where(User.id == user_id))
        user = user.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        if user.profile_photo_url:
            presigned_urls = {
                'original': await generate_profile_photo_view_url(user.profile_photo_url),
                'medium': await generate_profile_photo_view_url(user.profile_photo_medium_url),
                'thumbnail': await generate_profile_photo_view_url(user.profile_photo_thumbnail_url)
            }
            return presigned_urls
        else:
            return {
                'original': None,
                'medium': None,
                'thumbnail': None
            }
    except Exception as e:
        logger.error(f"Error in get_profile_photo_view_url: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/get-profile-photo-upload-url")
async def get_profile_photo_upload_url(
    request: Request,
    redis: Redis = Depends(get_redis),
):
    try:
        user_id = await get_user_id_from_session(redis, request.cookies.get("session_id"))
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid session or session expired")

        file_name = f"profile_photo_{user_id}_{uuid.uuid4()}.jpg"
        upload_url = await generate_profile_photo_upload_url(file_name)
        return {"upload_url": upload_url, "file_name": file_name}
    except Exception as e:
        logger.error(f"Error in get_profile_photo_upload_url: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))