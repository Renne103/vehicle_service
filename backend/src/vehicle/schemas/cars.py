from datetime import date

from pydantic import BaseModel, ConfigDict


class UsersCarsSchema(BaseModel):    
    vin: str
    model: str
    brand: str
    year_of_release: date
    mileage: int
    photo: str | None
    plate_license: str | None

    # model_config = ConfigDict(from_attributes=True)


class NewCarSchema(UsersCarsSchema):
    pass