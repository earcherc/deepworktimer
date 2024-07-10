from typing import Optional
from pydantic import BaseModel
from datetime import datetime

# Shared properties
class StudyBlockBase(BaseModel):
    start: datetime
    end: Optional[datetime] = None
    rating: Optional[float] = None
    is_countdown: bool = True

# Properties to receive via API on creation
class StudyBlockCreate(StudyBlockBase):
    user_id: int
    daily_goal_id: int
    study_category_id: int

# Properties to receive via API on update
class StudyBlockUpdate(StudyBlockBase):
    pass

# Properties shared by models stored in DB and returned to client
class StudyBlock(StudyBlockBase):
    id: Optional[int] = None

    class Config:
        orm_mode = True
