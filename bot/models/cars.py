from __future__ import annotations
from typing import TYPE_CHECKING
from datetime import datetime

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import DateTime, String, ForeignKey, Numeric, CheckConstraint

from .base import Base


if TYPE_CHECKING:
    from .users import User
    from .maintenances import Maintenances


class Cars(Base):
    __tablename__ = "cars"
    
    vin: Mapped[str] = mapped_column(String(17), primary_key=True)
    model: Mapped[str] = mapped_column(String(128), nullable=False)
    brand: Mapped[str] = mapped_column(String(32), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    year_of_release: Mapped[int | None] = mapped_column(nullable=True)
    mileage: Mapped[int] = mapped_column(
        Numeric(precision=8, scale=0),
        CheckConstraint("mileage BETWEEN 0 AND 99999999"),
        nullable=False
        )
    plate_license: Mapped[str | None] = mapped_column(String(10), nullable=True)
    photo: Mapped[str | None] = mapped_column(String(256), nullable=True)
    
    user: Mapped["User"] = relationship(back_populates="cars")
    maintenances: Mapped[list["Maintenances"]] = relationship(
        "Maintenances",
        back_populates="car",
        cascade="all, delete-orphan"
        )
    date_of_create: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.now,
        nullable=False
        )
