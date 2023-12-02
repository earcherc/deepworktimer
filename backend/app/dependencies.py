from fastapi import Request


async def get_redis(request: Request):
    """
    Dependency function to get the Redis connection.

    Args:
        request: The request object from which the application state can be accessed.

    Returns:
        The Redis connection.
    """
    return request.app.state.redis
