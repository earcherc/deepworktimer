from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select, update, and_

from ..database import get_session
from ..models.session_counter import SessionCounter
from ..schemas.session_counter import SessionCounter as SessionCounterSchema
from ..schemas.session_counter import SessionCounterCreate, SessionCounterUpdate
from .utils import get_current_user_id

router = APIRouter()


@router.post("/", response_model=SessionCounterSchema)
async def create_session_counter(
    session_counter: SessionCounterCreate,
    db: AsyncSession = Depends(get_session),
    user_id: int = Depends(get_current_user_id),
):
    if session_counter.is_selected:
        await db.execute(
            update(SessionCounter)
            .where(
                and_(
                    SessionCounter.user_id == user_id,
                    SessionCounter.is_selected == True,
                )
            )
            .values(is_selected=False)
        )

    db_session_counter = SessionCounter(**session_counter.dict(), user_id=user_id)
    db.add(db_session_counter)
    await db.commit()
    await db.refresh(db_session_counter)
    return db_session_counter


@router.get("/{session_counter_id}", response_model=SessionCounterSchema)
async def read_session_counter(
    session_counter_id: int,
    db: AsyncSession = Depends(get_session),
    user_id: int = Depends(get_current_user_id),
):
    result = await db.execute(
        select(SessionCounter).where(
            SessionCounter.id == session_counter_id, SessionCounter.user_id == user_id
        )
    )
    session_counter = result.scalar_one_or_none()
    if session_counter is None:
        raise HTTPException(status_code=404, detail="SessionCounter not found")
    return session_counter


@router.get("/", response_model=List[SessionCounterSchema])
async def read_session_counters(
    skip: int = 0,
    limit: int = 10,
    db: AsyncSession = Depends(get_session),
    user_id: int = Depends(get_current_user_id),
):
    result = await db.execute(
        select(SessionCounter)
        .where(SessionCounter.user_id == user_id)
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()


@router.patch("/{session_counter_id}", response_model=SessionCounterSchema)
async def update_session_counter(
    session_counter_id: int,
    session_counter: SessionCounterUpdate,
    db: AsyncSession = Depends(get_session),
    user_id: int = Depends(get_current_user_id),
):
    result = await db.execute(
        select(SessionCounter).where(
            SessionCounter.id == session_counter_id, SessionCounter.user_id == user_id
        )
    )
    db_session_counter = result.scalar_one_or_none()
    if db_session_counter is None:
        raise HTTPException(status_code=404, detail="SessionCounter not found")

    session_counter_data = session_counter.dict(exclude_unset=True)
    if session_counter_data.get("is_selected") == True:
        await db.execute(
            update(SessionCounter)
            .where(
                and_(
                    SessionCounter.user_id == user_id,
                    SessionCounter.is_selected == True,
                )
            )
            .values(is_selected=False)
        )

    for key, value in session_counter_data.items():
        setattr(db_session_counter, key, value)

    await db.commit()
    await db.refresh(db_session_counter)
    return db_session_counter


@router.delete("/{session_counter_id}", response_model=bool)
async def delete_session_counter(
    session_counter_id: int,
    db: AsyncSession = Depends(get_session),
    user_id: int = Depends(get_current_user_id),
):
    result = await db.execute(
        select(SessionCounter).where(
            SessionCounter.id == session_counter_id, SessionCounter.user_id == user_id
        )
    )
    session_counter = result.scalar_one_or_none()
    if session_counter:
        await db.delete(session_counter)
        await db.commit()
        return True
    return False
