from abc import ABC, abstractmethod

from vehicle.schemas.users import RegisterSchema


class IUserRepository(ABC):
    @abstractmethod
    def check_tg_exists(self, tg: str) -> bool:
        pass

    @abstractmethod
    def check_username_exists(self, username: str) -> bool:
        pass

    @abstractmethod
    def create_user(self, data: RegisterSchema) -> bool:
        pass