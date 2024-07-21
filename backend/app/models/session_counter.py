from typing import TYPE_CHECKING, Optional
from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime, UTC

if TYPE_CHECKING:
    from .user import User


class SessionCounter(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    is_selected: bool = Field(default=False)
    target: int
    completed: int = Field(default=0)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(UTC),
    )

    # Relationship
    user: "User" = Relationship(back_populates="session_counters")
