import asyncio
import logging

import aiocron

from aiogram.fsm.storage.base import StorageKey

from .services import UserService
from .database import get_async_session
from .loader import bot, dp
from .states import CarMileageStates


logger = logging.getLogger(__name__)
storage = dp.storage


@aiocron.crontab("0 9 1 * *")
# @aiocron.crontab("30 * * * *")
async def find_out_mileage_task() -> None:
    async for session in get_async_session():
        vehicle_service = UserService(session=session)
        users_with_cars = await vehicle_service.get_users_with_cars()
        
        for user in users_with_cars:
            user_cars = []
            for car in user.cars:
                user_cars.append(
                    f"{car.brand} {car.model} (VIN: {car.vin}, Mileage: {int(car.mileage)})"
                )
            if user_cars:
                try:
                    await bot.send_message(int(user.tg_id), "Ваши автомобили:\n" + "\n".join(user_cars))
                    await bot.send_message(
                        int(user.tg_id), "Введите пробег для каждого автомобиля, используя формат:\n"
                        "VIN1: пробег1, VIN2: пробег2, ...")
                    key = StorageKey(
                        bot_id=bot.id,
                        user_id=int(user.tg_id),
                        chat_id=int(user.tg_id)
                    )
                    await storage.set_state(key, CarMileageStates.waiting_for_mileage)
                    await asyncio.sleep(0.5)
                except Exception as e:
                    logger.error(f"Failed to send message to user {user.tg_id}: {e}")