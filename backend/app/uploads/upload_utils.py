import uuid
from datetime import datetime, timedelta
import boto3
from botocore.config import Config
from ..config import settings

s3_client = boto3.client(
    "s3",
    region_name='us-west-1',
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY.get_secret_value(),
    config=Config(signature_version="s3v4"),
)


def generate_file_name(original_filename: str) -> str:
    extension = original_filename.split(".")[-1]
    return f"{uuid.uuid4()}.{extension}"


def generate_presigned_url(file_name: str, expiration: int = 3600) -> str:
    return s3_client.generate_presigned_url(
        "put_object",
        Params={
            "Bucket": settings.AWS_S3_BUCKET_NAME,
            "Key": file_name,
        },
        ExpiresIn=expiration,
        HttpMethod="PUT",
    )


def generate_presigned_get_url(file_name: str, expiration: int = 3600) -> str:
    return s3_client.generate_presigned_url(
        "get_object",
        Params={
            "Bucket": settings.AWS_S3_BUCKET_NAME,
            "Key": file_name,
        },
        ExpiresIn=expiration,
    )


def get_file_url(file_name: str) -> str:
    return f"https://{settings.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/{file_name}"
