import strawberry
from typing import Optional
from sqlmodel import select
from ..models import User as UserModel
from ..database import get_session
from .schemas import UserType


@strawberry.type
class Query:
    @strawberry.field
    def get_user(
        self, info: strawberry.types.Info, id: strawberry.ID
    ) -> Optional[UserType]:
        session = next(get_session())
        statement = select(UserModel).where(UserModel.id == id)
        db_user = session.exec(statement).first()
        return UserModel.from_orm(db_user) if db_user else None


schema = strawberry.Schema(query=Query)
