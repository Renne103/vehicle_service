from fastapi import APIRouter, Depends, status, Body
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session

from vehicle.utils.auth import get_current_username
from vehicle.repositories.cars import CarsRepository
from vehicle.services.cars import CarsService
from vehicle.database.sessions import get_session
from vehicle.schemas.cars import NewCarSchema, ViewCarSchema, ChangeCarSchema
from vehicle.schemas.exeptions import TokenErrorResponse, ErrorDetailSchema


router = APIRouter(
    prefix="/api/cars",
    dependencies=[Depends(get_current_username)],
)


@router.get(
    "/",
    response_model=list[ViewCarSchema],
    responses={
        400: {
            "model": TokenErrorResponse,
            "description": "Невалидный токен"
        }
    })
def get_cars(
    username: str = Depends(get_current_username), 
    session: Session = Depends(get_session)
    ):
    repository = CarsRepository(session=session)
    service = CarsService(repository=repository)
    cars = service.get_users_cars(username=username)
    return cars


@router.post(
    "/",
    responses={
        400: {
            "model": TokenErrorResponse,
            "description": "Невалидный токен"
        }
    },
    status_code=status.HTTP_201_CREATED,
    response_model=list[NewCarSchema]
    )
def add_car(
    new_car: NewCarSchema,
    username: str = Depends(get_current_username),
    session: Session = Depends(get_session)
    ):
    repository = CarsRepository(session=session)
    service = CarsService(repository=repository)
    cars = service.add_car(username=username, data=new_car)
    return cars


@router.patch(
    "/{vin}",
    responses={
        400: {
            "model": TokenErrorResponse,
            "description": "Невалидный токен"
        },
        406: {
            "model": ErrorDetailSchema,
            "description": "Ошибка валидации пользовательских данных"
        }
    },
    response_model=ViewCarSchema
    )
def change_car(
    vin: str,
    data: ChangeCarSchema = Body(...),
    session: Session = Depends(get_session)
    ):
    repository = CarsRepository(session=session)
    service = CarsService(repository=repository)
    car = service.upload_car_photo(vin=vin, data=data)
    return car


@router.get(
    "/{vin}",
    responses={
        400: {
            "model": TokenErrorResponse,
            "description": "Невалидный токен"
        },
        406: {
            "model": ErrorDetailSchema,
            "description": "Ошибка валидации пользовательских данных"
        }
    },
    response_model=ViewCarSchema
)
def get_car(
    vin: str,
    session: Session = Depends(get_session),
    username: str = Depends(get_current_username)
    ):
    repository = CarsRepository(session=session)
    service = CarsService(repository=repository)
    car = service.get_car(vin=vin, username=username)
    return car


@router.delete(
    "/{vin}",
    responses={
        400: {
            "model": TokenErrorResponse,
            "description": "Невалидный токен"
        },
        406: {
            "model": ErrorDetailSchema,
            "description": "Ошибка валидации пользовательских данных"
        }
    },
    response_model=list[ViewCarSchema]
)
def delete_car(
    vin: str,
    session: Session = Depends(get_session),
    username: str = Depends(get_current_username)
    ):
    repository = CarsRepository(session=session)
    service = CarsService(repository=repository)
    cars = service.delete_car(vin=vin, username=username)
    return cars
