import boto3
from botocore.exceptions import NoCredentialsError, ClientError
from fastapi import HTTPException, UploadFile

from ..config import Config
from .upload_utils import generate_file_name


s3_client = boto3.client(
    "s3",
    aws_access_key_id=Config.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=Config.AWS_SECRET_ACCESS_KEY,
)


async def upload_image_to_s3(file: UploadFile):
    try:
        file_name = generate_file_name(file.filename)

        s3_client.upload_fileobj(
            file.file,
            Config.AWS_S3_BUCKET_NAME,
            file_name,
            ExtraArgs={"ContentType": file.content_type},
        )

        file_url = f"https://{Config.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/{file_name}"

        return file_url
    except NoCredentialsError:
        raise HTTPException(
            status_code=500, detail="Could not connect to AWS with provided credentials"
        )
    except ClientError as e:
        # Handle AWS client errors (e.g., network error, permissions issue)
        error_message = e.response.get("Error", {}).get(
            "Message", "Unknown error occurred"
        )
        raise HTTPException(
            status_code=500, detail=f"AWS S3 ClientError: {error_message}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
