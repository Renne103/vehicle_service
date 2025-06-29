"""13_04_2025

Revision ID: f3cfab7af0c5
Revises: bd7a1cf571b0
Create Date: 2025-04-13 16:34:38.436427

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f3cfab7af0c5'
down_revision: Union[str, None] = 'bd7a1cf571b0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('cars', sa.Column('plate_license', sa.String(length=10), nullable=True))
    op.add_column('cars', sa.Column('photo', sa.String(length=256), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('cars', 'photo')
    op.drop_column('cars', 'plate_license')
    # ### end Alembic commands ###
