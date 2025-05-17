import logging

from aiogram import Router, F
from aiogram.fsm.context import FSMContext
from aiogram.types import Message, ReplyKeyboardRemove
from aiogram.filters import CommandStart, Command, StateFilter
from sqlalchemy.ext.asyncio import AsyncSession


logger = logging.getLogger(__name__) 

router = Router()


@router.message(CommandStart(), StateFilter("*"))
async def start_command_handler(
    message: Message,
    state: FSMContext,
    session: AsyncSession
) -> None:
    await state.clear()
    await message.answer(
        "Welcome to the Vehicle Service Bot! How can I assist you today?",
        reply_markup=ReplyKeyboardRemove()
    )
    logger.info(f"User {message.from_user.id} started the bot.")
