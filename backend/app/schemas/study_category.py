from typing import Optional
from pydantic import BaseModel

# Shared properties
class StudyCategoryBase(BaseModel):
    title: str
    is_active: bool = False

# Properties to receive via API on creation
class StudyCategoryCreate(StudyCategoryBase):
    user_id: int

# Properties to receive via API on update
class StudyCategoryUpdate(StudyCategoryBase):
    pass

# Properties shared by models stored in DB and returned to client
class StudyCategory(StudyCategoryBase):
    id: Optional[int] = None

    class Config:
        orm_mode = True
