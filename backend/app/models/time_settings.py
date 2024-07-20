from datetime import datetime
from typing import TYPE_CHECKING, Optional
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .user import User


class TimeSettings(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    is_countdown: bool = Field(default=True)
    is_selected: bool = Field(default=False)
    duration: Optional[int] = Field(default=None)
    short_break_duration: Optional[int] = Field(default=None)
    long_break_duration: Optional[int] = Field(default=None)
    long_break_interval: Optional[int] = Field(default=None)
    is_sound: Optional[bool] = Field(default=None)
    sound_interval: Optional[int] = Field(default=None)
    user_id: int = Field(foreign_key="user.id")

    user: "User" = Relationship(back_populates="time_settings")


TimeSettings.update_forward_refs()
