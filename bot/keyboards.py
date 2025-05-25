from aiogram.utils.keyboard import ReplyKeyboardBuilder
from aiogram.types import KeyboardButton, ReplyKeyboardMarkup


def create_main_keyboard() -> ReplyKeyboardMarkup:
    keyboard = ReplyKeyboardMarkup(
        keyboard=[
            [
                KeyboardButton(text="Посмотреть автомобили"),
                KeyboardButton(text="Добавить автомобиль"),
            ],
            [
                KeyboardButton(text="Удалить автомобиль"),
                KeyboardButton(text="Изменить автомобиль"),
            ],
        ],
        resize_keyboard=True,
    )
    return keyboard