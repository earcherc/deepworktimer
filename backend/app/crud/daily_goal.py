from sqlalchemy.orm import Session
from ..models import DailyGoal
from ..schemas import DailyGoalCreate, DailyGoalUpdate

def get_daily_goal(db: Session, daily_goal_id: int):
    return db.query(DailyGoal).filter(DailyGoal.id == daily_goal_id).first()

def get_daily_goals(db: Session, skip: int = 0, limit: int = 10):
    return db.query(DailyGoal).offset(skip).limit(limit).all()

def create_daily_goal(db: Session, daily_goal: DailyGoalCreate):
    db_daily_goal = DailyGoal(**daily_goal.dict())
    db.add(db_daily_goal)
    db.commit()
    db.refresh(db_daily_goal)
    return db_daily_goal

def update_daily_goal(db: Session, daily_goal_id: int, daily_goal: DailyGoalUpdate):
    db_daily_goal = db.query(DailyGoal).filter(DailyGoal.id == daily_goal_id).first()
    if db_daily_goal:
        update_data = daily_goal.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_daily_goal, key, value)
        db.commit()
        db.refresh(db_daily_goal)
        return db_daily_goal
    return None

def delete_daily_goal(db: Session, daily_goal_id: int):
    db_daily_goal = db.query(DailyGoal).filter(DailyGoal.id == daily_goal_id).first()
    if db_daily_goal:
        db.delete(db_daily_goal)
        db.commit()
        return True
    return False
