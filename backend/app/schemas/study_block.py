from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime

class StudyBlockBase(BaseModel):
    start: datetime
    end: Optional[datetime] = None
    rating: Optional[float] = Field(None, ge=0, le=5)
    is_countdown: bool = True

class StudyBlockCreate(StudyBlockBase):
    user_id: int
    daily_goal_id: int
    study_category_id: int

class StudyBlockUpdate(BaseModel):
    end: Optional[datetime] = None
    rating: Optional[float] = Field(None, ge=0, le=5)

class StudyBlock(StudyBlockBase):
    id: int
    user_id: int
    daily_goal_id: int
    study_category_id: int

    class Config:
        orm_mode = True