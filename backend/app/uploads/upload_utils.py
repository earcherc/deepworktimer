import uuid
from datetime import datetime, timedelta
import boto3
from botocore.config import Config
from ..config import settings
from PIL import Image
import io
import logging

logger = logging.getLogger(__name__)

s3_client = boto3.client(
    "s3",
    region_name=settings.AWS_REGION,
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY.get_secret_value(),
    config=Config(signature_version="s3v4"),
)

def generate_file_name(original_filename: str) -> str:
    extension = original_filename.split(".")[-1]
    return f"{uuid.uuid4()}.{extension}"

def generate_presigned_url(file_name: str, operation: str, expiration: int = 900) -> str:
    try:
        return s3_client.generate_presigned_url(
            ClientMethod=operation,
            Params={
                "Bucket": settings.AWS_S3_BUCKET_NAME,
                "Key": file_name,
            },
            ExpiresIn=expiration,
        )
    except Exception as e:
        logger.error(f"Error generating presigned URL: {str(e)}")
        raise

def get_presigned_url_for_image(file_name: str, operation: str = "get_object", expiration: int = 3600) -> str:
    try:
        return s3_client.generate_presigned_url(
            ClientMethod=operation,
            Params={
                "Bucket": settings.AWS_S3_BUCKET_NAME,
                "Key": file_name,
            },
            ExpiresIn=expiration,
        )
    except Exception as e:
        logger.error(f"Error getting presigned URL for image: {str(e)}")
        raise

def compress_image(image_data: bytes, max_size: int = 5 * 1024 * 1024) -> bytes:
    img = Image.open(io.BytesIO(image_data))
    
    if img.mode == 'RGBA':
        img = img.convert('RGB')
    
    quality = 95
    output = io.BytesIO()
    
    while True:
        output.seek(0)
        img.save(output, format='JPEG', quality=quality)
        if output.tell() <= max_size:
            break
        quality -= 5
        if quality < 20:
            raise ValueError("Unable to compress image to desired size")
    
    return output.getvalue()

def generate_image_versions(image_data: bytes):
    img = Image.open(io.BytesIO(image_data))
    
    medium = img.copy()
    medium.thumbnail((300, 300))
    medium_output = io.BytesIO()
    medium.save(medium_output, format='JPEG', quality=85)
    
    thumbnail = img.copy()
    thumbnail.thumbnail((100, 100))
    thumbnail_output = io.BytesIO()
    thumbnail.save(thumbnail_output, format='JPEG', quality=85)
    
    return {
        'original': image_data,
        'medium': medium_output.getvalue(),
        'thumbnail': thumbnail_output.getvalue()
    }

def upload_to_s3(file_data: bytes, file_name: str, content_type: str = 'image/jpeg'):
    try:
        s3_client.put_object(
            Bucket=settings.AWS_S3_BUCKET_NAME,
            Key=file_name,
            Body=file_data,
            ContentType=content_type
        )
    except Exception as e:
        logger.error(f"Error uploading to S3: {str(e)}")
        raise