from datetime import date, datetime
from enum import Enum
from typing import Dict, Optional

from pydantic import BaseModel, EmailStr, Field


class Gender(str, Enum):
    MALE = "MALE"
    FEMALE = "FEMALE"
    OTHER = "OTHER"
    NOT_SPECIFIED = "NOT_SPECIFIED"


class UserBase(BaseModel):
    username: str
    email: EmailStr
    bio: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    gender: Optional[Gender] = None
    profile_photo_key: Optional[str] = None
    profile_photo_urls: Optional[Dict[str, Optional[str]]] = None


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    bio: Optional[str] = None
    date_of_birth: Optional[date] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    gender: Optional[Gender] = None
    profile_photo_key: Optional[str] = None


class User(UserBase):
    id: int
    created_at: datetime
    is_active: bool

    class Config:
        orm_mode = True
