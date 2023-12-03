import strawberry
from typing import Optional
from sqlmodel import Session, select
from ..models import User as UserModel
from .schemas import User


@strawberry.type
class Query:
    @strawberry.field
    def get_user(
        self, info: strawberry.types.Info, id: strawberry.ID
    ) -> Optional[User]:
        session: Session = info.context["session"]
        statement = select(UserModel).where(UserModel.id == id)
        user = session.exec(statement).first()

        return User.from_orm(user) if user else None


schema = strawberry.Schema(query=Query)
