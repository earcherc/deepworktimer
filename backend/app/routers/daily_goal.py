from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_session
from ..crud import daily_goal as crud
from ..schemas import DailyGoal, DailyGoalCreate, DailyGoalUpdate
from typing import List

router = APIRouter()

@router.post("/", response_model=DailyGoal)
def create_daily_goal(daily_goal: DailyGoalCreate, db: Session = Depends(get_session)):
    return crud.create_daily_goal(db=db, daily_goal=daily_goal)

@router.get("/{daily_goal_id}", response_model=DailyGoal)
def read_daily_goal(daily_goal_id: int, db: Session = Depends(get_session)):
    db_daily_goal = crud.get_daily_goal(db, daily_goal_id=daily_goal_id)
    if db_daily_goal is None:
        raise HTTPException(status_code=404, detail="DailyGoal not found")
    return db_daily_goal

@router.get("/", response_model=List[DailyGoal])
def read_daily_goals(skip: int = 0, limit: int = 10, db: Session = Depends(get_session)):
    return crud.get_daily_goals(db, skip=skip, limit=limit)

@router.put("/{daily_goal_id}", response_model=DailyGoal)
def update_daily_goal(daily_goal_id: int, daily_goal: DailyGoalUpdate, db: Session = Depends(get_session)):
    db_daily_goal = crud.update_daily_goal(db, daily_goal_id=daily_goal_id, daily_goal=daily_goal)
    if db_daily_goal is None:
        raise HTTPException(status_code=404, detail="DailyGoal not found")
    return db_daily_goal

@router.delete("/{daily_goal_id}", response_model=bool)
def delete_daily_goal(daily_goal_id: int, db: Session = Depends(get_session)):
    return crud.delete_daily_goal(db, daily_goal_id=daily_goal_id)
