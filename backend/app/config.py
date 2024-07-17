from pydantic import AnyHttpUrl, BaseSettings, PostgresDsn, SecretStr


class Settings(BaseSettings):
    # Core settings
    APP_ENV: str = "development"
    DEBUG: bool = APP_ENV == "development"
    COOKIE_DOMAIN: str = "localhost" if DEBUG else "deepworktimer.io"

    # Database settings
    POSTGRES_USER: str = "docker"
    POSTGRES_PASSWORD: SecretStr = "docker"
    DATABASE_HOST: str = "docker"
    DATABASE_NAME: str = "docker"
    DATABASE_URL: PostgresDsn = None

    # AWS settings
    AWS_ACCESS_KEY_ID: str
    AWS_SECRET_ACCESS_KEY: SecretStr
    AWS_S3_BUCKET_NAME: str
    AWS_REGION: str = "us-west-1"

    # Redis settings
    REDIS_URL: str = "redis://redis:6379"

    # CORS settings
    ALLOWED_ORIGINS: list[AnyHttpUrl] = [
        "http://localhost:3000",
        "https://deepworktimer.io",
    ]
    ALLOWED_HOSTS: list[str] = ["deepworktimer.io", "localhost", "127.0.0.1"]

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
