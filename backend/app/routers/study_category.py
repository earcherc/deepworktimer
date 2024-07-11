from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from ..database import get_session
from ..models import StudyCategory
from ..schemas import StudyCategoryCreate, StudyCategoryUpdate, StudyCategory as StudyCategorySchema
from typing import List
from .utils import get_current_user_id

router = APIRouter()

@router.post("/", response_model=StudyCategorySchema)
async def create_study_category(
    study_category: StudyCategoryCreate,
    db: AsyncSession = Depends(get_session),
    user_id: int = Depends(get_current_user_id)
):
    db_study_category = StudyCategory(**study_category.dict(), user_id=user_id)
    db.add(db_study_category)
    try:
        await db.commit()
        await db.refresh(db_study_category)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=400, detail=f"Category '{study_category.title}' already exists for this user")
    return db_study_category

@router.get("/{study_category_id}", response_model=StudyCategorySchema)
async def read_study_category(
    study_category_id: int,
    db: AsyncSession = Depends(get_session),
    user_id: int = Depends(get_current_user_id)
):
    result = await db.execute(select(StudyCategory).where(StudyCategory.id == study_category_id, StudyCategory.user_id == user_id))
    db_study_category = result.scalar_one_or_none()
    if db_study_category is None:
        raise HTTPException(status_code=404, detail="StudyCategory not found")
    return db_study_category

@router.get("/", response_model=List[StudyCategorySchema])
async def read_study_categories(
    skip: int = 0,
    limit: int = 10,
    db: AsyncSession = Depends(get_session),
    user_id: int = Depends(get_current_user_id)
):
    result = await db.execute(select(StudyCategory).where(StudyCategory.user_id == user_id).offset(skip).limit(limit))
    return result.scalars().all()

@router.patch("/{study_category_id}", response_model=StudyCategorySchema)
async def update_study_category(
    study_category_id: int,
    study_category: StudyCategoryUpdate,
    db: AsyncSession = Depends(get_session),
    user_id: int = Depends(get_current_user_id)
):
    result = await db.execute(select(StudyCategory).where(StudyCategory.id == study_category_id, StudyCategory.user_id == user_id))
    db_study_category = result.scalar_one_or_none()
    if db_study_category is None:
        raise HTTPException(status_code=404, detail="StudyCategory not found")
    
    update_data = study_category.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_study_category, key, value)
    
    try:
        await db.commit()
        await db.refresh(db_study_category)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=400, detail=f"Category with title '{study_category.title}' already exists for this user")
    return db_study_category

@router.delete("/{study_category_id}", response_model=bool)
async def delete_study_category(
    study_category_id: int,
    db: AsyncSession = Depends(get_session),
    user_id: int = Depends(get_current_user_id)
):
    result = await db.execute(select(StudyCategory).where(StudyCategory.id == study_category_id, StudyCategory.user_id == user_id))
    db_study_category = result.scalar_one_or_none()
    if db_study_category is None:
        return False
    await db.delete(db_study_category)
    await db.commit()
    return True