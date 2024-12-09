from fastapi import FastAPI, Request, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
import logging
import asyncio

from .auth.router import router as auth_router
from .users.router import router as users_router

from .database import Base, db_manager
from .config import DEV, setup_logging, origins

from .telegram.bot import main_bot


app = FastAPI(
    title="Equillibria API",
    description="API for math formula platform Equillibria",
    version="1.0",
)

main_router = APIRouter(prefix="/api")

setup_logging()
logger = logging.getLogger("app")


@app.exception_handler(Exception)
async def global_exception_handler(_: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}")  # Логирование ошибки
    if DEV:
        return JSONResponse(
            status_code=500,
            content={"message": "Internal Server Error", "details": str(exc)},
        )
    return JSONResponse(
        status_code=500,
        content={"message": "Internal Server Error"},
    )


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

main_router.include_router(auth_router)
main_router.include_router(users_router)

app.include_router(main_router)


@app.on_event("startup")
async def on_startup():
    """
    Событие запуска приложения.
    Запускает Telegram-бота как фоновую задачу.
    """
    logger.info("Запуск Telegram-бота...")
    app.state.bot_task = asyncio.create_task(main_bot())
    logger.info("Telegram-бот запущен.")


@app.on_event("shutdown")
async def on_shutdown():
    """
    Событие завершения работы приложения.
    Останавливает Telegram-бота.
    """
    logger.info("Остановка Telegram-бота...")
    app.state.bot_task.cancel()
    try:
        await app.state.bot_task
    except asyncio.CancelledError:
        logger.info("Telegram-бот остановлен.")
    logger.info("Приложение завершает работу.")
