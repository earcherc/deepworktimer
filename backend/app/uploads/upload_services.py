from fastapi import HTTPException
from botocore.exceptions import NoCredentialsError, ClientError
from .upload_utils import (
    generate_file_name,
    generate_presigned_url,
    get_file_url,
    generate_presigned_get_url,
)
from urllib.parse import urlparse


async def get_presigned_url_for_upload(original_filename: str):
    try:
        file_name = generate_file_name(original_filename)
        presigned_url = generate_presigned_url(file_name)
        file_url = get_file_url(file_name)
        return {"presigned_url": presigned_url, "file_url": file_url}
    except NoCredentialsError:
        raise HTTPException(
            status_code=500, detail="Could not connect to AWS with provided credentials"
        )
    except ClientError as e:
        error_message = e.response.get("Error", {}).get(
            "Message", "Unknown error occurred"
        )
        raise HTTPException(
            status_code=500, detail=f"AWS S3 ClientError: {error_message}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def get_presigned_url_for_image(image_url: str):
    try:
        file_name = urlparse(image_url).path.lstrip("/")
        return generate_presigned_get_url(file_name)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to generate presigned URL: {str(e)}"
        )
