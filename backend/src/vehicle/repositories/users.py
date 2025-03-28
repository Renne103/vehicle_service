from sqlalchemy import insert, select, exists
from sqlalchemy.orm import Session

from vehicle.schemas.users import RegisterSchema
from vehicle.models.users import User


class UserRepository:
    def __init__(self, session: Session) -> None:
        self.session = session
        
    def create_user(self, data: RegisterSchema) -> User:
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
