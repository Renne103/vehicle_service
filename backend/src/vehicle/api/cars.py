from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from vehicle.utils.auth import get_current_username
from vehicle.repositories.cars import CarsRepository
from vehicle.services.cars import CarsService
from vehicle.database.sessions import get_session
from vehicle.schemas.cars import NewCarSchema, ViewCarSchema, UploadPhotoSchema
from vehicle.schemas.exeptions import TokenErrorResponse


router = APIRouter(
    prefix="/api/cars",
    dependencies=[Depends(get_current_username)],
)


@router.get(
    "/cars",
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
    "/new_car",
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


@router.post(
    "/upload_photo",
    responses={
        400: {
            "model": TokenErrorResponse,
            "description": "Невалидный токен"
        }
    },
    response_model=ViewCarSchema
    )
def upload_car_photo(
    data: UploadPhotoSchema,
    session: Session = Depends(get_session)
    ):
    repository = CarsRepository(session=session)
    service = CarsService(repository=repository)
    car = service.upload_car_photo(vin=data.vin, photo=data.photo)
    return car