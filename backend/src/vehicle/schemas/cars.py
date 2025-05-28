from datetime import datetime

from pydantic import BaseModel, ConfigDict, field_validator


class UsersCarsSchema(BaseModel):    
    vin: str
    model: str
    brand: str
    year_of_release: str | int | None = None
    mileage: str | int
    plate_license: str | None = None

    model_config = ConfigDict(from_attributes=True)
    
    @field_validator("mileage")
    def validate_mileage(cls, v):
        try:
            int(v)
        except:
            raise ValueError("Некорректно указан пробег")
        return v
    
    @field_validator("year_of_release")
    def validate_year_of_release(cls, v):
        try:
            v = int(v)
        except:
            raise ValueError("Некорректно указан год выпуска")
        if v is None:
            raise ValueError("Некорректно указан год выпуска")
        if v is not None and (v < 1900 or v > datetime.now().year):
            raise ValueError("Некорректно указан год выпуска")
        return int(v)

class NewCarSchema(UsersCarsSchema):
    photo: str | None = None
    
    model_config = ConfigDict(from_attributes=True)
    
    @field_validator("vin")
    def validate_vin(cls, v):
        if len(v) != 17:
            raise ValueError("Некорректно указан VIN")
        return v


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
    year_of_release: str | int | None = None
    mileage: str | int | None = None
    plate_license: str | None = None
    photo: str | None = None
    
    @field_validator("mileage")
    def validate_mileage(cls, v):
        try:
            int(v)
        except:
            raise ValueError("Некорректно указан пробег")
        return v
    
    @field_validator("year_of_release")
    def validate_year_of_release(cls, v):
        try:
            v = int(v)
        except ValueError:
            raise ValueError("Некорректно указан год выпуска")
        if v is not None and (v < 1900 or v > datetime.now().year):
            raise ValueError("Некорректно указан год выпуска")
        return int(v)
