# app/crud/__init__.py
# Importing CRUD modules for code highlighting and package initialization
from .daily_goal import get_daily_goal, create_daily_goal, update_daily_goal, delete_daily_goal
from .study_category import get_study_category, create_study_category, update_study_category, delete_study_category
from .study_block import get_study_block, create_study_block, update_study_block, delete_study_block
from .user import get_user, create_user, update_user, delete_user
