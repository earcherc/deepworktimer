from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class DailyGoalBase(BaseModel):
    total_minutes: int
    is_selected: bool = Field(default=False)


class DailyGoalCreate(DailyGoalBase):
    pass


class DailyGoalUpdate(BaseModel):
    total_minutes: Optional[int] = None
    is_selected: Optional[bool] = None


class DailyGoal(DailyGoalBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True
