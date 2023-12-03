import strawberry
from ...models import User, DailyGoal, StudyBlock, StudyCategory


# Strawberry GraphQL type using SQLModel (Pydantic) class
# Be wary of exposing hashed_password field... need to fix.
@strawberry.experimental.pydantic.type(model=User, all_fields=True)
class UserType:
    pass


@strawberry.experimental.pydantic.type(model=DailyGoal, all_fields=True)
class DailyGoalType:
    pass


@strawberry.experimental.pydantic.type(model=StudyBlock, all_fields=True)
class StudyBlockType:
    pass


@strawberry.experimental.pydantic.type(model=StudyCategory, all_fields=True)
class StudyCategoryType:
    pass
