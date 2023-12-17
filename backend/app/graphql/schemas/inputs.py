from typing import Optional
import strawberry

from .models import GenderStrawberry


@strawberry.input
class StudyCategoryInput:
    title: Optional[str] = None
    selected: Optional[bool] = None


@strawberry.input
class DailyGoalInput:
    quantity: Optional[int] = None
    block_size: Optional[int] = None
    is_active: Optional[bool] = None


@strawberry.input
class StudyBlockInput:
    start: Optional[str] = None
    end: Optional[str] = None
    title: Optional[str] = None
    rating: Optional[int] = None
    daily_goal_id: Optional[int] = None
    study_category_id: Optional[int] = None


@strawberry.input
class UserInput:
    username: Optional[str] = None
    email: Optional[str] = None
    bio: Optional[str] = None
    job_title: Optional[str] = None
    personal_title: Optional[str] = None
    date_of_birth: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    gender: Optional[GenderStrawberry] = None
    profile_photo_url: Optional[str] = None
    timezone: Optional[str] = None
    language: Optional[str] = None
    status: Optional[str] = None
