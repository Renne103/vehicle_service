"""28_03_2025

Revision ID: 3fc6d8d217f3
Revises: 
Create Date: 2025-03-28 00:09:41.584239

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3fc6d8d217f3'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=64), nullable=False),
    sa.Column('tg', sa.String(length=128), nullable=False),
    sa.Column('password', sa.String(length=64), nullable=False),
    sa.Column('first_name', sa.String(length=128), nullable=True),
    sa.Column('last_name', sa.String(length=128), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('tg'),
    sa.UniqueConstraint('username')
    )
    op.create_table('cars',
    sa.Column('vin', sa.String(length=17), nullable=False),
    sa.Column('model', sa.String(length=128), nullable=False),
    sa.Column('brand', sa.String(length=32), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('year_of_release', sa.Date(), nullable=False),
    sa.Column('mileage', sa.Numeric(precision=8, scale=0), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('vin')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('cars')
    op.drop_table('users')
    # ### end Alembic commands ###
