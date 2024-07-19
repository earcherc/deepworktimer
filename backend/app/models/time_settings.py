from datetime import datetime
from typing import TYPE_CHECKING, Optional
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .user import User


class TimeSettings(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    is_countdown: bool = Field(default=True)
    is_selected: bool = Field(default=False)
    duration: int = Field(default=55)
    short_break_duration: int = Field(default=5)
    long_break_duration: int = Field(default=30)
    long_break_interval: int = Field(default=6)
    is_sound: bool = Field(default=False)
    sound_interval: int = Field(default=20)
    user_id: int = Field(foreign_key="user.id")

    user: "User" = Relationship(back_populates="time_settings")


TimeSettings.update_forward_refs()
