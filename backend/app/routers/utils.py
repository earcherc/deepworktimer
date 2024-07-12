from fastapi import HTTPException, Request


async def get_current_user_id(request: Request) -> int:
    user_id = request.state.user_id
    if user_id is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user_id
