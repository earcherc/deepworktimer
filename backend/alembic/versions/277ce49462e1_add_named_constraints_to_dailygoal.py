"""Add named constraints to DailyGoal

Revision ID: 277ce49462e1
Revises: 481f9950392a
Create Date: 2024-07-12 23:14:39.108666

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision: str = "277ce49462e1"
down_revision: Union[str, None] = "481f9950392a"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_unique_constraint(
        "uq_user_active_goal", "dailygoal", ["user_id", "is_active"]
    )
    op.create_unique_constraint(
        "uq_user_quantity_block_size",
        "dailygoal",
        ["user_id", "quantity", "block_size"],
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint("uq_user_quantity_block_size", "dailygoal", type_="unique")
    op.drop_constraint("uq_user_active_goal", "dailygoal", type_="unique")
    # ### end Alembic commands ###