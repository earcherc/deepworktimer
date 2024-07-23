from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class SessionCounterBase(BaseModel):
    target: int
    is_selected: bool = False


class SessionCounterCreate(SessionCounterBase):
    completed: Optional[int] = None


class SessionCounterUpdate(BaseModel):
    target: Optional[int] = None
    is_selected: Optional[bool] = None
    completed: Optional[int] = None


class SessionCounter(SessionCounterBase):
    id: int
    user_id: int
    completed: int
    created_at: datetime

    class Config:
        orm_mode = True
