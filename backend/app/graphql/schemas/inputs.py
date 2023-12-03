import strawberry
from ...models import User, DailyGoal, StudyBlock, StudyCategory


@strawberry.experimental.pydantic.input(
    model=DailyGoal, fields=["quantity", "block_size", "user_id"]
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
        "user_id",
        "daily_goal_id",
        "study_category_id",
    ],
)
class StudyBlockInput:
    pass


@strawberry.experimental.pydantic.input(model=StudyCategory, fields=["title"])
class StudyCategoryInput:
    pass


@strawberry.experimental.pydantic.input(model=User, fields=["username", "email", "bio"])
class UserInput:
    pass
