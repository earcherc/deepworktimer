import strawberry
from sqlmodel import select
from typing import Optional
from ...models import DailyGoal
from ...database import get_session
from ..schemas.models import DailyGoalType
from ..schemas.inputs import DailyGoalInput


@strawberry.type
class DailyGoalMutations:
    @strawberry.mutation
    def create_daily_goal(self, daily_goal: DailyGoalInput) -> DailyGoalType:
        session = next(get_session())
        daily_goal_dict = {
            "quantity": daily_goal.quantity,
            "block_size": daily_goal.block_size,
            "user_id": daily_goal.user_id,
        }
        db_daily_goal = DailyGoal(**daily_goal_dict)
        session.add(db_daily_goal)
        session.commit()
        session.refresh(db_daily_goal)

        return DailyGoal.from_orm(db_daily_goal)

    @strawberry.mutation
    def update_daily_goal(self, id: int, daily_goal: DailyGoalInput) -> DailyGoalType:
        session = next(get_session())
        db_daily_goal = session.exec(
            select(DailyGoal).where(DailyGoal.id == id)
        ).first()

        if db_daily_goal:
            for field, value in daily_goal.dict().items():
                setattr(db_daily_goal, field, value)
            session.commit()
            session.refresh(db_daily_goal)
            return DailyGoal.from_orm(db_daily_goal)

        return None

    @strawberry.mutation
    def delete_daily_goal(self, id: int) -> bool:
        session = next(get_session())
        db_daily_goal = session.exec(
            select(DailyGoal).where(DailyGoal.id == id)
        ).first()

        if db_daily_goal:
            session.delete(db_daily_goal)
            session.commit()
            return True

        return False
