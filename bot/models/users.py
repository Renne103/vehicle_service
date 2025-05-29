from __future__ import annotations
from typing import TYPE_CHECKING

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String

from .base import Base


if TYPE_CHECKING:
    from .cars import Cars


class User(Base):
    __tablename__ = "users"
    from .cars import Cars
    
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    tg: Mapped[str] = mapped_column(String(128), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(64), nullable=False)
    first_name: Mapped[str] = mapped_column(String(128), nullable=True)
    last_name: Mapped[str] = mapped_column(String(128), nullable=True)
    tg_id: Mapped[str] = mapped_column(String(64), unique=True, nullable=True)    

    cars: Mapped[list["Cars"]] = relationship(
        "Cars",
        back_populates="user",
        cascade="all, delete-orphan"
        )


class TokenBlackList(Base):
    __tablename__ = "token_blacklist"
    
    token: Mapped[str] = mapped_column(String(256), primary_key=True)