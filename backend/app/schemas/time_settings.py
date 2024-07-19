# schemas/time_settings.py

from typing import Optional
from pydantic import BaseModel, Field


class TimeSettingsBase(BaseModel):
    is_countdown: bool = Field(default=True)
    duration: int = Field(default=55)
    short_break_duration: int = Field(default=5)
    long_break_duration: int = Field(default=30)
    long_break_interval: int = Field(default=6)
    is_sound: bool = Field(default=False)
    sound_interval: int = Field(default=20)


class TimeSettingsCreate(TimeSettingsBase):
    pass


class TimeSettingsUpdate(BaseModel):
    is_countdown: Optional[bool] = None
    is_selected: Optional[bool] = None
    duration: Optional[int] = None
    short_break_duration: Optional[int] = None
    long_break_duration: Optional[int] = None
    long_break_interval: Optional[int] = None
    is_sound: Optional[bool] = None
    sound_interval: Optional[int] = None


class TimeSettings(TimeSettingsBase):
    id: int
    user_id: int
    is_selected: bool

    class Config:
        orm_mode = True
