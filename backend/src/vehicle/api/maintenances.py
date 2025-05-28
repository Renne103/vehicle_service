from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from vehicle.database.sessions import get_session
from vehicle.schemas.exeptions import ErrorDetailSchema, TokenErrorResponse
from vehicle.services.maintenances import MaintenancesService
from vehicle.repositories.maintenances import MaintenancesRepository
from vehicle.schemas.maintenances import (
    GetMaintenanceSchema,
    CreateMaintenanceSchema,
    GetAllMaintenancesSchema,
    UpdateMaintenanceSchema
)
from vehicle.utils.auth import get_current_username


router = APIRouter(
    prefix="/api/maintenances",
    tags=["maintenances"],
    dependencies=[Depends(get_current_username)],
)


@router.post(
    "/",
    responses={
        400: {
            "model": TokenErrorResponse,
            "description": "Невалидный токен"
        }
    },
    status_code=status.HTTP_201_CREATED,
    response_model=list[GetAllMaintenancesSchema]
)
def create_maintenance(
    data: CreateMaintenanceSchema,
    session: Session = Depends(get_session)
    ):
    repository = MaintenancesRepository(session=session)
    service = MaintenancesService(repository=repository)
    maintenances = service.create_maintenances(data=data)
    return maintenances


@router.get(
    "/",
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
    response_model=list[GetAllMaintenancesSchema]
)
def get_all_maintenances(
    vin: str,
    session: Session = Depends(get_session)
    ):
    repository = MaintenancesRepository(session=session)
    service = MaintenancesService(repository=repository)
    return service.get_all_maintenances(vin=vin)


@router.get(
    "/{id}/",
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
    response_model=GetMaintenanceSchema
)
def get_one_maintenance(
    id: int,
    session: Session = Depends(get_session)
    ):
    repository = MaintenancesRepository(session=session)
    service = MaintenancesService(repository=repository)
    return service.get_maintenance(id=id)


@router.delete(
    "/{id}/",
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
    response_model=list[GetAllMaintenancesSchema]
)
def delete_maintenance(
    id: int,
    vin: str,
    session: Session = Depends(get_session)
    ):
    repository = MaintenancesRepository(session=session)
    service = MaintenancesService(repository=repository)
    maintenances = service.delete_maintenance(id=id, vin=vin)
    return maintenances


@router.patch(
    "/{id}/",
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
    response_model=GetMaintenanceSchema
)
def update_maintenance(
    id: int,
    data: UpdateMaintenanceSchema,
    session: Session = Depends(get_session)
    ):
    repository = MaintenancesRepository(session=session)
    service = MaintenancesService(repository=repository)
    return service.update_maintenance(id=id, data=data)
