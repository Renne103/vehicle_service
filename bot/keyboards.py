from aiogram.utils.keyboard import ReplyKeyboardBuilder
from aiogram.types import KeyboardButton, ReplyKeyboardMarkup


def create_main_keyboard() -> ReplyKeyboardMarkup:
    keyboard = ReplyKeyboardMarkup(
        keyboard=[
            [
                KeyboardButton(text="Посмотреть автомобили"),
                KeyboardButton(text="Настроить уведомления")
            ],
        ],
        resize_keyboard=True,
    )
    return keyboard