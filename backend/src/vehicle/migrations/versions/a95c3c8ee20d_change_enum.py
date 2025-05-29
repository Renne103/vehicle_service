"""change enum

Revision ID: a95c3c8ee20d
Revises: 8e9aa7dcd0b5
Create Date: 2025-05-29 14:13:06.311572

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a95c3c8ee20d'
down_revision: Union[str, None] = '8e9aa7dcd0b5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Для PostgreSQL нужно модифицировать тип enum
    op.execute("COMMIT")  # Завершаем текущую транзакцию (необходимо для PostgreSQL)
    op.execute(
        "ALTER TYPE maintenancecategory ADD VALUE 'REFUELING' AFTER 'BODY'"
    )
    op.execute(
        "ALTER TYPE maintenancecategory ADD VALUE 'INSURANCE' AFTER 'REFUELING'"
    )
    op.execute(
        "ALTER TYPE maintenancecategory ADD VALUE 'LOAN_PAYMENT' AFTER 'INSURANCE'"
    )

def downgrade():
    # Удаление значений из enum сложно и зависит от БД
    # Обычно создают новый тип, копируют данные, удаляют старый тип
    op.execute("ALTER TYPE maintenancecategory RENAME TO maintenancecategory_old")
    
    # Создаем новый тип без удаленных значений
    op.execute(
        "CREATE TYPE maintenancecategory AS ENUM("
        "'ENGINE', 'OIL_CHANGE', 'TRANSMISSION', 'SUSPENSION', "
        "'BRAKES', 'STEERING', 'ELECTRICAL', 'FUEL_SYSTEM', "
        "'EXHAUST', 'CLIMATE', 'BODY', 'OTHER'"
        ")"
    )
    
    # Обновляем колонки, используя новый тип (пример для таблицы maintenance_records)
    op.execute(
        "ALTER TABLE maintenance_records ALTER COLUMN category TYPE maintenancecategory "
        "USING category::text::maintenancecategory"
    )
    
    op.execute("DROP TYPE maintenancecategory_old")