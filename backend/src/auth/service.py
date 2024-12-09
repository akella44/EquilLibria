import random

from fastapi import Depends, HTTPException, Form, Request
from geoip2.errors import AddressNotFoundError
from aiogram import Bot
from sqlalchemy.ext.asyncio import AsyncSession

from .dependencies import validate_auth_user_body
from .schemas import VerifyCodeRequest, LoginFirstStepMessageResponse
from ..config import settings, auth_settings
from ..database import db_manager, redis_client
from ..users.schemas import User as UserSchema, VerifyCodeUser
from ..users.service import get_user_by_username

import geoip2.database
from user_agents import parse


geoip_reader = geoip2.database.Reader("data/GeoLite2-City.mmdb")

bot = Bot(token=settings.bot_token)


async def login(user: UserSchema = Depends(validate_auth_user_body)):
    if not user.tg_username:
        return user

    # Генерация 2FA кода
    code = str(random.randint(100000, 999999))

    # Сохранение кода и количества попыток в Redis с истечением срока действия
    await redis_client.set(
        f"2fa_code:{user.username}", code, ex=auth_settings.tg_bot_code_expire_seconds
    )
    await redis_client.set(
        f"2fa_attempts:{user.username}", 0, ex=auth_settings.tg_bot_code_expire_seconds
    )

    # Получение chat_id из Redis
    chat_id = await redis_client.get(f"telegram_chat_id:{user.username}")
    if chat_id is None:
        raise HTTPException(
            status_code=400,
            detail="Telegram-аккаунт не привязан. Пожалуйста, начните диалог с ботом для привязки аккаунта.",
        )

    try:
        # Отправка кода через Telegram-бота
        await bot.send_message(
            chat_id=int(chat_id),
            text=f"Ваш 2FA код: <code>{code}</code>",
            parse_mode="HTML",
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail="Не получается отправить код в Telegram. Попробуйте позже",
        )
    return LoginFirstStepMessageResponse(message="2FA код отправлен через Telegram")


async def verify_code(
    client_request: Request,
    verify_code_user: VerifyCodeUser,
    session: AsyncSession = Depends(db_manager.session_dependency),
):
    request = VerifyCodeRequest(
        username=verify_code_user.username, code=verify_code_user.code
    )
    # Получение сохраненного кода и количества попыток из Redis
    code = await redis_client.get(f"2fa_code:{request.username}")
    attempts = await redis_client.get(f"2fa_attempts:{request.username}")

    if code is None:
        raise HTTPException(status_code=400, detail="2FA код не найден или истек")

    attempts = int(attempts)

    if attempts >= auth_settings.tg_bot_code_max_attempts:
        raise HTTPException(
            status_code=403, detail="Превышено максимальное количество попыток"
        )

    if request.code == code:  # Успешный вход
        await redis_client.delete(f"2fa_code:{request.username}")
        await redis_client.delete(f"2fa_attempts:{request.username}")

        # Отправка уведомления о входе через Telegram-бота
        chat_id = await redis_client.get(f"telegram_chat_id:{request.username}")
        user_info = await get_client_information(client_request)
        user_info_string = "\n".join(
            f"{key}: {value}" for key, value in user_info.items()
        )
        await bot.send_message(
            chat_id=int(chat_id),
            text=f"В ваш аккаунт <i><b>{request.username}</b></i> произведен вход\n"
            + user_info_string,
            parse_mode="HTML",
        )

        return await get_user_by_username(session=session, username=request.username)
    else:
        # Увеличение количества попыток
        attempts += 1
        await redis_client.set(f"2fa_attempts:{request.username}", attempts)
        raise HTTPException(status_code=401, detail="Неверный 2FA код")


async def get_client_information(request: Request) -> dict:
    client_ip = request.client.host

    user_agent = request.headers.get("User-Agent")
    parsed_ua = parse(user_agent)

    try:
        # Определяем страну и город из локальной базы GeoLite2
        location = geoip_reader.city(client_ip)
        country = location.country.name
        city = location.city.name
    except AddressNotFoundError:
        location = "?"
        country = "?"
        city = "?"

    # Формируем данные для ответа
    user_info = {
        "IP": client_ip,
        "Страна": country,
        "Город": city,
        "Браузер": parsed_ua.browser.family,
        "ОС": parsed_ua.os.family,
    }

    return user_info
