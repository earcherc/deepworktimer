from sqlmodel import create_engine, Session
from config import Config

# Construct the SQLALCHEMY_DATABASE_URL from configuration variables
SQLALCHEMY_DATABASE_URL = (
    f"postgresql://{Config.POSTGRES_USER}:{Config.POSTGRES_PASSWORD}"
    f"@{Config.DATABASE_HOST}/{Config.DATABASE_NAME}"
)

# Create the SQLModel engine
engine = create_engine(SQLALCHEMY_DATABASE_URL, echo=True)


def get_session():
    """
    Dependency that provides a SQLModel session and automatically closes it after use.
    """
    with Session(engine) as session:
        yield session
