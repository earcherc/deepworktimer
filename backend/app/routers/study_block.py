from datetime import datetime
from typing import List

from fastapi import APIRouter, Body, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_, or_


from ..database import get_session
from ..models.study_block import StudyBlock
from ..schemas.study_block import StudyBlock as StudyBlockSchema
from ..schemas.study_block import StudyBlockCreate, StudyBlockUpdate, StudyBlockQuery
from .utils import get_current_user_id

router = APIRouter()


@router.post("/", response_model=StudyBlockSchema)
async def create_study_block(
    study_block: StudyBlockCreate,
    db: AsyncSession = Depends(get_session),
    user_id: int = Depends(get_current_user_id),
):
    # Check for existing unfinished block
    query = select(StudyBlock).where(
        StudyBlock.user_id == user_id, StudyBlock.end_time == None
    )
    result = await db.execute(query)
    existing_unfinished_block = result.scalar_one_or_none()
    if existing_unfinished_block:
        raise HTTPException(
            status_code=400,
            detail="An unfinished study block already exists. Please finish or delete it before creating a new one.",
        )

    # Create the new block
    db_study_block = StudyBlock(**study_block.dict(), user_id=user_id)
    db.add(db_study_block)
    await db.commit()
    await db.refresh(db_study_block)
    return db_study_block


@router.get("/{study_block_id}", response_model=StudyBlockSchema)
async def read_study_block(
    study_block_id: int,
    db: AsyncSession = Depends(get_session),
    user_id: int = Depends(get_current_user_id),
):
    result = await db.execute(
        select(StudyBlock).where(
            StudyBlock.id == study_block_id, StudyBlock.user_id == user_id
        )
    )
    db_study_block = result.scalar_one_or_none()
    if db_study_block is None:
        raise HTTPException(status_code=404, detail="StudyBlock not found")
    return db_study_block


@router.post("/query", response_model=List[StudyBlockSchema])
async def query_study_blocks(
    query: StudyBlockQuery = Body(...),
    db: AsyncSession = Depends(get_session),
    user_id: int = Depends(get_current_user_id),
):
    conditions = [StudyBlock.user_id == user_id]
    
    if query.start_time:
        start_time = datetime.fromisoformat(query.start_time)
        conditions.append(
            or_(
                StudyBlock.start_time >= start_time,
                StudyBlock.end_time == None
            )
        )
    if query.end_time:
        end_time = datetime.fromisoformat(query.end_time)
        conditions.append(
            or_(
                StudyBlock.start_time <= end_time,
                StudyBlock.end_time == None
            )
        )

    final_query = (
        select(StudyBlock)
        .where(and_(*conditions))
        .order_by(StudyBlock.start_time.desc())
    )

    if query.skip is not None:
        final_query = final_query.offset(query.skip)
    if query.limit is not None:
        final_query = final_query.limit(query.limit)

    result = await db.execute(final_query)
    return result.scalars().all()


@router.patch("/{study_block_id}", response_model=StudyBlockSchema)
async def update_study_block(
    study_block_id: int,
    study_block: StudyBlockUpdate,
    db: AsyncSession = Depends(get_session),
    user_id: int = Depends(get_current_user_id),
):
    result = await db.execute(
        select(StudyBlock).where(
            StudyBlock.id == study_block_id, StudyBlock.user_id == user_id
        )
    )
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
    user_id: int = Depends(get_current_user_id),
):
    result = await db.execute(
        select(StudyBlock).where(
            StudyBlock.id == study_block_id, StudyBlock.user_id == user_id
        )
    )
    db_study_block = result.scalar_one_or_none()
    if db_study_block is None:
        return False
    await db.delete(db_study_block)
    await db.commit()
    return True
