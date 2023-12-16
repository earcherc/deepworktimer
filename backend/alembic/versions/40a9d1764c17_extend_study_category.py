"""Extend Study Category

Revision ID: 40a9d1764c17
Revises: ecc14a1d7c99
Create Date: 2023-12-16 03:43:13.229126

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision: str = '40a9d1764c17'
down_revision: Union[str, None] = 'ecc14a1d7c99'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('studycategory', sa.Column('selected', sa.Boolean(), nullable=False))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('studycategory', 'selected')
    # ### end Alembic commands ###