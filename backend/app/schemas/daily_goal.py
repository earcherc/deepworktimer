from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


# Base model with shared properties
class DailyGoalBase(BaseModel):
    quantity: int
    block_size: int
    is_selected: bool = Field(default=False)


class DailyGoalCreate(DailyGoalBase):
    pass


class DailyGoalUpdate(BaseModel):
    quantity: Optional[int] = None
    block_size: Optional[int] = None
    is_selected: Optional[bool] = None


class DailyGoal(DailyGoalBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True
