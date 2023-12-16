import strawberry
from ...models import User, DailyGoal, StudyBlock, StudyCategory


@strawberry.experimental.pydantic.input(
    model=DailyGoal,
    fields=["quantity", "block_size", "is_active"],
)
class DailyGoalInput:
    pass


@strawberry.experimental.pydantic.input(
    model=StudyBlock,
    fields=[
        "start",
        "end",
        "title",
        "rating",
        "daily_goal_id",
        "study_category_id",
    ],
)
class StudyBlockInput:
    pass


@strawberry.experimental.pydantic.input(
    model=StudyCategory, fields=["title", "selected"]
)
class StudyCategoryInput:
    pass


@strawberry.experimental.pydantic.input(
    model=User,
    fields=[
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
    ],
)
class UserInput:
    pass
