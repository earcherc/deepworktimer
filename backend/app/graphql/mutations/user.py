import strawberry
import dataclasses
from sqlmodel import select
from ...models import User
from ...database import get_session
from ..schemas.models import UserType
from ..schemas.inputs import UserInput


@strawberry.type
class UserMutations:
    @strawberry.mutation
    def update_user(self, id: int, user: UserInput) -> UserType:
        session = next(get_session())
        db_user = session.exec(select(User).where(User.id == id)).first()

        if db_user:
            user_data = dataclasses.asdict(user)
            for field, value in user_data.items():
                setattr(db_user, field, value)
            session.commit()
            session.refresh(db_user)
            return User.from_orm(db_user)

        return None

    @strawberry.mutation
    def delete_user(self, id: int) -> bool:
        session = next(get_session())
        db_user = session.exec(select(User).where(User.id == id)).first()

        if db_user:
            session.delete(db_user)
            session.commit()
            return True

        return False
