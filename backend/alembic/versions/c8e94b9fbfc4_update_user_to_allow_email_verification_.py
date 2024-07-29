"""Update User to allow email verification and social login

Revision ID: c8e94b9fbfc4
Revises: acabb54d229c
Create Date: 2024-07-29 20:49:03.144700

"""

from typing import Sequence, Union

import sqlalchemy as sa
import sqlmodel.sql.sqltypes

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "c8e94b9fbfc4"
down_revision: Union[str, None] = "acabb54d229c"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


from sqlalchemy import Enum


def upgrade() -> None:
    # Create the enum type first
    socialprovider = Enum(
        "GITHUB",
        "GOOGLE",
        "FACEBOOK",
        "TWITTER",
        "LINKEDIN",
        "APPLE",
        "MICROSOFT",
        name="socialprovider",
    )
    socialprovider.create(op.get_bind())

    # Add is_email_verified as nullable first
    op.add_column("user", sa.Column("is_email_verified", sa.Boolean(), nullable=True))

    # Set existing rows to False
    op.execute(
        'UPDATE "user" SET is_email_verified = FALSE WHERE is_email_verified IS NULL'
    )

    # Now alter the column to be non-nullable
    op.alter_column("user", "is_email_verified", nullable=False)

    # Add other columns
    op.add_column(
        "user",
        sa.Column(
            "email_verification_token",
            sqlmodel.sql.sqltypes.AutoString(),
            nullable=True,
        ),
    )
    op.add_column("user", sa.Column("social_provider", socialprovider, nullable=True))
    op.add_column(
        "user",
        sa.Column("social_id", sqlmodel.sql.sqltypes.AutoString(), nullable=True),
    )
    op.alter_column(
        "user", "hashed_password", existing_type=sa.VARCHAR(), nullable=True
    )


def downgrade() -> None:
    # Downgrade remains the same, but we need to drop the enum type as well
    op.alter_column(
        "user", "hashed_password", existing_type=sa.VARCHAR(), nullable=False
    )
    op.drop_column("user", "social_id")
    op.drop_column("user", "social_provider")
    op.drop_column("user", "email_verification_token")
    op.drop_column("user", "is_email_verified")

    # Drop the enum type
    socialprovider = Enum(
        "GITHUB",
        "GOOGLE",
        "FACEBOOK",
        "TWITTER",
        "LINKEDIN",
        "APPLE",
        "MICROSOFT",
        name="socialprovider",
    )
    socialprovider.drop(op.get_bind())
