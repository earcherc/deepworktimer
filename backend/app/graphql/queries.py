import strawberry
from typing import List, Optional
from sqlmodel import select
from ..models import User, DailyGoal, StudyCategory, StudyBlock
from ..database import get_session
from .schemas.models import UserType, DailyGoalType, StudyBlockType, StudyCategoryType


@strawberry.type
class Query:
    @strawberry.field
    def current_user(self, info: strawberry.types.Info) -> Optional[UserType]:
        user_id = getattr(info.context["request"].state, "user_id", None)
        if user_id is None:
            return None

        session = next(get_session())
        statement = select(User).where(User.id == user_id)
        db_user = session.exec(statement).first()
        return User.from_orm(db_user) if db_user else None

    @strawberry.field
    def user_daily_goals(self, info: strawberry.types.Info) -> List[DailyGoalType]:
        user_id = getattr(info.context["request"].state, "user_id", None)
        if user_id is None:
            return []

        session = next(get_session())
        statement = select(DailyGoal).where(DailyGoal.user_id == user_id)
        daily_goals = session.exec(statement).all()
        return [DailyGoal.from_orm(goal) for goal in daily_goals]

    @strawberry.field
    def user_study_blocks(self, info: strawberry.types.Info) -> List[StudyBlockType]:
        user_id = getattr(info.context["request"].state, "user_id", None)
        if user_id is None:
            return []

        session = next(get_session())
        statement = select(StudyBlock).where(StudyBlock.userId == user_id)
        study_blocks = session.exec(statement).all()
        return [StudyBlock.from_orm(block) for block in study_blocks]

    @strawberry.field
    def all_study_categories(self) -> List[StudyCategoryType]:
        session = next(get_session())
        statement = select(StudyCategory)
        study_categories = session.exec(statement).all()
        return [StudyCategory.from_orm(category) for category in study_categories]


schema = strawberry.Schema(query=Query)
