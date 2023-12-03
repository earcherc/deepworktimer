from sqlmodel import Field, Relationship, SQLModel
from typing import Optional, List, TYPE_CHECKING
from .study_category import UserCategoryLink


if TYPE_CHECKING:
    from .study_block import StudyBlock
    from .daily_goal import DailyGoal
    from .study_category import StudyCategory


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True)
    email: str
    hashed_password: str
    bio: Optional[str] = None

    # Relationships
    study_blocks: List["StudyBlock"] = Relationship(back_populates="user")
    daily_goals: List["DailyGoal"] = Relationship(back_populates="user")
    study_categories: List["StudyCategory"] = Relationship(
        back_populates="users", link_model=UserCategoryLink
    )


User.update_forward_refs()
