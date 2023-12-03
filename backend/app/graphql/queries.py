import strawberry
from typing import Optional
from sqlmodel import select
from ..models import User, DailyGoal, StudyCategory, StudyBlock
from ..database import get_session
from .schemas.models import UserType, DailyGoalType, StudyBlockType, StudyCategoryType


@strawberry.type
class Query:
    @strawberry.field
    def get_user(
        self, info: strawberry.types.Info, id: strawberry.ID
    ) -> Optional[UserType]:
        session = next(get_session())
        statement = select(User).where(User.id == id)
        db_user = session.exec(statement).first()
        return User.from_orm(db_user) if db_user else None

    @strawberry.field
    def get_daily_goal(self, id: strawberry.ID) -> Optional[DailyGoalType]:
        session = next(get_session())
        statement = select(DailyGoal).where(DailyGoal.id == id)
        db_daily_goal = session.exec(statement).first()
        return DailyGoal.from_orm(db_daily_goal) if db_daily_goal else None

    @strawberry.field
    def get_study_block(self, id: strawberry.ID) -> Optional[StudyBlockType]:
        session = next(get_session())
        statement = select(StudyBlock).where(StudyBlock.id == id)
        db_study_block = session.exec(statement).first()
        return StudyBlock.from_orm(db_study_block) if db_study_block else None

    @strawberry.field
    def get_study_category(self, id: strawberry.ID) -> Optional[StudyCategoryType]:
        session = next(get_session())
        statement = select(StudyCategory).where(StudyCategory.id == id)
        db_study_category = session.exec(statement).first()
        return StudyCategory.from_orm(db_study_category) if db_study_category else None


schema = strawberry.Schema(query=Query)
