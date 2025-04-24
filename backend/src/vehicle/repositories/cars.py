from sqlalchemy.orm import Session
from sqlalchemy import select

from vehicle.schemas.cars import ChangeCarSchema, UsersCarsSchema, NewCarSchema, ViewCarSchema, UserCarSchema
from vehicle.models.cars import Cars
from vehicle.models.users import User


class CarsRepository:
    def __init__(self, session: Session) -> None:
        self.session = session
    
    def get_users_cars(self, username: str) -> list[UsersCarsSchema]:
        stmt = (
            select(
                Cars.brand,
                Cars.model,
                Cars.vin,
                Cars.year_of_release,
                Cars.mileage,
                Cars.plate_license,
                Cars.photo
                )
            .join(Cars.user)
            .where(User.username == username)
        )
        result = self.session.execute(stmt).mappings().all()
        return [UsersCarsSchema.model_validate(car) for car in result]
    
    def add_car(self, user_id: int, data: NewCarSchema, username: str) -> list[UsersCarsSchema]:
        new_car = Cars(**data.model_dump(), user_id=user_id)
        self.session.add(new_car)
        self.session.commit()
        self.session.refresh(new_car)
        return self.get_users_cars(username=username)
    
    def exists_vin(self, vin: str) -> bool:
        stmt = select(Cars.vin).where(Cars.vin == vin)
        return self.session.execute(stmt).scalar_one_or_none() is not None
    
    def upload_car_photo(self, vin: str, data: ChangeCarSchema) -> ViewCarSchema:
        stmt = select(Cars).where(Cars.vin == vin)
        car = self.session.execute(stmt).scalar_one()
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(car, key, value)
        self.session.add(car)
        self.session.commit()
        self.session.refresh(car)
        return ViewCarSchema.model_validate(car)
    
    def get_car(self, vin: str) -> UserCarSchema:
        stmt = select(Cars).where(Cars.vin == vin)
        car = self.session.execute(stmt).scalar_one()
        return UserCarSchema.model_validate(car)