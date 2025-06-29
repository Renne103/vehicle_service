from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse

from vehicle.schemas.users import (
    RegisterResponseSchema,
    RegisterSchema,
    LoginResponseSchema,
    LoginSchema
)
from vehicle.repositories.users import UserRepository
from vehicle.services.users import UserService
from vehicle.database.sessions import get_session
from vehicle.utils.auth import get_token_from_headers
from vehicle.schemas.exeptions import ValidationOrAuthorizationErrorResponse, TokenErrorResponse


router = APIRouter(
    prefix="/api/auth",
    tags=["auth"],
)


@router.post(
    "/register/",
    response_model=RegisterResponseSchema,
    responses={
        406: {
            "model": ValidationOrAuthorizationErrorResponse,
            "description": "Ошибка валидации пользовательских данных"
        },
        422: {
            "model": ValidationOrAuthorizationErrorResponse,
            "description": "Ошибка валидации FastaAPI"
        }
    })
def register(data: RegisterSchema, session: Session = Depends(get_session)):
    repository = UserRepository(session=session)
    service = UserService(repository=repository)
    response = service.create_user(data=data)
    return JSONResponse(status_code=status.HTTP_201_CREATED, content=dict(username=response))


@router.post(
    '/login/',
    response_model=LoginResponseSchema,
    responses={
        406: {
            "model": ValidationOrAuthorizationErrorResponse,
            "description": "Ошибка валидации пользовательских данных"
        },
        422: {
            "model": ValidationOrAuthorizationErrorResponse,
            "description": "Ошибка валидации FastaAPI"
        }
    })
def login(data: LoginSchema, session: Session = Depends(get_session)):
    repository = UserRepository(session=session)
    service = UserService(repository=repository)
    return service.login_user(data=data)


@router.get(
    '/logout/',
    responses={
        400: {
            "model": TokenErrorResponse,
            "description": "Невалидный токен"
        },
        406: {
            "model": ValidationOrAuthorizationErrorResponse,
            "description": "Ошибка валидации пользовательских данных"
        },
        422: {
            "model": ValidationOrAuthorizationErrorResponse,
            "description": "Ошибка валидации FastaAPI"
        }
    })
def logout(
    session: Session = Depends(get_session),
    token: str = Depends(get_token_from_headers),
    ):
    repository = UserRepository(session=session)
    service = UserService(repository=repository)
    try:
        username = service.autorize_user(token=token)
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=[{
            "msg": "Невалидный токен",
            "input_name": "token",
        }])
    if username:
        service.logout_user(token=token)
        return JSONResponse(status_code=205, content=dict(message="Logout successful"))
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=[{
        "msg": "Невалидный токен",
        "input_name": "token",
    }])
