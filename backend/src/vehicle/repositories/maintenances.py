from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from vehicle.models.maintenances import Maintenances
from vehicle.schemas.maintenances import (
    CreateMaintenanceSchema,
    GetMaintenanceSchema,
    GetAllMaintenancesSchema
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
            documents=data.documents
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
    
    def get_all_maintenances(self, vin: str) -> list[GetAllMaintenancesSchema]: #TODO Сделать с фильтрами
        stmt = select(
            Maintenances.id,
            Maintenances.probeg,
            Maintenances.date,
            Maintenances.category_of_work
            ).where(Maintenances.car_vin == vin)
        try:
            maintenances = self.session.execute(stmt).mappings().all()
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
        return None
