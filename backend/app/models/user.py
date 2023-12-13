from enum import Enum
from sqlmodel import Field, Relationship, SQLModel
from typing import Optional, List, TYPE_CHECKING
from datetime import date, datetime


if TYPE_CHECKING:
    from .study_block import StudyBlock
    from .daily_goal import DailyGoal
    from .study_category import StudyCategory


class Gender(Enum):
    MALE = "MALE"
    FEMALE = "FEMALE"
    OTHER = "OTHER"
    NOT_SPECIFIED = "NOT_SPECIFIED"


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    email: str = Field(index=True, unique=True)
    hashed_password: str
    bio: Optional[str] = None
    job_title: Optional[str] = None
    personal_title: Optional[str] = None
    date_of_birth: Optional[date] = None
    latitude: Optional[float] = Field(default=None, ge=-90, le=90)
    longitude: Optional[float] = Field(default=None, ge=-180, le=180)
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    gender: Optional[Gender] = None
    profile_photo_url: Optional[str] = None
    timezone: Optional[str] = None
    language: Optional[str] = None
    status: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    study_blocks: List["StudyBlock"] = Relationship(
        back_populates="user", sa_relationship_kwargs={"cascade": "delete"}
    )
    daily_goals: List["DailyGoal"] = Relationship(
        back_populates="user", sa_relationship_kwargs={"cascade": "delete"}
    )
    study_categories: List["StudyCategory"] = Relationship(
        back_populates="user",
        sa_relationship_kwargs={"cascade": "delete"},
    )


User.update_forward_refs()
