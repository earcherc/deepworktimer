from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from ..auth.auth_utils import hash_password
from ..database import get_session
from ..models.user import User
from ..schemas.user import UserCreate, UserUpdate, User as UserSchema
from ..uploads.upload_services import get_profile_photo_urls
from .utils import get_current_user_id

router = APIRouter()


@router.post("/", response_model=UserSchema)
async def create_user(user: UserCreate, db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(User).where(User.email == user.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = hash_password(user.password)
    db_user = User(**user.dict(exclude={"password"}), hashed_password=hashed_password)
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user


@router.get("/me", response_model=UserSchema)
async def read_current_user(
    db: AsyncSession = Depends(get_session), user_id: int = Depends(get_current_user_id)
):
    result = await db.execute(select(User).where(User.id == user_id))
    db_user = result.scalar_one_or_none()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    user_dict = db_user.__dict__
    user_dict["profile_photo_urls"] = await get_profile_photo_urls(
        db_user.profile_photo_key
    )
    return user_dict


@router.get("/{user_id}", response_model=UserSchema)
async def read_user(user_id: int, db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(User).where(User.id == user_id))
    db_user = result.scalar_one_or_none()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    user_dict = db_user.__dict__
    user_dict["profile_photo_urls"] = await get_profile_photo_urls(
        db_user.profile_photo_key
    )
    return user_dict


@router.get("/", response_model=List[UserSchema])
async def read_users(
    skip: int = 0, limit: int = 10, db: AsyncSession = Depends(get_session)
):
    result = await db.execute(select(User).offset(skip).limit(limit))
    users = result.scalars().all()

    user_list = []
    for user in users:
        user_dict = user.__dict__
        user_dict["profile_photo_urls"] = await get_profile_photo_urls(
            user.profile_photo_key
        )
        user_list.append(user_dict)

    return user_list


@router.patch("/", response_model=UserSchema)
async def update_current_user(
    user: UserUpdate,
    db: AsyncSession = Depends(get_session),
    user_id: int = Depends(get_current_user_id),
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
    user_dict = db_user.__dict__
    user_dict["profile_photo_urls"] = await get_profile_photo_urls(
        db_user.profile_photo_key
    )
    return user_dict


@router.delete("/", response_model=bool)
async def delete_current_user(
    db: AsyncSession = Depends(get_session), user_id: int = Depends(get_current_user_id)
):
    result = await db.execute(select(User).where(User.id == user_id))
    db_user = result.scalar_one_or_none()
    if db_user is None:
        return False
    await db.delete(db_user)
    await db.commit()
    return True
