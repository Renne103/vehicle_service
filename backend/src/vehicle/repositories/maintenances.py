from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session

from vehicle.models.maintenances import Maintenances
from vehicle.schemas.maintenances import (
    CreateMaintenanceSchema,
    GetMaintenanceSchema,
    GetAllMaintenancesSchema,
    UpdateMaintenanceSchema
)


class MaintenancesRepository:
    def __init__(self, session: Session):
        self.session = session
    
    def create_maintenance(self, data: CreateMaintenanceSchema) -> None:
        maintenance = Maintenances(
            car_vin=data.car_vin,
            date=data.date,
            mileage=data.mileage,
            cost=data.cost,
            comments=data.comments,
            category_of_work=data.category_of_work,
            act_of_completed_works=data.act_of_completed_works,
            receipt=data.receipt,
            warranty_card=data.warranty_card
        )
        try:
            self.session.add(maintenance)
            self.session.commit()
            self.session.refresh(maintenance)
        except Exception as e:
            self.session.rollback()
            raise e
    
    def get_maintenance(self, id: int) -> GetMaintenanceSchema:
        stmt = select(Maintenances).where(Maintenances.id == id)
        try:
            maintenance = self.session.execute(stmt).scalar_one()
            return GetMaintenanceSchema.model_validate(maintenance)
        except Exception as e:
            raise e
    
    def get_all_maintenances(self, vin: str) -> list[GetAllMaintenancesSchema]:
        stmt = select(
            Maintenances
            ).where(Maintenances.car_vin == vin).order_by(Maintenances.date.desc())
        try:
            maintenances = self.session.execute(stmt).scalars().all()
            return [GetAllMaintenancesSchema.model_validate(maintenance) for maintenance in maintenances]
        except Exception as e:
            raise e

    def delete_maintenance(self, id: int) -> None:
        stmt = delete(Maintenances).where(Maintenances.id == id)
        try:
            self.session.execute(stmt)
            self.session.commit()
        except Exception as e:
            self.session.rollback()
            raise e
    
    def update_maintenance(self, id: int, data: UpdateMaintenanceSchema) -> None:
        stmt = (
            update(Maintenances)
            .where(Maintenances.id == id)
            .values(**data.model_dump(exclude_unset=True))
            .execution_options(synchronize_session="fetch")
            )
        try:
            self.session.execute(stmt)
            self.session.commit()
        except Exception as e:
            self.session.rollback()
            raise e
