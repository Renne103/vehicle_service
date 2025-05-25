from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from .models.cars import Cars
from .models.users import User


class VehicleService:
    def __init__(self, session: AsyncSession, tg: str = None, vehicle: Cars = None) -> None:
        self.session = session
        self.vehicle = vehicle
        self.tg = tg
    
    async def get_cars(self) -> list[Cars]:
        result = await self.session.execute(
            select(Cars).where(Cars.user.has(tg=self.tg))
        )
        cars = result.scalars().all()
        return cars
    
    async def change_mileage(self, vin: str, mileage: int):
        await self.session.execute(
            update(Cars).where(Cars.vin == vin).values(mileage=mileage)
        )
        # await self.session.commit()


class UserService:
    def __init__(self, session: AsyncSession, tg: str = None) -> None:
        self.session = session
        self.tg = tg
        self.tg_id = None
    
    async def add_tg_id(self, tg_id: str) -> User:
        result = await self.session.execute(
            select(User).where(User.tg == self.tg)
        )
        user: User | None = result.scalar_one_or_none()
        user.tg_id = tg_id
        await self.session.commit()
        await self.session.refresh(user)
        self.tg_id = user.tg_id
    
    async def get_users_with_cars(self) -> list[User]:
        result = await self.session.execute(
            select(User).options(selectinload(User.cars))
        )
        users = result.scalars().all()
        return users

    async def get_users_with_cars_with_maintainance(self) -> list[User]:
        result = await self.session.execute(
            select(User).options(
                selectinload(User.cars).selectinload(Cars.maintenance)
            )
        )
        users = result.scalars().all()
        return users
