from fastapi import HTTPException
from .upload_utils import (
    generate_file_name,
    get_presigned_url_for_image,
    compress_image,
    generate_image_versions,
    upload_to_s3
)
from urllib.parse import urlparse

async def process_and_upload_image(file_content: bytes, original_filename: str, user_id: int):
    compressed_content = compress_image(file_content)
    image_versions = generate_image_versions(compressed_content)
    
    base_filename = f"user_{user_id}/{generate_file_name(original_filename)}"
    
    for size, content in image_versions.items():
        filename = f"{size}_{base_filename}"
        upload_to_s3(content, filename)
    
    return base_filename

async def generate_profile_photo_view_url(image_url: str):
    file_name = urlparse(image_url).path.lstrip("/")
    return get_presigned_url_for_image(file_name, "get_object")

async def generate_profile_photo_upload_url(file_name: str):
    return get_presigned_url_for_image(file_name, "put_object")

async def get_profile_photo_urls(profile_photo_key: str):
    if not profile_photo_key:
        return None
    
    return {
        size: get_presigned_url_for_image(f"{size}_{profile_photo_key}")
        for size in ['original', 'medium', 'thumbnail']
    }