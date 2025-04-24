from datetime import datetime

from pydantic import BaseModel, ConfigDict, field_validator


class UsersCarsSchema(BaseModel):    
    vin: str
    model: str
    brand: str
    year_of_release: int | None = None
    mileage: int
    plate_license: str | None = None

    model_config = ConfigDict(from_attributes=True)
    
    @field_validator("year_of_release")
    def validate_year_of_release(cls, v):
        if v is not None and (v < 1900 or v > datetime.now().year):
            raise ValueError("Некорректно указан год выпуска")
        return v


class NewCarSchema(UsersCarsSchema):
    photo: str | None = None


class ViewCarSchema(UsersCarsSchema):
    photo: str | None = None
    
    model_config = ConfigDict(from_attributes=True)


class UserCarSchema(ViewCarSchema):
    user_id: int
    
    model_config = ConfigDict(from_attributes=True)


class PhotoSchema(BaseModel):
    photo: str


class ChangeCarSchema(BaseModel):
    model: str | None = None
    brand: str | None = None
    year_of_release: int | None = None
    mileage: int | None = None
    plate_license: str | None = None
    photo: str | None = None
    
    @field_validator("year_of_release")
    def validate_year_of_release(cls, v):
        if v is not None and v < 1900 or v > int(datetime.now().year):
            raise ValueError("Некорректно указан год выпуска")
        return v
