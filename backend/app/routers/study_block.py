from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, Body, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select


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
        StudyBlock.user_id == user_id, StudyBlock.end == None
    )
    result = await db.execute(query)
    existing_unfinished_block = result.scalar_one_or_none()

    if existing_unfinished_block:
        raise HTTPException(
            status_code=400,
            detail="An unfinished study block already exists. Please finish or delete it before creating a new one.",
        )

    # If no unfinished block exists, create the new block
    study_block_dict = study_block.dict()
    if study_block_dict["start"].tzinfo is not None:
        study_block_dict["start"] = study_block_dict["start"].replace(tzinfo=None)

    db_study_block = StudyBlock(**study_block_dict, user_id=user_id)
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
    db_query = select(StudyBlock).where(StudyBlock.user_id == user_id)

    if query.start_time:
        start_time = datetime.fromisoformat(query.start_time)
        db_query = db_query.where(StudyBlock.start >= start_time)
    if query.end_time:
        end_time = datetime.fromisoformat(query.end_time)
        db_query = db_query.where(StudyBlock.start <= end_time)

    db_query = db_query.order_by(StudyBlock.start.desc())

    if query.skip is not None:
        db_query = db_query.offset(query.skip)
    if query.limit is not None:
        db_query = db_query.limit(query.limit)

    result = await db.execute(db_query)
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

    # Direct handling of datetime objects for "start" and "end"
    if "start" in update_data and update_data["start"].tzinfo is not None:
        update_data["start"] = update_data["start"].replace(tzinfo=None)
    if "end" in update_data and update_data["end"].tzinfo is not None:
        update_data["end"] = update_data["end"].replace(tzinfo=None)

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
