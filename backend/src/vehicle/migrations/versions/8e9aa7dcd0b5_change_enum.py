"""change enum

Revision ID: 8e9aa7dcd0b5
Revises: c5f55fcae81f
Create Date: 2025-05-25 12:26:24.810389

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8e9aa7dcd0b5'
down_revision: Union[str, None] = 'c5f55fcae81f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.execute("ALTER TYPE maintenancecategory ADD VALUE IF NOT EXISTS 'Замена масла и фильтров'")


def downgrade():
    # Downgrading enums in PostgreSQL is non-trivial and usually requires creating a new type
    # and migrating data. Here, we'll raise an error to prevent accidental data loss.
    raise NotImplementedError("Downgrade not supported for enum modification")
