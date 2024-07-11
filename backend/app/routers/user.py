from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from ..database import get_session
from ..models import User
from ..schemas import UserCreate, UserUpdate, User as UserSchema
from ..auth import get_password_hash
from typing import List

router = APIRouter()

async def get_current_user_id(request: Request) -> int:
    user_id = request.state.user_id
    if user_id is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user_id

@router.post("/", response_model=UserSchema)
async def create_user(user: UserCreate, db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(User).where(User.email == user.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    db_user = User(**user.dict(exclude={"password"}), hashed_password=hashed_password)
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

@router.get("/{user_id}", response_model=UserSchema)
async def read_user(user_id: int, db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(User).where(User.id == user_id))
    db_user = result.scalar_one_or_none()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.get("/", response_model=List[UserSchema])
async def read_users(skip: int = 0, limit: int = 10, db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(User).offset(skip).limit(limit))
    return result.scalars().all()

@router.patch("/", response_model=UserSchema)
async def update_current_user(
    user: UserUpdate,
    db: AsyncSession = Depends(get_session),
    user_id: int = Depends(get_current_user_id)
):
    result = await db.execute(select(User).where(User.id == user_id))
    db_user = result.scalar_one_or_none()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_data = user.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_user, key, value)
    
    await db.commit()
    await db.refresh(db_user)
    return db_user

@router.delete("/", response_model=bool)
async def delete_current_user(
    db: AsyncSession = Depends(get_session),
    user_id: int = Depends(get_current_user_id)
):
    result = await db.execute(select(User).where(User.id == user_id))
    db_user = result.scalar_one_or_none()
    if db_user is None:
        return False
    await db.delete(db_user)
    await db.commit()
    return True