"""Update study block model

Revision ID: 673efb0aa40e
Revises: fa71128e1f6c
Create Date: 2024-07-21 16:48:25.225101

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision: str = '673efb0aa40e'
down_revision: Union[str, None] = 'fa71128e1f6c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('studyblock', 'daily_goal_id',
               existing_type=sa.INTEGER(),
               nullable=True)
    op.alter_column('studyblock', 'study_category_id',
               existing_type=sa.INTEGER(),
               nullable=True)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('studyblock', 'study_category_id',
               existing_type=sa.INTEGER(),
               nullable=False)
    op.alter_column('studyblock', 'daily_goal_id',
               existing_type=sa.INTEGER(),
               nullable=False)
    # ### end Alembic commands ###