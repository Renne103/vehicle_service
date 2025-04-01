from vehicle.repositories.cars import CarsRepository
from vehicle.repositories.users import UserRepository
from vehicle.schemas.cars import UsersCarsSchema


class CarsService:
    def __init__(self, repository: CarsRepository) -> None:
        self.repository = repository

    def get_users_cars(self, username: str) -> list[UsersCarsSchema]:
        return self.repository.get_users_cars(username=username)

    def add_car(self, username: str, data: UsersCarsSchema) -> None:
        user_id = UserRepository(
            session=self.repository.session
            ).get_user_id_from_username(username=username)
        return self.repository.add_car(user_id=user_id, data=data)