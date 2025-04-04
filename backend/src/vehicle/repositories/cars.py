from sqlalchemy.orm import Session
from sqlalchemy import select

from vehicle.schemas.cars import UsersCarsSchema, NewCarSchema
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
                )
            .join(Cars.user)
            .where(User.username == username)
        )
        result = self.session.execute(stmt).mappings().all()
        print(result, flush=True)
        return [UsersCarsSchema.model_validate(car) for car in result]
    
    def add_car(self, user_id: int, data: NewCarSchema) -> None:
        new_car = Cars(**data.model_dump(), user_id=user_id)
        self.session.add(new_car)
        self.session.commit()
        self.session.refresh(new_car)
        