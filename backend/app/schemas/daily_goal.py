from typing import Optional
from pydantic import BaseModel

# Shared properties
class DailyGoalBase(BaseModel):
    quantity: int
    block_size: int
    is_active: bool

# Properties to receive on item creation
class DailyGoalCreate(DailyGoalBase):
    pass

# Properties to receive on item update
class DailyGoalUpdate(DailyGoalBase):
    pass

# Properties shared by models stored in DB and returned to client
class DailyGoal(DailyGoalBase):
    id: Optional[int] = None
    user_id: Optional[int] = None

    class Config:
        orm_mode = True
