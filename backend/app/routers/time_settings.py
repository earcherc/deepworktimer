from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import and_, select, update

from ..database import get_session
from ..models.time_settings import TimeSettings
from ..schemas.time_settings import (
    TimeSettingsCreate,
    TimeSettingsUpdate,
    TimeSettings as TimeSettingsSchema,
)
from .utils import get_current_user_id

router = APIRouter()


@router.post("/", response_model=TimeSettingsSchema)
async def create_time_settings(
    time_settings: TimeSettingsCreate,
    db: AsyncSession = Depends(get_session),
    user_id: int = Depends(get_current_user_id),
):
    # Set all existing time settings for the user to not selected
    await db.execute(
        update(TimeSettings)
        .where(
            and_(
                TimeSettings.user_id == user_id,
                TimeSettings.is_selected == True,
            )
        )
        .values(is_selected=False)
    )

    # Create new time settings and set it as selected
    db_time_settings = TimeSettings(
        **time_settings.dict(), user_id=user_id, is_selected=True
    )
    db.add(db_time_settings)
    await db.commit()
    await db.refresh(db_time_settings)
    return db_time_settings


@router.get("/{time_settings_id}", response_model=TimeSettingsSchema)
async def read_time_settings(
    time_settings_id: int,
    db: AsyncSession = Depends(get_session),
    user_id: int = Depends(get_current_user_id),
):
    result = await db.execute(
        select(TimeSettings).where(
            TimeSettings.id == time_settings_id, TimeSettings.user_id == user_id
        )
    )
    db_time_settings = result.scalar_one_or_none()
    if db_time_settings is None:
        raise HTTPException(status_code=404, detail="TimeSettings not found")
    return db_time_settings


@router.get("/", response_model=List[TimeSettingsSchema])
async def read_time_settings_list(
    skip: int = 0,
    limit: int = 10,
    db: AsyncSession = Depends(get_session),
    user_id: int = Depends(get_current_user_id),
):
    result = await db.execute(
        select(TimeSettings)
        .where(TimeSettings.user_id == user_id)
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()


@router.patch("/{time_settings_id}", response_model=TimeSettingsSchema)
async def update_time_settings(
    time_settings_id: int,
    time_settings: TimeSettingsUpdate,
    db: AsyncSession = Depends(get_session),
    user_id: int = Depends(get_current_user_id),
):
    result = await db.execute(
        select(TimeSettings).where(
            TimeSettings.id == time_settings_id, TimeSettings.user_id == user_id
        )
    )
    db_time_settings = result.scalar_one_or_none()
    if db_time_settings is None:
        raise HTTPException(status_code=404, detail="TimeSettings not found")

    update_data = time_settings.dict(exclude_unset=True)

    if update_data.get("is_selected") == True:
        await db.execute(
            update(TimeSettings)
            .where(TimeSettings.user_id == user_id)
            .values(is_selected=False)
        )

    for key, value in update_data.items():
        setattr(db_time_settings, key, value)

    await db.commit()
    await db.refresh(db_time_settings)
    return db_time_settings


@router.delete("/{time_settings_id}", response_model=bool)
async def delete_time_settings(
    time_settings_id: int,
    db: AsyncSession = Depends(get_session),
    user_id: int = Depends(get_current_user_id),
):
    result = await db.execute(
        select(TimeSettings).where(
            TimeSettings.id == time_settings_id, TimeSettings.user_id == user_id
        )
    )
    db_time_settings = result.scalar_one_or_none()
    if db_time_settings is None:
        return False
    await db.delete(db_time_settings)
    await db.commit()
    return True
