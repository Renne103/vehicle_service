import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator

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
    
    @field_validator("date", mode="before")
    @classmethod
    def parse_date(cls, value):
        if isinstance(value, str):
            try:
                return datetime.datetime.strptime(value, "%d.%m.%Y").date()
            except ValueError:
                raise ValueError("Дата должна быть в формате DD.MM.YYYY")
        return value

    class Config:
        json_encoders = {
            datetime.date: lambda v: v.strftime("%d.%m.%Y")
        }


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
    