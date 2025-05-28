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
        "vin": "ABC123",
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
    assert cars[0].vin == "ABC123"


def test_exists_vin_true(mocker):
    mock_session = MagicMock()
    mock_session.execute.return_value.scalar_one_or_none.return_value = "ABC123"

    repo = CarsRepository(mock_session)
    assert repo.exists_vin("ABC123") is True


def test_exists_vin_false(mocker):
    mock_session = MagicMock()
    mock_session.execute.return_value.scalar_one_or_none.return_value = None

    repo = CarsRepository(mock_session)
    assert repo.exists_vin("XYZ999") is False


def test_upload_car_photo(mocker):
    mock_session = MagicMock()
    mock_car = mocker.Mock(vin="ABC123", photo="old.jpg")
    mock_session.execute.return_value.scalar_one.return_value = mock_car

    repo = CarsRepository(mock_session)
    schema = ChangeCarSchema(photo="new.jpg")

    updated = repo.upload_car_photo(vin="ABC123", data=schema)

    assert updated.photo == "new.jpg"
    mock_session.add.assert_called_once_with(mock_car)
    mock_session.commit.assert_called_once()