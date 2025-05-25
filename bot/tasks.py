import asyncio
import logging

import aiocron

from datetime import date, timedelta

from aiogram.fsm.storage.base import StorageKey

from .services import UserService
from .database import get_async_session
from .loader import bot, dp
from .states import CarMileageStates
from .models.maintenances import MaintenanceCategory
from .models.cars import Cars


logger = logging.getLogger(__name__)
storage = dp.storage


@aiocron.crontab("0 9 1 * *")
# @aiocron.crontab("30 * * * *")
async def find_out_mileage_task() -> None:
    async for session in get_async_session():
        service = UserService(session=session)
        users_with_cars = await service.get_users_with_cars()
        
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


def check_maintenance(car: Cars, category: MaintenanceCategory, mileage_threshold: int, message: str) -> str | None:
    last_service = max(
        (m for m in car.maintenances if m.category_of_work == category),
        key=lambda m: m.date,
        default=None
    )
    if last_service and car.mileage - last_service.mileage >= mileage_threshold:
        return f"{car.brand} {car.model} (VIN: {car.vin}) - {message}"
    return None


def check_last_maintenance(car: Cars, mileage_threshold: int) -> str | None:
    last = max(car.maintenances, key=lambda m: m.date, default=None)
    if not last:
        return None

    mileage_condition = car.mileage - last.mileage >= mileage_threshold
    date_condition = date.today() - last.date >= timedelta(days=365)

    if mileage_condition or date_condition:
        return f"{car.brand} {car.model} (VIN: {car.vin}) - пора пройти ТО"

    return None


def collect_notifications(car: Cars) -> list[str]:
    notifications = []

    if msg := check_maintenance(car, MaintenanceCategory.OIL_CHANGE, 8000, "пора поменять масло"):
        notifications.append(msg)

    if msg := check_last_maintenance(car, 10000):
        notifications.append(msg)

    if msg := check_maintenance(car, MaintenanceCategory.BRAKES, 30000, "пора заменить тормозные колодки"):
        notifications.append(msg)
    if msg := check_maintenance(car, MaintenanceCategory.BRAKES, 40000, "пора заменить тормозные диски"):
        notifications.append(msg)
    if msg := check_maintenance(car, MaintenanceCategory.BRAKES, 50000, "пора заменить тормозную жидкость"):
        notifications.append(msg)

    if msg := check_maintenance(car, MaintenanceCategory.SUSPENSION, 40000, "пора заменить амортизаторы подвески"):
        notifications.append(msg)

    if msg := check_maintenance(car, MaintenanceCategory.FUEL_SYSTEM, 50000, "пора заменить топливный фильтр и свечи зажигания"):
        notifications.append(msg)

    if msg := check_maintenance(car, MaintenanceCategory.ENGINE, 80000, "пора заменить ремень ГРМ"):
        notifications.append(msg)

    return notifications


@aiocron.crontab("0 6 * * *")
async def send_maintenance_notification_task() -> None:
    async for session in get_async_session():
        service = UserService(session=session)
        users_with_cars = await service.get_users_with_cars_with_maintainance()

        for user in users_with_cars:
            user_notifications = []

            for car in user.cars:
                user_notifications.extend(collect_notifications(car))

            if user_notifications:
                try:
                    await bot.send_message(
                        int(user.tg_id),
                        "Напоминание о техническом обслуживании:\n" + "\n".join(user_notifications)
                    )
                    await asyncio.sleep(0.5)
                except Exception as e:
                    logger.error(f"Failed to send maintenance notification to user {user.tg_id}: {e}")
