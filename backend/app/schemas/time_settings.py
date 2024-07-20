from typing import Optional
from pydantic import BaseModel, Field


class TimeSettingsBase(BaseModel):
    is_countdown: bool = Field(...)
    duration: Optional[int] = Field(default=None)
    short_break_duration: Optional[int] = Field(default=None)
    long_break_duration: Optional[int] = Field(default=None)
    long_break_interval: Optional[int] = Field(default=None)
    is_sound: Optional[bool] = Field(default=None)
    sound_interval: Optional[int] = Field(default=None)


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
