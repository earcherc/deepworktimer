from typing import Optional
from pydantic import BaseModel
from datetime import date

# Shared properties
class UserBase(BaseModel):
    username: str
    email: str
    bio: Optional[str] = None
    job_title: Optional[str] = None
    personal_title: Optional[str] = None
    date_of_birth: Optional[date] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    gender: Optional[str] = None
    profile_photo_url: Optional[str] = None
    timezone: Optional[str] = None
    language: Optional[str] = None
    status: Optional[str] = None

# Properties to receive via API on creation
class UserCreate(UserBase):
    hashed_password: str

# Properties to receive via API on update
class UserUpdate(UserBase):
    pass

# Properties shared by models stored in DB and returned to client
class User(UserBase):
    id: Optional[int] = None

    class Config:
        orm_mode = True
