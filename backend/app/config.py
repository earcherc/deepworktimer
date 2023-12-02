import os


class Config:
    # Core settings
    APP_ENV = os.getenv("APP_ENV", "development")
    SECRET_KEY = os.getenv("SECRET_KEY")
    ALGORITHM = os.getenv("ALGORITHM", "HS256")

    # Database settings
    POSTGRES_USER = os.getenv("POSTGRES_USER")
    POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")
    DATABASE_HOST = os.getenv("DATABASE_HOST")
    DATABASE_NAME = os.getenv("DATABASE_NAME")
