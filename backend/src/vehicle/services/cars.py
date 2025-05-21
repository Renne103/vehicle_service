from vehicle.repositories.cars import CarsRepository
from vehicle.repositories.users import UserRepository
from vehicle.schemas.cars import NewCarSchema, ViewCarSchema, ChangeCarSchema
from vehicle.utils.exeptions import CustomValidationError


class CarsService:
    def __init__(self, repository: CarsRepository) -> None:
        self.repository = repository

    def get_users_cars(self, username: str) -> list[ViewCarSchema]:
        return self.repository.get_users_cars(username=username)

    def add_car(self, username: str, data: NewCarSchema) -> list[ViewCarSchema]:
        if self.repository.exists_vin(vin=data.vin):
            raise CustomValidationError.single(
                msg="Такой VIN уже существует",
                input_name="vin",
                input_value=data.vin
            )
        try:
            user_id = UserRepository(
                session=self.repository.session
                ).get_user_id_from_username(username=username)
        except Exception as e:
            raise CustomValidationError.single(
                msg="Пользователь не найден",
                input_name="username",
                input_value=username
            )
        return self.repository.add_car(user_id=user_id, data=data, username=username)

    def upload_car_photo(self, vin: str, data: ChangeCarSchema) -> ViewCarSchema:
        if not self.repository.exists_vin(vin=vin):
            raise CustomValidationError.single(
                msg="Такой VIN не существует",
                input_name="vin",
                input_value=vin
            )
        return self.repository.upload_car_photo(vin=vin, data=data)
    
    def get_car(self, vin: str, username: str) -> ViewCarSchema:
        if not self.repository.exists_vin(vin=vin):
            raise CustomValidationError.single(
                msg="Такой VIN не существует",
                input_name="vin",
                input_value=vin
            )
        car = self.repository.get_car(vin=vin)
        user_id = UserRepository(
            session=self.repository.session
            ).get_user_id_from_username(username=username)
        if car.user_id != user_id:
            raise CustomValidationError.single(
                msg="Такой VIN не принадлежит данному пользователю",
                input_name="vin",
                input_value=vin
            )
        del car.user_id
        car = ViewCarSchema.model_validate(car)
        return car
    
    def delete_car(self, vin: str, username: str) -> list[ViewCarSchema]:
        if not self.repository.exists_vin(vin=vin):
            raise CustomValidationError.single(
                msg="Такой VIN не существует",
                input_name="vin",
                input_value=vin
            )
        user_id = UserRepository(
            session=self.repository.session
            ).get_user_id_from_username(username=username)
        car = self.repository.get_car(vin=vin)
        if car.user_id != user_id:
            raise CustomValidationError.single(
                msg="Такой VIN не принадлежит данному пользователю",
                input_name="vin",
                input_value=vin
            )
        self.repository.delete_car(vin=vin)
        return self.get_users_cars(username=username)