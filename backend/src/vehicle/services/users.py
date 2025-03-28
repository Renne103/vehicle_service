from vehicle.schemas.users import RegisterSchema
from vehicle.repositories.users import UserRepository
from vehicle.utils.auth import get_hashed_password


class UserService:
    def __init__(self, repository: UserRepository) -> None:
        self.repository = repository
    
    def create_user(self, data: RegisterSchema) -> bool:
        if self.repository.check_tg_exists(tg=data.tg):
            raise ValueError("User with this tg already exists")
        if self.repository.check_username_exists(username=data.username):
            raise ValueError("User with this username already exists")
        data.password = get_hashed_password(data.password)
        return self.repository.create_user(data=data)
        