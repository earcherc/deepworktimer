from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class StudyBlockBase(BaseModel):
    is_countdown: bool = Field(default=True)


class StudyBlockCreate(StudyBlockBase):
    daily_goal_id: Optional[int] = None
    study_category_id: Optional[int] = None


class StudyBlockUpdate(BaseModel):
    end_time: Optional[datetime] = None
    rating: Optional[float] = Field(None, ge=0, le=5)


class StudyBlock(StudyBlockBase):
    id: int
    start_time: datetime
    end_time: Optional[datetime] = None
    rating: Optional[float] = None
    user_id: int
    daily_goal_id: Optional[int] = None
    study_category_id: Optional[int] = None

    class Config:
        orm_mode = True


class StudyBlockQuery(BaseModel):
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    skip: Optional[int] = Field(default=0, ge=0)
    limit: Optional[int] = Field(default=100, ge=1, le=1000)
