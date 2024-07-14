from datetime import UTC, datetime
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import UniqueConstraint
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .study_block import StudyBlock
    from .user import User


class DailyGoal(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    quantity: int
    block_size: int
    is_selected: bool = Field(default=False)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(UTC).replace(tzinfo=None)
    )
    user_id: int = Field(foreign_key="user.id", index=True)

    # Relationships
    user: "User" = Relationship(back_populates="daily_goals")
    study_blocks: List["StudyBlock"] = Relationship(back_populates="daily_goal")

    __table_args__ = (
        UniqueConstraint(
            "user_id", "quantity", "block_size", name="uq_user_quantity_block_size"
        ),
    )


DailyGoal.update_forward_refs()
