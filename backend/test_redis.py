import asyncio
from redis.asyncio import Redis


async def test_redis():
    # Initialize the Redis client
    redis = Redis(host="localhost", port=6379)

    # Test setting a value
    await redis.set("test_key", "hello")

    # Test getting the value back
    value = await redis.get("test_key")
    print(f"Value from Redis: {value.decode()}")

    # Correct way to close the Redis connection
    await redis.aclose()


# Run the test
asyncio.run(test_redis())
