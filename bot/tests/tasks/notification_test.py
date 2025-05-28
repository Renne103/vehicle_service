import pytest

from unittest.mock import AsyncMock, patch, MagicMock
from datetime import datetime, timedelta

from bot.tasks import (
    check_maintenance,
    check_last_maintenance,
    collect_notifications,
    send_maintenance_notification_task,
    find_out_mileage_task
)
from bot.models.maintenances import MaintenanceCategory
from bot.models.cars import Cars
from bot.models.maintenances import Maintenances


@pytest.fixture
def maintenance():
    return Maintenances(
        category_of_work=MaintenanceCategory.OIL_CHANGE,
        mileage=10000,
        date=datetime.now().date() - timedelta(days=180)
    )


@pytest.fixture
def car(maintenance):
    car = Cars(
        vin="TESTVIN123456789",
        brand="Toyota",
        model="Corolla",
        mileage=19000,
        maintenances=[maintenance]
    )
    return car


def test_check_maintenance_should_notify(car):
    msg = check_maintenance(car, MaintenanceCategory.OIL_CHANGE, 8000, "пора поменять масло")
    assert msg is not None
    assert "пора поменять масло" in msg


def test_check_maintenance_should_not_notify(car):
    car.mileage = 17000  # недостаточный пробег
    msg = check_maintenance(car, MaintenanceCategory.OIL_CHANGE, 8000, "пора поменять масло")
    assert msg is None


def test_check_last_maintenance_should_notify(car):
    msg = check_last_maintenance(car, 8000)
    assert msg is not None
    assert "пора пройти ТО" in msg


def test_check_last_maintenance_should_not_notify(car):
    car.mileage = 10500  # малый пробег после ТО
    msg = check_last_maintenance(car, 8000)
    assert msg is None


def test_collect_notifications(car):
    notifications = collect_notifications(car)
    assert isinstance(notifications, list)
    assert any("пора поменять масло" in note for note in notifications)


@pytest.mark.asyncio
@patch("app.tasks.bot.send_message", new_callable=AsyncMock)
@patch("app.tasks.get_async_session")
@patch("app.tasks.UserService")
async def test_send_maintenance_notification_task(mock_service_cls, mock_get_session, mock_send_message):
    mock_session = AsyncMock()
    mock_get_session.return_value.__aiter__.return_value = [mock_session]
    mock_service = AsyncMock()
    mock_service.get_users_with_cars_with_maintainance.return_value = [
        MagicMock(
            tg_id="123456789",
            cars=[
                Cars(
                    vin="TESTVIN",
                    brand="Test",
                    model="Car",
                    mileage=90000,
                    maintenances=[
                        Maintenances(
                            mileage=10000,
                            date=datetime.now().date() - timedelta(days=365),
                            category_of_work=MaintenanceCategory.OIL_CHANGE
                        )
                    ]
                )
            ]
        )
    ]
    mock_service_cls.return_value = mock_service

    await send_maintenance_notification_task()
    assert mock_send_message.call_count >= 1


@pytest.mark.asyncio
@patch("app.tasks.bot.send_message", new_callable=AsyncMock)
@patch("app.tasks.get_async_session")
@patch("app.tasks.UserService")
@patch("app.tasks.storage.set_state", new_callable=AsyncMock)
async def test_find_out_mileage_task(mock_set_state, mock_service_cls, mock_get_session, mock_send_message):
    mock_session = AsyncMock()
    mock_get_session.return_value.__aiter__.return_value = [mock_session]
    mock_service = AsyncMock()
    mock_service.get_users_with_cars.return_value = [
        MagicMock(
            tg_id="123456789",
            cars=[
                Cars(
                    vin="TESTVIN",
                    brand="Test",
                    model="Car",
                    mileage=12000,
                    maintenances=[]
                )
            ]
        )
    ]
    mock_service_cls.return_value = mock_service

    await find_out_mileage_task()
    assert mock_send_message.call_count == 2
    assert mock_set_state.call_count == 1
