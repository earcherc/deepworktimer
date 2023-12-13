import strawberry
from ...models import User, DailyGoal, StudyBlock, StudyCategory, Gender

strawberry.enum(Gender)


# Strawberry GraphQL type using SQLModel (Pydantic) class
@strawberry.experimental.pydantic.type(
    model=User,
    fields=[
        "id",
        "username",
        "email",
        "bio",
        "job_title",
        "personal_title",
        "date_of_birth",
        "latitude",
        "longitude",
        "first_name",
        "last_name",
        "gender",
        "profile_photo_url",
        "timezone",
        "language",
        "status",
        "created_at",
    ],
)
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
