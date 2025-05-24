from aiogram import Bot, Dispatcher
from aiogram.fsm.storage.memory import MemoryStorage

from .configs import settings
from .middlewares import DatabaseMiddleware
from .handlers import router as main_router


storage = MemoryStorage()
bot = Bot(token=settings.BOT_TOKEN)
dp = Dispatcher(storage=storage)
dp.message.middleware(DatabaseMiddleware())
dp.include_router(main_router)


async def main():
    await bot.get_me()
    
    from . import tasks

    await dp.start_polling(bot)
