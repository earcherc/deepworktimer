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

async def process_and_upload_image(file_content: bytes, original_filename: str):
    try:
        compressed_content = compress_image(file_content)
        image_versions = generate_image_versions(compressed_content)
        base_filename = generate_file_name(original_filename)
        
        urls = {}
        for size, content in image_versions.items():
            filename = f"{size}_{base_filename}"
            upload_to_s3(content, filename)
            urls[f'{size}_url'] = get_presigned_url_for_image(filename)
        
        return urls
    except NoCredentialsError:
        logger.error("AWS credentials not found")
        raise HTTPException(status_code=500, detail="Could not connect to AWS with provided credentials")
    except ClientError as e:
        error_message = e.response.get("Error", {}).get("Message", "Unknown error occurred")
        logger.error(f"AWS S3 ClientError: {error_message}")
        raise HTTPException(status_code=500, detail=f"AWS S3 ClientError: {error_message}")
    except Exception as e:
        logger.error(f"Error processing and uploading image: {str(e)}")
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