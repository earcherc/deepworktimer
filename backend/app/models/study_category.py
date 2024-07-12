from typing import TYPE_CHECKING, List, Optional

from sqlmodel import Field, Relationship, SQLModel, UniqueConstraint

if TYPE_CHECKING:
    from .study_block import StudyBlock
    from .user import User


class StudyCategory(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    is_active: bool = Field(default=False)
    user_id: int = Field(foreign_key="user.id")

    # Relationships
    study_blocks: List["StudyBlock"] = Relationship(back_populates="study_category")
    user: "User" = Relationship(back_populates="study_categories")

    # Composite unique constraint
    __table_args__ = (UniqueConstraint("title", "user_id"),)


StudyCategory.update_forward_refs()
