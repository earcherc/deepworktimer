from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from ..database import get_session
from ..crud import study_block as crud
from ..schemas import StudyBlock, StudyBlockCreate, StudyBlockUpdate
from typing import List

router = APIRouter()

@router.post("/", response_model=StudyBlock)
def create_study_block(study_block: StudyBlockCreate, db: Session = Depends(get_session), request: Request = None):
    user_id = request.state.user_id
    if user_id is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    study_block.user_id = user_id
    return crud.create_study_block(db=db, study_block=study_block)

@router.get("/{study_block_id}", response_model=StudyBlock)
def read_study_block(study_block_id: int, db: Session = Depends(get_session)):
    db_study_block = crud.get_study_block(db, study_block_id=study_block_id)
    if db_study_block is None:
        raise HTTPException(status_code=404, detail="StudyBlock not found")
    return db_study_block

@router.get("/", response_model=List[StudyBlock])
def read_study_blocks(skip: int = 0, limit: int = 10, db: Session = Depends(get_session)):
    study_blocks = db.query(StudyBlock).offset(skip).limit(limit).all()
    return study_blocks

@router.put("/{study_block_id}", response_model=StudyBlock)
def update_study_block(study_block_id: int, study_block: StudyBlockUpdate, db: Session = Depends(get_session)):
    db_study_block = crud.update_study_block(db=db, study_block_id=study_block_id, study_block=study_block)
    if db_study_block is None:
        raise HTTPException(status_code=404, detail="StudyBlock not found")
    return db_study_block

@router.delete("/{study_block_id}", response_model=bool)
def delete_study_block(study_block_id: int, db: Session = Depends(get_session)):
    return crud.delete_study_block(db=db, study_block_id=study_block_id)
