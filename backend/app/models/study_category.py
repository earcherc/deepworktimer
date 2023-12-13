from sqlmodel import SQLModel, Field, Relationship, UniqueConstraint
from typing import Optional, List, TYPE_CHECKING


if TYPE_CHECKING:
    from .user import User
    from .study_block import StudyBlock


class StudyCategory(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(index=True)

    # Foreign key
    user_id: int = Field(foreign_key="user.id")

    # Relationships
    study_blocks: List["StudyBlock"] = Relationship(back_populates="study_category")
    user: "User" = Relationship(back_populates="study_categories")

    # Composite unique constraint
    __table_args__ = (UniqueConstraint("title", "user_id"),)


StudyCategory.update_forward_refs()
