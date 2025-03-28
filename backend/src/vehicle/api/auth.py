from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse

from vehicle.schemas.users import RegisterResponseSchema, RegisterSchema
from vehicle.repositories.users import UserRepository
from vehicle.services.users import UserService
from vehicle.database.sessions import get_session


router = APIRouter(
    prefix="/api/auth"
)


@router.post("/register", response_model=RegisterResponseSchema)
def register(data: RegisterSchema, session: Session = Depends(get_session)):
    repository = UserRepository(session=session)
    service = UserService(repository=repository)
    try:
        response = service.create_user(data=data)
        print(response, flush=True)
        return JSONResponse(status_code=201, content=dict(username=response))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))