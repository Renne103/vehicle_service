from aiogram import Dispatcher, Bot

from .configs import settings
from .middlewares import DatabaseMiddleware
from .handlers import router as main_router


bot = Bot(token=settings.BOT_TOKEN)
dp = Dispatcher()
dp.message.middleware(DatabaseMiddleware())
dp.include_router(main_router)


async def main():
    await dp.start_polling(bot)


if __name__ == "__main__":
    import logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler("/app/logs/bot_log.log", mode='a', encoding='utf-8'),
            logging.StreamHandler()
        ]
    )
    
    import asyncio
    asyncio.run(main())
