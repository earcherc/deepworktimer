import strawberry
from sqlmodel import select
from ...models import User
from ...database import get_session
from ..schemas.models import UserType
from ..schemas.inputs import UserInput


@strawberry.type
class UserMutations:
    @strawberry.mutation
    def update_current_user(
        self, user: UserInput, info: strawberry.types.Info
    ) -> UserType:
        user_id = getattr(info.context["request"].state, "user_id", None)
        if user_id is None:
            return None

        session = next(get_session())
        db_user = session.exec(select(User).where(User.id == user_id)).first()

        if db_user:
            user_data = strawberry.asdict(user)
            for field, value in user_data.items():
                setattr(db_user, field, value)
            session.commit()
            session.refresh(db_user)
            return User.from_orm(db_user)

        return None

    @strawberry.mutation
    def delete_current_user(self, info: strawberry.types.Info) -> bool:
        user_id = getattr(info.context["request"].state, "user_id", None)
        if user_id is None:
            return False

        session = next(get_session())
        db_user = session.exec(select(User).where(User.id == user_id)).first()

        if db_user:
            session.delete(db_user)
            session.commit()
            return True

        return False
