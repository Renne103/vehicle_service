import logging

from aiogram import Router, F
from aiogram.fsm.context import FSMContext
from aiogram.types import Message, ReplyKeyboardRemove
from aiogram.filters import CommandStart, Command, StateFilter
from sqlalchemy.ext.asyncio import AsyncSession

from .services import VehicleService, UserService
from .keyboards import create_main_keyboard
from .states import CarMileageStates


logger = logging.getLogger(__name__) 

router = Router()


@router.message(CommandStart(), StateFilter("*"))
async def start_command_handler(
    message: Message,
    session: AsyncSession,
    state: FSMContext,
) -> None:
    await state.clear()
    await message.answer(
        "Привет! Это бот для отправки уведомлений о состоянии автомобиля.\nБуду напоминать о том, что пора пройти ТО)",
        reply_markup=create_main_keyboard()
    )
    service = UserService(
        session=session,
        tg=message.from_user.username
    )
    await service.add_tg_id(tg_id=str(message.from_user.id))
    logger.info(f"User {message.from_user.id} started the bot.")


@router.message(F.text == "Посмотреть автомобили", StateFilter("*"))
async def view_car_handler(
    message: Message,
    state: FSMContext,
    session: AsyncSession
) -> None:
    await state.clear()
    vehicle_service = VehicleService(session, tg=message.from_user.username)
    cars = await vehicle_service.get_cars()
    
    if not cars:
        await message.answer("У вас нет автомобилей.", reply_markup=create_main_keyboard())
        return
    
    car_list = "\n".join([f"{car.brand} {car.model}" for car in cars])
    await message.answer(f"Ваши автомобили:\n{car_list}", reply_markup=create_main_keyboard())
    
    logger.info(f"User {message.from_user.id} viewed their cars.")


@router.message(StateFilter(CarMileageStates.waiting_for_mileage))
async def parse_mileage_handler(
    message: Message,
    state: FSMContext,
    session: AsyncSession
) -> None:
    if not message.text:
        await message.answer("Пожалуйста, введите пробег в формате: VIN1: пробег1, VIN2: пробег2, ...")
        return
    
    vehicle_service = VehicleService(session, tg=message.from_user.username)
    
    try:
        mileage_data = {}
        for item in message.text.split(","):
            vin, mileage = item.split(":")
            mileage_data[vin.strip()] = int(mileage.strip())
        
        for vin, mileage in mileage_data.items():
            await vehicle_service.change_mileage(vin=vin, mileage=mileage)
        await session.commit()
        
        await message.answer("Пробег успешно обновлен.", reply_markup=create_main_keyboard())
    except Exception as e:
        logger.error(f"Error updating mileage: {e}")
        await message.answer("Произошла ошибка при обновлении пробега. Пожалуйста, проверьте формат ввода.")
    
    await state.clear()


@router.message(F.text)
async def default_message_handler(
    message: Message,
    state: FSMContext
) -> None:
    if await state.get_state() == CarMileageStates.waiting_for_mileage:
        await message.answer("Пожалуйста, введите пробег в формате: VIN1: пробег1, VIN2: пробег2, ...")
    else:
        await message.answer("Я не понимаю эту команду. Пожалуйста, используйте меню или команды.", 
                             reply_markup=create_main_keyboard())
