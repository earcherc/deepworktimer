from sqlalchemy.orm import Session
from ..models import StudyCategory
from ..schemas import StudyCategoryCreate, StudyCategoryUpdate
from typing import Optional

def get_study_category(db: Session, study_category_id: int) -> Optional[StudyCategory]:
    return db.query(StudyCategory).filter(StudyCategory.id == study_category_id).first()

def create_study_category(db: Session, study_category: StudyCategoryCreate) -> StudyCategory:
    db_study_category = StudyCategory(**study_category.dict())
    db.add(db_study_category)
    db.commit()
    db.refresh(db_study_category)
    return db_study_category

def update_study_category(db: Session, study_category_id: int, study_category: StudyCategoryUpdate) -> Optional[StudyCategory]:
    db_study_category = db.query(StudyCategory).filter(StudyCategory.id == study_category_id).first()
    if db_study_category:
        update_data = study_category.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_study_category, key, value)
        db.commit()
        db.refresh(db_study_category)
        return db_study_category
    return None

def delete_study_category(db: Session, study_category_id: int) -> bool:
    db_study_category = db.query(StudyCategory).filter(StudyCategory.id == study_category_id).first()
    if db_study_category:
        db.delete(db_study_category)
        db.commit()
        return True
    return False
