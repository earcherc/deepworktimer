from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING


if TYPE_CHECKING:
    from .user import User
    from .study_block import StudyBlock


class UserCategoryLink(SQLModel, table=True):
    user_id: Optional[int] = Field(
        default=None,
        foreign_key="user.id",
        primary_key=True,
    )
    study_category_id: Optional[int] = Field(
        default=None, foreign_key="studycategory.id", primary_key=True
    )


class StudyCategory(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(index=True)

    # Relationships
    study_blocks: List["StudyBlock"] = Relationship(back_populates="study_category")
    users: List["User"] = Relationship(
        back_populates="study_categories",
        link_model=UserCategoryLink,
    )


StudyCategory.update_forward_refs()
