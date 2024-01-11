from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional, TYPE_CHECKING


if TYPE_CHECKING:
    from .user import User
    from .daily_goal import DailyGoal
    from .study_category import StudyCategory


class StudyBlock(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    start: datetime
    end: Optional[datetime] = Field(default=None)
    rating: Optional[float] = Field(default=None, ge=0, le=5)  # Rating between 0 and 5
    is_countdown: bool = Field(default=True)

    # Foreign keys
    user_id: int = Field(foreign_key="user.id", index=True)
    daily_goal_id: int = Field(foreign_key="dailygoal.id", index=True)
    study_category_id: int = Field(foreign_key="studycategory.id", index=True)

    # Relationships
    user: "User" = Relationship(back_populates="study_blocks")
    daily_goal: "DailyGoal" = Relationship(back_populates="study_blocks")
    study_category: "StudyCategory" = Relationship(back_populates="study_blocks")


StudyBlock.update_forward_refs()
