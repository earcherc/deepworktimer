from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile
from sqlmodel import select

from ..models.user import User
from ..auth.auth_utils import get_user_id_from_session
from ..database import get_session
from ..dependencies import get_redis
from .upload_services import upload_image_to_s3

router = APIRouter()


ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


def allowed_file(filename: str):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@router.post("/image")
async def upload_image(
    request: Request,
    file: UploadFile = File(...),
    redis=Depends(get_redis),
    session=Depends(get_session),
):
    session_id = request.cookies.get("session_id")
    if not session_id:
        raise HTTPException(status_code=401, detail="No session ID found")

    user_id = await get_user_id_from_session(redis, session_id)
    if not user_id:
        raise HTTPException(
            status_code=401, detail="Invalid session or session expired"
        )

    content_length = request.headers.get("content-length")
    if content_length and int(content_length) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large")

    file.file.seek(0)  # Reset file pointer

    # Validate file type
    if not allowed_file(file.filename):
        raise HTTPException(status_code=400, detail="File type not allowed")

    # Upload image to S3 and get URL
    url = await upload_image_to_s3(file)

    # Update user model with new image URL
    user = session.exec(select(User).where(User.id == user_id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.profile_photo_url = url
    session.commit()

    return {"url": url}
