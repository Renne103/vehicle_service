import datetime

from pydantic import BaseModel, ConfigDict, Field

from vehicle.models.maintenances import MaintenanceCategory


class CreateMaintenanceSchema(BaseModel):
    car_vin: str
    date: datetime.date
    mileage: int = Field(..., ge=0, le=99_999_999)
    cost: int = Field(..., ge=0)
    comments: str | None = None
    category_of_work: MaintenanceCategory
    act_of_completed_works: str | None = None
    receipt: str | None = None
    warranty_card: str | None = None


class GetMaintenanceSchema(CreateMaintenanceSchema):
    id: int
    
    model_config = ConfigDict(from_attributes=True)


class GetAllMaintenancesSchema(GetMaintenanceSchema):    
    model_config = ConfigDict(from_attributes=True)


class UpdateMaintenanceSchema(BaseModel):
    date: datetime.date | None = None
    mileage: int | None = Field(None, ge=0, le=99_999_999)
    cost: int | None = Field(None, ge=0)
    comments: str | None = None
    category_of_work: MaintenanceCategory | None = None
    act_of_completed_works: str | None = None
    receipt: str | None = None
    warranty_card: str | None = None
    