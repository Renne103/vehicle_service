import jwt

from datetime import timedelta, datetime, timezone
from typing import Annotated

from fastapi import Header, HTTPException, status, Depends
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from vehicle.configs.auth_config import settings
from vehicle.database.sessions import get_session
from vehicle.repositories.users import UserRepository


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_hashed_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(username: str) -> str:
    to_encode = dict(username=username)
    if settings.ACCESS_TOKEN_EXPIRE_MINUTES:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_access_token = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_access_token


def decode_access_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except jwt.PyJWTError:
        return None


def get_token_from_headers(Autorization: str = Header()) -> str:
    if not Autorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=[{
                "msg": "Невалидный токен",
                "input_name": "token",
                }],
        )
    return Autorization.removeprefix("Bearer ")


def get_current_username(
    token: Annotated[str, Depends(get_token_from_headers)],
    session: Annotated[Session, Depends(get_session)]
    ) -> str:
    repository = UserRepository(session=session)
    if repository.exists_token(token=token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=[{
                "msg": "Токен истек",
                "input_name": "token",
                }])
    decoded_token = decode_access_token(token=token)
    if decoded_token:
        return decoded_token.get('username', None)
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=[{
            "msg": "Невалидный токен",
            "input_name": "token",
        }])
