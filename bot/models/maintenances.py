from __future__ import annotations

import datetime

from typing import TYPE_CHECKING
from enum import Enum

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, Numeric, String, CheckConstraint
from sqlalchemy.dialects.postgresql import ARRAY

from .base import Base


if TYPE_CHECKING:
    from .cars import Cars


class MaintenanceCategory(str, Enum):
    ENGINE = "Двигатель и его компоненты"
    TRANSMISSION = "Трансмиссия"
    SUSPENSION = "Подвеска и ходовая часть"
    BRAKES = "Тормозная система"
    STEERING = "Рулевое управление"
    ELECTRICAL = "Электрооборудование"
    FUEL_SYSTEM = "Топливная система"
    EXHAUST = "Выхлопная система"
    CLIMATE = "Система кондиционирования"
    BODY = "Кузовные работы"
    OTHER = "Прочие работы"


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
        CheckConstraint("cost BETWEEN 0 AND 99999999"),
        nullable=False
    )
    comments: Mapped[str] = mapped_column(nullable=True)
    category_of_work: Mapped[MaintenanceCategory] = mapped_column(nullable=False)
    act_of_completed_works: Mapped[str] = mapped_column(String(512), nullable=True)
    receipt: Mapped[str] = mapped_column(String(512), nullable=True)
    warranty_card: Mapped[str] = mapped_column(String(512), nullable=True)
    
    car: Mapped["Cars"] = relationship(back_populates="maintenances")
