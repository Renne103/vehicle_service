import pytest
from unittest.mock import MagicMock
from datetime import date

from vehicle.repositories.maintenances import MaintenancesRepository
from vehicle.models.maintenances import Maintenances, MaintenanceCategory
from vehicle.schemas.maintenances import (
    CreateMaintenanceSchema,
    GetMaintenanceSchema,
    GetAllMaintenancesSchema,
    UpdateMaintenanceSchema
)


@pytest.fixture
def mock_session():
    return MagicMock()


def test_create_maintenance_success(mock_session):
    repo = MaintenancesRepository(mock_session)
    data = CreateMaintenanceSchema(
        car_vin="12345678901234567",
        date=date.today(),
        mileage=10000,
        cost=5000,
        comments="Oil change",
        category_of_work=MaintenanceCategory.OIL_CHANGE,
        act_of_completed_works=None,
        receipt=None,
        warranty_card=None
    )

    repo.create_maintenance(data)

    mock_session.add.assert_called_once()
    mock_session.commit.assert_called_once()
    mock_session.refresh.assert_called_once()


def test_create_maintenance_failure(mock_session):
    mock_session.commit.side_effect = Exception("DB error")
    repo = MaintenancesRepository(mock_session)
    data = CreateMaintenanceSchema(
        car_vin="12345678901234567",
        date=date.today(),
        mileage=10000,
        cost=5000,
        comments="Oil change",
        category_of_work=MaintenanceCategory.OIL_CHANGE,
        act_of_completed_works=None,
        receipt=None,
        warranty_card=None
    )

    with pytest.raises(Exception, match="DB error"):
        repo.create_maintenance(data)

    mock_session.rollback.assert_called_once()


def test_delete_maintenance_success(mock_session):
    repo = MaintenancesRepository(mock_session)

    repo.delete_maintenance(1)

    mock_session.execute.assert_called_once()
    mock_session.commit.assert_called_once()


def test_delete_maintenance_failure(mock_session):
    mock_session.commit.side_effect = Exception("delete error")
    repo = MaintenancesRepository(mock_session)

    with pytest.raises(Exception, match="delete error"):
        repo.delete_maintenance(1)

    mock_session.rollback.assert_called_once()


def test_update_maintenance_success(mock_session):
    repo = MaintenancesRepository(mock_session)
    data = UpdateMaintenanceSchema(
        mileage=15000,
        cost=6000
    )

    repo.update_maintenance(1, data)

    mock_session.execute.assert_called_once()
    mock_session.commit.assert_called_once()


def test_update_maintenance_failure(mock_session):
    mock_session.commit.side_effect = Exception("update error")
    repo = MaintenancesRepository(mock_session)
    data = UpdateMaintenanceSchema(
        cost=15000,
        mileage=55000
    )

    with pytest.raises(Exception, match="update error"):
        repo.update_maintenance(1, data)

    mock_session.rollback.assert_called_once()
