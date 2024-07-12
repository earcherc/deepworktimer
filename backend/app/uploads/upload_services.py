from fastapi import HTTPException
from botocore.exceptions import NoCredentialsError, ClientError
from .upload_utils import (
    generate_file_name,
    get_presigned_url_for_image,
    compress_image,
    generate_image_versions,
    upload_to_s3
)
from urllib.parse import urlparse
import logging

logger = logging.getLogger(__name__)

async def process_and_upload_image(file_content: bytes, original_filename: str, user_id: int):
    try:
        logger.info("Compressing image")
        compressed_content = compress_image(file_content)
        
        logger.info("Generating image versions")
        image_versions = generate_image_versions(compressed_content)
        
        base_filename = f"user_{user_id}/{generate_file_name(original_filename)}"
        logger.info(f"Base filename: {base_filename}")
        
        for size, content in image_versions.items():
            filename = f"{size}_{base_filename}"
            logger.info(f"Uploading {size} image: {filename}")
            upload_to_s3(content, filename)
        
        logger.info("Image upload complete")
        return base_filename
    except Exception as e:
        logger.error(f"Error processing and uploading image: {str(e)}")
        logger.exception("Full traceback:")
        raise HTTPException(status_code=500, detail=str(e))

async def generate_profile_photo_view_url(image_url: str):
    try:
        file_name = image_url.split("/")[-1]
        return get_presigned_url_for_image(file_name, "get_object")
    except Exception as e:
        logger.error(f"Failed to generate presigned URL: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate presigned URL: {str(e)}")

async def generate_profile_photo_view_url(image_url: str):
    try:
        file_name = urlparse(image_url).path.lstrip("/")
        return get_presigned_url_for_image(file_name, "get_object")
    except Exception as e:
        logger.error(f"Failed to generate presigned URL: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate presigned URL: {str(e)}")

async def generate_profile_photo_upload_url(file_name: str):
    try:
        return get_presigned_url_for_image(file_name, "put_object")
    except Exception as e:
        logger.error(f"Failed to generate presigned upload URL: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate presigned upload URL: {str(e)}")

async def get_profile_photo_urls(profile_photo_key: str):
    if not profile_photo_key:
        return None
    
    urls = {}
    for size in ['original', 'medium', 'thumbnail']:
        try:
            urls[size] = get_presigned_url_for_image(f"{size}_{profile_photo_key}")
        except Exception as e:
            logger.error(f"Failed to generate presigned URL for {size}_{profile_photo_key}: {str(e)}")
            urls[size] = None
    
    return urls
