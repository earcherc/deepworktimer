from datetime import UTC, datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import Column, DateTime
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .daily_goal import DailyGoal
    from .study_category import StudyCategory
    from .user import User


class StudyBlock(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    start_time: datetime = Field(
        sa_column=Column(DateTime(timezone=True)),
        default_factory=lambda: datetime.now(UTC),
    )
    end_time: Optional[datetime] = Field(
        sa_column=Column(DateTime(timezone=True)), default=None
    )
    rating: Optional[float] = Field(default=None, ge=0, le=5)
    is_countdown: bool = Field(default=True)

    # Foreign keys
    user_id: int = Field(foreign_key="user.id", index=True)
    daily_goal_id: Optional[int] = Field(
        foreign_key="dailygoal.id", index=True, default=None
    )
    study_category_id: Optional[int] = Field(
        foreign_key="studycategory.id", index=True, default=None
    )

    # Relationships
    user: "User" = Relationship(back_populates="study_blocks")
    daily_goal: Optional["DailyGoal"] = Relationship(back_populates="study_blocks")
    study_category: Optional["StudyCategory"] = Relationship(
        back_populates="study_blocks"
    )


StudyBlock.update_forward_refs()
