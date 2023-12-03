import strawberry
from typing import Optional


@strawberry.type
class User:
    id: strawberry.ID
    username: str
    email: str
    bio: Optional[str]
