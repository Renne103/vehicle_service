from __future__ import annotations

import datetime

from typing import TYPE_CHECKING

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, Numeric, String, CheckConstraint
from sqlalchemy.dialects.postgresql import ARRAY

from vehicle.database.base import Base


if TYPE_CHECKING:
    from .cars import Cars


class Maintenances(Base):
    __tablename__ = "maintenances"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    car_vin: Mapped[str] = mapped_column(ForeignKey("cars.vin"), nullable=False)
    date: Mapped[datetime.date] = mapped_column(nullable=False)
    mileage: Mapped[int] = mapped_column(
        Numeric(precision=8, scale=0),
        CheckConstraint("mileage BETWEEN 0 AND 99999999"),
        nullable=False
        )
    cost: Mapped[int] = mapped_column(
        Numeric(precision=8, scale=0),
        CheckConstraint("mileage BETWEEN 0 AND 99999999"),
        nullable=False
        )
    comments: Mapped[str] = mapped_column(nullable=True)
    category_of_work: Mapped[str] = mapped_column(String(128), nullable=False)
    documents: Mapped[list[str]] = mapped_column(ARRAY(String(512)), nullable=True)
    
    car: Mapped["Cars"] = relationship(back_populates="maintenances")
