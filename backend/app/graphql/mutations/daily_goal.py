import strawberry
from sqlmodel import select, update
from ...models import DailyGoal
from ...database import get_session
from ..schemas.models import DailyGoalType
from ..schemas.inputs import DailyGoalInput


@strawberry.type
class DailyGoalMutations:
    @strawberry.mutation
    def create_daily_goal(
        self, daily_goal: DailyGoalInput, info: strawberry.types.Info
    ) -> DailyGoalType:
        user_id = getattr(info.context["request"].state, "user_id", None)
        if user_id is None:
            return None

        session = next(get_session())
        daily_goal_data = strawberry.asdict(daily_goal)
        daily_goal_data["user_id"] = user_id
        db_daily_goal = DailyGoal(**daily_goal_data)
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
            daily_goal_data = strawberry.asdict(daily_goal)
            if daily_goal_data.get("is_active"):
                session.exec(
                    update(DailyGoal)
                    .where(DailyGoal.id != id, DailyGoal.is_active == True)
                    .values(is_active=False)
                )

            # Update the fields if they are not None
            for field, value in daily_goal_data.items():
                if value is not None:
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
