import strawberry


@strawberry.type
class User:
    id: strawberry.ID
    username: str
    email: str


@strawberry.type
class Query:
    @strawberry.field
    def user(self, id: strawberry.ID) -> User:
        # Here you would implement logic to retrieve a user by their ID
        # For now, we return a placeholder user
        return User(id=id, username="testuser", email="test@example.com")

    @strawberry.field
    def hello(self) -> str:
        return "Hello, world!"


schema = strawberry.Schema(query=Query)
