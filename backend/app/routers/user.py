from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from ..database import get_session
from ..crud import user as crud
from ..schemas import User, UserCreate, UserUpdate
from typing import List

router = APIRouter()

@router.post("/", response_model=User)
def create_user(user: UserCreate, db: Session = Depends(get_session)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@router.get("/{user_id}", response_model=User)
def read_user(user_id: int, db: Session = Depends(get_session)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.get("/", response_model=List[User])
def read_users(skip: int = 0, limit: int = 10, db: Session = Depends(get_session)):
    users = db.query(User).offset(skip).limit(limit).all()
    return users

@router.put("/", response_model=User)
def update_current_user(user: UserUpdate, db: Session = Depends(get_session), request: Request = None):
    user_id = request.state.user_id
    if user_id is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    db_user = crud.update_user(db=db, user_id=user_id, user=user)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.delete("/", response_model=bool)
def delete_current_user(db: Session = Depends(get_session), request: Request = None):
    user_id = request.state.user_id
    if user_id is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return crud.delete_user(db=db, user_id=user_id)
