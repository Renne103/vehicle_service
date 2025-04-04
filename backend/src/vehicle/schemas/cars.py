from datetime import date

from pydantic import BaseModel, ConfigDict


class UsersCarsSchema(BaseModel):    
    vin: str
    model: str
    brand: str
    year_of_release: date
    mileage: int


class NewCarSchema(UsersCarsSchema):
    pass