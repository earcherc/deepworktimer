from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from ..database import get_session
from ..crud import study_category as crud
from ..schemas import StudyCategory, StudyCategoryCreate, StudyCategoryUpdate
from typing import List

router = APIRouter()

@router.post("/", response_model=StudyCategory)
def create_study_category(study_category: StudyCategoryCreate, db: Session = Depends(get_session), request: Request = None):
    user_id = request.state.user_id
    if user_id is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    existing_category = db.query(StudyCategory).filter(
        StudyCategory.title == study_category.title,
        StudyCategory.user_id == user_id
    ).first()
    if existing_category:
        raise HTTPException(status_code=400, detail=f"Category '{study_category.title}' already exists")
    study_category.user_id = user_id
    return crud.create_study_category(db=db, study_category=study_category)

@router.get("/{study_category_id}", response_model=StudyCategory)
def read_study_category(study_category_id: int, db: Session = Depends(get_session)):
    db_study_category = crud.get_study_category(db, study_category_id=study_category_id)
    if db_study_category is None:
        raise HTTPException(status_code=404, detail="StudyCategory not found")
    return db_study_category

@router.get("/", response_model=List[StudyCategory])
def read_study_categories(skip: int = 0, limit: int = 10, db: Session = Depends(get_session)):
    study_categories = db.query(StudyCategory).offset(skip).limit(limit).all()
    return study_categories

@router.put("/{study_category_id}", response_model=StudyCategory)
def update_study_category(study_category_id: int, study_category: StudyCategoryUpdate, db: Session = Depends(get_session)):
    db_study_category = crud.update_study_category(db=db, study_category_id=study_category_id, study_category=study_category)
    if db_study_category is None:
        raise HTTPException(status_code=404, detail="StudyCategory not found")
    return db_study_category

@router.delete("/{study_category_id}", response_model=bool)
def delete_study_category(study_category_id: int, db: Session = Depends(get_session)):
    return crud.delete_study_category(db=db, study_category_id=study_category_id)
