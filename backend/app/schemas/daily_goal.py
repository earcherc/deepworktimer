from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime

# Base model with shared properties
class DailyGoalBase(BaseModel):
    quantity: int
    block_size: int
    is_active: bool = Field(default=False)

# Model for creating a new DailyGoal
class DailyGoalCreate(DailyGoalBase):
    user_id: int

# Model for updating an existing DailyGoal
class DailyGoalUpdate(BaseModel):
    quantity: Optional[int] = None
    block_size: Optional[int] = None
    is_active: Optional[bool] = None

# Full DailyGoal model (for responses)
class DailyGoal(DailyGoalBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True