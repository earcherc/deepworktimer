# app/schemas/__init__.py
# Importing schemas for code highlighting and package initialization
from .daily_goal import DailyGoal, DailyGoalBase, DailyGoalCreate, DailyGoalUpdate
from .study_block import StudyBlock, StudyBlockBase, StudyBlockCreate, StudyBlockUpdate
from .study_category import (
    StudyCategory,
    StudyCategoryBase,
    StudyCategoryCreate,
    StudyCategoryUpdate,
)
from .user import User, UserBase, UserCreate, UserUpdate
