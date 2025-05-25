from vehicle.schemas.users import RegisterSchema, LoginSchema, LoginResponseSchema
from vehicle.repositories.users import UserRepository
from vehicle.utils.auth import (
    get_hashed_password,
    verify_password,
    create_access_token,
    decode_access_token
)
from vehicle.utils.exeptions import AuthorizationError, CustomValidationError


class UserService:
    def __init__(self, repository: UserRepository) -> None:
        self.repository = repository
    
    def create_user(self, data: RegisterSchema) -> bool:
        if self.repository.check_tg_exists(tg=data.tg):
            raise CustomValidationError.single(
                msg="Пользователь с таким телеграм уже существует",
                input_name="tg",
                input_value=data.tg
            )
        if self.repository.check_username_exists(username=data.username):
            raise CustomValidationError.single(
                msg="Пользователь с таким username уже существует",
                input_name="username",
                input_value=data.username
            )
        data.password = get_hashed_password(data.password)
        return self.repository.create_user(data=data)

    def login_user(self, data: LoginSchema) -> LoginResponseSchema:
        db_data = self.repository.get_username_and_password(username=data.username)
        if db_data and verify_password(data.password, db_data.password):
            return LoginResponseSchema(token=create_access_token(data.username))
        raise CustomValidationError.single(
            msg="Неправильный логин или пароль",
            input_name="username",
            input_value=data.username
        )
    
    def autorize_user(self, token: str) -> dict:
        if self.repository.exists_token(token=token):
            raise AuthorizationError(errors=[{
                "msg": "Невалидный токен",
                "input_name": "token",
                }])
        return decode_access_token(token=token)
    
    def logout_user(self, token: str) -> None:
        self.repository.add_token_into_blacklist(token=token)
