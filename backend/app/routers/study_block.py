from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from ..database import get_session
from ..models import StudyBlock
from ..schemas import StudyBlockCreate, StudyBlockUpdate, StudyBlock as StudyBlockSchema
from typing import List

router = APIRouter()

async def get_current_user_id(request: Request) -> int:
    user_id = request.state.user_id
    if user_id is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user_id

@router.post("/", response_model=StudyBlockSchema)
async def create_study_block(
    study_block: StudyBlockCreate,
    db: AsyncSession = Depends(get_session),
    user_id: int = Depends(get_current_user_id)
):
    db_study_block = StudyBlock(**study_block.dict())
    db.add(db_study_block)
    await db.commit()
    await db.refresh(db_study_block)
    return db_study_block

@router.get("/{study_block_id}", response_model=StudyBlockSchema)
async def read_study_block(
    study_block_id: int,
    db: AsyncSession = Depends(get_session),
    user_id: int = Depends(get_current_user_id)
):
    result = await db.execute(select(StudyBlock).where(StudyBlock.id == study_block_id, StudyBlock.user_id == user_id))
    db_study_block = result.scalar_one_or_none()
    if db_study_block is None:
        raise HTTPException(status_code=404, detail="StudyBlock not found")
    return db_study_block

@router.get("/", response_model=List[StudyBlockSchema])
async def read_study_blocks(
    skip: int = 0,
    limit: int = 10,
    db: AsyncSession = Depends(get_session),
    user_id: int = Depends(get_current_user_id)
):
    result = await db.execute(select(StudyBlock).where(StudyBlock.user_id == user_id).offset(skip).limit(limit))
    return result.scalars().all()

@router.patch("/{study_block_id}", response_model=StudyBlockSchema)
async def update_study_block(
    study_block_id: int,
    study_block: StudyBlockUpdate,
    db: AsyncSession = Depends(get_session),
    user_id: int = Depends(get_current_user_id)
):
    result = await db.execute(select(StudyBlock).where(StudyBlock.id == study_block_id, StudyBlock.user_id == user_id))
    db_study_block = result.scalar_one_or_none()
    if db_study_block is None:
        raise HTTPException(status_code=404, detail="StudyBlock not found")
    
    update_data = study_block.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_study_block, key, value)
    
    await db.commit()
    await db.refresh(db_study_block)
    return db_study_block

@router.delete("/{study_block_id}", response_model=bool)
async def delete_study_block(
    study_block_id: int,
    db: AsyncSession = Depends(get_session),
    user_id: int = Depends(get_current_user_id)
):
    result = await db.execute(select(StudyBlock).where(StudyBlock.id == study_block_id, StudyBlock.user_id == user_id))
    db_study_block = result.scalar_one_or_none()
    if db_study_block is None:
        return False
    await db.delete(db_study_block)
    await db.commit()
    return True