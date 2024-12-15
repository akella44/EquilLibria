import asyncio
from aiogram import Bot, Dispatcher, types
from aiogram.client.default import DefaultBotProperties
import logging

from src.config import settings
from .handlers import register_handlers as register_main_handlers


commands = [
    types.BotCommand(command="/start", description="Начать"),
    types.BotCommand(command="/menu", description="Меню"),
]

bot = Bot(
    token=settings.bot_token,
    default=DefaultBotProperties(parse_mode="HTML"),
)
dp = Dispatcher()
register_main_handlers(dp)


async def set_commands():
    await bot.set_my_commands(commands)


async def start_polling():
    await dp.start_polling(bot)


async def shutdown_bot():
    await bot.close()


async def main_bot():
    await set_commands()
    try:
        await start_polling()
    except asyncio.CancelledError:
        await shutdown_bot()
        raise
    except Exception as e:
        # Логирование неожиданных ошибок
        logging.getLogger("app.bot").exception(f"Unexpected error: {e}")
        await shutdown_bot()
