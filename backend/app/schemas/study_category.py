from typing import Optional

from pydantic import BaseModel, Field


class StudyCategoryBase(BaseModel):
    title: str
    is_selected: bool = Field(default=False)


class StudyCategoryCreate(StudyCategoryBase):
    pass


class StudyCategoryUpdate(BaseModel):
    title: Optional[str] = None
    is_selected: Optional[bool] = None


class StudyCategory(StudyCategoryBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True
