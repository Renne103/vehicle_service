import datetime

from pydantic import BaseModel, ConfigDict, Field

from vehicle.models.maintenances import MaintenanceCategory


class CreateMaintenanceSchema(BaseModel):
    car_vin: str = Field(..., min_length=17, max_length=17)
    date: datetime.date
    mileage: int = Field(..., ge=0, le=99_999_999)
    cost: int = Field(..., ge=0)
    comments: str | None = None
    category_of_work: MaintenanceCategory
    documents: list[str] | None = None


class GetMaintenanceSchema(CreateMaintenanceSchema):
    id: int
    
    model_config = ConfigDict(from_attributes=True)


class GetAllMaintenancesSchema(BaseModel):
    id: int
    date: datetime.date
    mileage: int = Field(..., ge=0, le=99_999_999)
    category_of_work: MaintenanceCategory
    
    model_config = ConfigDict(from_attributes=True)
