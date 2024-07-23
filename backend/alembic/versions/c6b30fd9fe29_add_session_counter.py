"""Add session counter

Revision ID: c6b30fd9fe29
Revises: 98b5ab87099b
Create Date: 2024-07-21 00:07:20.922540

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision: str = 'c6b30fd9fe29'
down_revision: Union[str, None] = '98b5ab87099b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('sessioncounter',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('is_selected', sa.Boolean(), nullable=False),
    sa.Column('target', sa.Integer(), nullable=False),
    sa.Column('completed', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_sessioncounter_user_id'), 'sessioncounter', ['user_id'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_sessioncounter_user_id'), table_name='sessioncounter')
    op.drop_table('sessioncounter')
    # ### end Alembic commands ###