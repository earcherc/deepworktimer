import strawberry
from ..models import User


# Strawberry GraphQL type using SQLModel (Pydantic) class
@strawberry.experimental.pydantic.type(model=User, all_fields=True)
class UserType:
    pass
