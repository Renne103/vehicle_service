from sqlalchemy import select, exists
from sqlalchemy.orm import Session

from vehicle.schemas.users import RegisterSchema
from vehicle.models.users import User, TokenBlackList


class UserRepository:
    def __init__(self, session: Session) -> None:
        self.session = session
        
    def create_user(self, data: RegisterSchema) -> str:
        user = User(username=data.username, password=data.password, tg=data.tg)
        try:
            self.session.add(user)
            self.session.commit()
            self.session.refresh(user)
            return user.username
        except Exception as e:
            self.session.rollback()
            raise e
    
    def check_username_exists(self, username: str) -> bool:
        stmt = select(User.id).where(User.username == username)
        return self.session.execute(stmt).scalar_one_or_none() is not None
    
    def check_tg_exists(self, tg: str) -> bool:
        stmt = select(User.id).where(User.tg == tg)
        return self.session.execute(stmt).scalar_one_or_none() is not None
    
    def get_username_and_password(self, username: str) -> tuple[str, str] | None:
        stmt = (
            select(User.username, User.password).where(User.username == username)
        )
        return self.session.execute(stmt).first()

    def exists_token(self, token: str) -> bool:
        stmt = select(exists().where(TokenBlackList.token == token))
        return self.session.execute(stmt).scalar()
    
    def add_token_into_blacklist(self, token: str) -> None:
        try:
            self.session.add(TokenBlackList(token=token))
            self.session.commit()
        except Exception as e:
            self.session.rollback()
            raise e

    def get_user_id_from_username(self, username: str) -> int | None:
        stmt = select(User.id).where(User.username == username)
        return self.session.execute(stmt).scalar_one_or_none()