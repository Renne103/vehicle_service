from vehicle.repositories.maintenances import MaintenancesRepository
from vehicle.repositories.cars import CarsRepository
from vehicle.schemas.maintenances import (
    CreateMaintenanceSchema,
    GetMaintenanceSchema,
    GetAllMaintenancesSchema
)
from vehicle.utils.exeptions import CustomValidationError


class MaintenancesService:
    def __init__(self, repository: MaintenancesRepository):
        self.repository = repository
    
    def get_maintenance(self, id: int) -> GetMaintenanceSchema:
        try:
            return self.repository.get_maintenance(id=id)
        except Exception as e:
            raise CustomValidationError.single(
                msg="Такого id обслуживания не существует",
                input_name="id",
                input_value=id
            )
    
    def get_all_maintenances(self, vin: str) -> list[GetAllMaintenancesSchema]:
        return self.repository.get_all_maintenances(vin=vin)

    def create_maintenances(self, data: CreateMaintenanceSchema) -> None:
        if not CarsRepository(session=self.repository.session).exists_vin(data.car_vin):
            raise CustomValidationError.single(
                msg="Такой VIN не существует",
                input_name="vin",
                input_value=data.car_vin
            )
        try:
            return self.repository.create_maintenance(data=data)
        except Exception as e:
            raise CustomValidationError.single(
                msg=f"Неизвестная ошибка: {str(e)}",
                input_name=None,
                input_value=None
            )
