from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING


if TYPE_CHECKING:
    from .user import User
    from .study_block import StudyBlock


class DailyGoal(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    quantity: int
    block_size: int
    created_at: datetime = Field(default_factory=datetime.now)
    is_active: bool = Field(default=False)

    # Foreign key
    user_id: int = Field(foreign_key="user.id", index=True)

    # Relationships
    user: "User" = Relationship(back_populates="daily_goals")
    study_blocks: List["StudyBlock"] = Relationship(back_populates="daily_goal")


DailyGoal.update_forward_refs()
