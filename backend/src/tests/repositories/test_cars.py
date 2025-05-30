import pytest
from unittest.mock import MagicMock
from vehicle.repositories.cars import CarsRepository

from vehicle.schemas.cars import ChangeCarSchema


def test_get_users_cars(mocker):
    mock_session = MagicMock()
    mock_execute = mocker.Mock()
    
    # Подделываем результат запроса
    car_data = {
        "brand": "Toyota",
        "model": "Corolla",
        "vin": "12345678901234567",
        "year_of_release": 2020,
        "mileage": 50000,
        "plate_license": "XYZ 001",
        "photo": "some.jpg"
    }
    mock_execute.mappings.return_value.all.return_value = [car_data]
    mock_session.execute.return_value = mock_execute

    repo = CarsRepository(mock_session)
    cars = repo.get_users_cars("john_doe")

    assert len(cars) == 1
    assert cars[0].vin == "12345678901234567"


def test_exists_vin_true(mocker):
    mock_session = MagicMock()
    mock_session.execute.return_value.scalar_one_or_none.return_value = "12345678901234567"

    repo = CarsRepository(mock_session)
    assert repo.exists_vin("12345678901234567") is True


def test_exists_vin_false(mocker):
    mock_session = MagicMock()
    mock_session.execute.return_value.scalar_one_or_none.return_value = None

    repo = CarsRepository(mock_session)
    assert repo.exists_vin("XYZ999") is False
