from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from vehicle.utils.auth import get_current_username
from vehicle.repositories.cars import CarsRepository
from vehicle.services.cars import CarsService
from vehicle.database.sessions import get_session
from vehicle.schemas.cars import UsersCarsSchema, NewCarSchema


router = APIRouter(
    prefix="/api/cars",
    dependencies=[Depends(get_current_username)],
)


@router.get("/cars", response_model=list[UsersCarsSchema])
def get_cars(
    username: str = Depends(get_current_username), 
    session: Session = Depends(get_session)
    ):
    repository = CarsRepository(session=session)
    service = CarsService(repository=repository)
    cars = service.get_users_cars(username=username)
    return cars


@router.post("/new_car")
def add_car(
    new_car: NewCarSchema,
    username: str = Depends(get_current_username),
    session: Session = Depends(get_session)
    ):
    repository = CarsRepository(session=session)
    service = CarsService(repository=repository)
    service.add_car(username=username, data=new_car)
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content=dict(message="Car added successfully")
    )