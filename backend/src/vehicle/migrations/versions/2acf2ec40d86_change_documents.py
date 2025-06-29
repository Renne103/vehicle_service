"""change_documents

Revision ID: 2acf2ec40d86
Revises: 094bee9f6cb0
Create Date: 2025-05-17 12:35:06.413080

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '2acf2ec40d86'
down_revision: Union[str, None] = '094bee9f6cb0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('maintenances', sa.Column('act_of_completed_works', sa.String(length=512), nullable=True))
    op.add_column('maintenances', sa.Column('receipt', sa.String(length=512), nullable=True))
    op.add_column('maintenances', sa.Column('warranty_card', sa.String(length=512), nullable=True))
    op.drop_column('maintenances', 'documents')
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('maintenances', sa.Column('documents', postgresql.ARRAY(sa.VARCHAR(length=512)), autoincrement=False, nullable=True))
    op.drop_column('maintenances', 'warranty_card')
    op.drop_column('maintenances', 'receipt')
    op.drop_column('maintenances', 'act_of_completed_works')
    # ### end Alembic commands ###
