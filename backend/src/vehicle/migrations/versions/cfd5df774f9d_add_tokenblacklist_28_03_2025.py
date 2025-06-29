"""add_tokenblacklist_28_03_2025

Revision ID: cfd5df774f9d
Revises: 3fc6d8d217f3
Create Date: 2025-03-28 12:44:14.165118

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'cfd5df774f9d'
down_revision: Union[str, None] = '3fc6d8d217f3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('token_blacklist',
    sa.Column('token', sa.String(length=128), nullable=False),
    sa.PrimaryKeyConstraint('token')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('token_blacklist')
    # ### end Alembic commands ###
