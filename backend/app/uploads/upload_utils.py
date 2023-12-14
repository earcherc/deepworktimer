import uuid


def generate_file_name(original_filename: str) -> str:
    extension = original_filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{extension}"
    return unique_filename
