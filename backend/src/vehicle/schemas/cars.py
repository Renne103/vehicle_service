from datetime import date

from pydantic import BaseModel, ConfigDict


class UsersCarsSchema(BaseModel):    
    vin: str
    model: str
    brand: str
    year_of_release: date | None
    mileage: int
    plate_license: str | None

    model_config = ConfigDict(from_attributes=True)


class NewCarSchema(UsersCarsSchema):
    pass


class ViewCarSchema(UsersCarsSchema):
    photo: str
    
    model_config = ConfigDict(from_attributes=True)


class PhotoSchema(BaseModel):
    photo: str


class UploadPhotoSchema(PhotoSchema):
    vin: str