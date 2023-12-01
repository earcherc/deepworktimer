from fastapi import FastAPI
from strawberry.fastapi import GraphQLRouter
import strawberry


@strawberry.type
class Query:
    @strawberry.field
    def hello(self) -> str:
        return "Hello, world!"


schema = strawberry.Schema(query=Query)

app = FastAPI()
app.add_route("/graphql", GraphQLRouter(schema))
