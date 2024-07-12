from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from ..database import get_session
from ..models import DailyGoal
from ..schemas import DailyGoal as DailyGoalSchema
from ..schemas import DailyGoalCreate, DailyGoalUpdate
from .utils import get_current_user_id

router = APIRouter()


@router.post("/", response_model=DailyGoalSchema)
async def create_daily_goal(
    daily_goal: DailyGoalCreate,
    db: AsyncSession = Depends(get_session),
    user_id: int = Depends(get_current_user_id),
):
    db_daily_goal = DailyGoal(**daily_goal.dict(), user_id=user_id)
    db.add(db_daily_goal)
    await db.commit()
    await db.refresh(db_daily_goal)
    return db_daily_goal


@router.get("/{daily_goal_id}", response_model=DailyGoalSchema)
async def read_daily_goal(daily_goal_id: int, db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(DailyGoal).where(DailyGoal.id == daily_goal_id))
    daily_goal = result.scalar_one_or_none()
    if daily_goal is None:
        raise HTTPException(status_code=404, detail="DailyGoal not found")
    return daily_goal


@router.get("/", response_model=List[DailyGoalSchema])
async def read_daily_goals(
    skip: int = 0, limit: int = 10, db: AsyncSession = Depends(get_session)
):
    result = await db.execute(select(DailyGoal).offset(skip).limit(limit))
    return result.scalars().all()


@router.patch("/{daily_goal_id}", response_model=DailyGoalSchema)
async def update_daily_goal(
    daily_goal_id: int,
    daily_goal: DailyGoalUpdate,
    db: AsyncSession = Depends(get_session),
):
    result = await db.execute(select(DailyGoal).where(DailyGoal.id == daily_goal_id))
    db_daily_goal = result.scalar_one_or_none()
    if db_daily_goal is None:
        raise HTTPException(status_code=404, detail="DailyGoal not found")

    daily_goal_data = daily_goal.dict(exclude_unset=True)
    for key, value in daily_goal_data.items():
        setattr(db_daily_goal, key, value)

    db.add(db_daily_goal)
    await db.commit()
    await db.refresh(db_daily_goal)
    return db_daily_goal


@router.delete("/{daily_goal_id}", response_model=bool)
async def delete_daily_goal(
    daily_goal_id: int, db: AsyncSession = Depends(get_session)
):
    result = await db.execute(select(DailyGoal).where(DailyGoal.id == daily_goal_id))
    daily_goal = result.scalar_one_or_none()
    if daily_goal:
        await db.delete(daily_goal)
        await db.commit()
        return True
    return False
