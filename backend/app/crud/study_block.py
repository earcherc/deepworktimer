from sqlalchemy.orm import Session
from ..models import StudyBlock
from ..schemas import StudyBlockCreate, StudyBlockUpdate
from typing import Optional

def get_study_block(db: Session, study_block_id: int) -> Optional[StudyBlock]:
    return db.query(StudyBlock).filter(StudyBlock.id == study_block_id).first()

def create_study_block(db: Session, study_block: StudyBlockCreate) -> StudyBlock:
    db_study_block = StudyBlock(**study_block.dict())
    db.add(db_study_block)
    db.commit()
    db.refresh(db_study_block)
    return db_study_block

def update_study_block(db: Session, study_block_id: int, study_block: StudyBlockUpdate) -> Optional[StudyBlock]:
    db_study_block = db.query(StudyBlock).filter(StudyBlock.id == study_block_id).first()
    if db_study_block:
        update_data = study_block.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_study_block, key, value)
        db.commit()
        db.refresh(db_study_block)
        return db_study_block
    return None

def delete_study_block(db: Session, study_block_id: int) -> bool:
    db_study_block = db.query(StudyBlock).filter(StudyBlock.id == study_block_id).first()
    if db_study_block:
        db.delete(db_study_block)
        db.commit()
        return True
    return False
