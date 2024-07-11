from pydantic import BaseSettings, PostgresDsn, AnyHttpUrl, SecretStr


class Settings(BaseSettings):
    # Core settings
    APP_ENV: str = "development"
    DEBUG: bool = APP_ENV == "development"

    # Database settings
    POSTGRES_USER: str
    POSTGRES_PASSWORD: SecretStr
    DATABASE_HOST: str
    DATABASE_NAME: str
    DATABASE_URL: PostgresDsn = None

    # AWS settings
    AWS_ACCESS_KEY_ID: str
    AWS_SECRET_ACCESS_KEY: SecretStr
    AWS_S3_BUCKET_NAME: str

    # Redis settings
    REDIS_URL: str = "redis://redis:6379"

    # CORS settings
    ALLOWED_ORIGINS: list[AnyHttpUrl] = ["http://localhost:3000"]

    # JWT settings
    JWT_SECRET_KEY: SecretStr
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"
        case_sensitive = True

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if not self.DATABASE_URL:
            self.DATABASE_URL = PostgresDsn.build(
                scheme="postgresql+asyncpg",
                user=self.POSTGRES_USER,
                password=self.POSTGRES_PASSWORD.get_secret_value(),
                host=self.DATABASE_HOST,
                path=f"/{self.DATABASE_NAME}",
            )


settings = Settings()
