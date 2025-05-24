from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from .models.cars import Cars


class VehicleService:
    def __init__(self, session: AsyncSession, vehicle: Cars, tg: str) -> None:
        self.session = session
        self.vehicle = vehicle
        self.tg = tg
    
    async def get_cars(self) -> list[Cars]:
        result = await self.session.execute(
            select(Cars).where(Cars.user.has(tg=self.tg))
        )
        cars = result.scalars().all()
        return cars
    
    async def change_mileage(self, vin: str, mileage: int) -> Cars:
        result = await self.session.execute(
            update(Cars).where(Cars.vin == vin).values(mileage=mileage)
        )
        await self.session.commit()
        return result.scalars().first()
    