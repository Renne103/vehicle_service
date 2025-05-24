import logging

from aiogram import Router, F
from aiogram.fsm.context import FSMContext
from aiogram.types import Message, ReplyKeyboardRemove
from aiogram.filters import CommandStart, Command, StateFilter
from sqlalchemy.ext.asyncio import AsyncSession

from .services import VehicleService


logger = logging.getLogger(__name__) 

router = Router()


@router.message(CommandStart(deep_link=True), StateFilter("*"))
async def start_command_handler(
    message: Message,
    state: FSMContext,
) -> None:
    await state.clear()
    await message.answer(
        "Привет! Это бот для отправки уведомлений о состоянии автомобиля.\n Буду напоминать о том, что пора пройти ТО)",
        reply_markup=ReplyKeyboardRemove()
    )
    logger.info(f"User {message.from_user.id} started the bot.")


@router.message(F.text == "Посмотреть автомобили", StateFilter("*"))
async def view_car_handler(
    message: Message,
    state: FSMContext,
    session: AsyncSession
) -> None:
    await state.clear()
    vehicle_service = VehicleService(session, vehicle="ass", tg=message.from_user.username)
    cars = await vehicle_service.get_cars()
    
    if not cars:
        await message.answer("У вас нет автомобилей.")
        return
    
    car_list = "\n".join([f"{car.brand} {car.model}" for car in cars])
    await message.answer(f"Ваши автомобили:\n{car_list}")
    
    logger.info(f"User {message.from_user.id} viewed their cars.")
