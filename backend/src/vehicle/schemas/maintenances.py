import datetime

from pydantic import BaseModel, ConfigDict


class CreateMaintenanceSchema(BaseModel):
    car_vin: str
    date: datetime.date
    mileage: int
    cost: int
    comments: str | None = None
    category_of_work: str
    documents: list[str] | None = None


class GetMaintenanceSchema(CreateMaintenanceSchema):
    id: int
    
    model_config = ConfigDict(from_attributes=True)


class GetAllMaintenancesSchema(BaseModel):
    id: int
    date: datetime.date
    mileage: int
    category_of_work: str
    
    model_config = ConfigDict(from_attributes=True)
