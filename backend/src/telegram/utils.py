import json
from datetime import datetime
from enum import Enum
from itertools import zip_longest

import pytz
from aiogram.types import CallbackQuery, Message, InlineKeyboardMarkup
from functools import wraps
from fastapi import HTTPException

from src.telegram.keyboards import menu_reply_keyboard
from src.users.exceptions import UserExistsError
from src.users.schemas import UserCreateUsernameHashedPassword
from src.users.service import (
    get_user_by_tg_username,
    create_user,
    create_user_by_username_hashed_password,
)
from src.database import db_manager, redis_client
from src.users.models import User


class Permission(Enum):
    ADMIN = 1
    ALL = 2


def permission_decorator(permission: Permission):
    def access_required(func):
        @wraps(func)
        async def wrapper(event, *args, **kwargs):
            if not isinstance(event, (CallbackQuery, Message)):
                return
            user = await get_user_from_system(event=event)
            if not user:
                return

            # Проверяем доступ пользователя
            if permission == permission.ADMIN and not user.admin:
                return await answer_deny(
                    event=event, message="Доступ разрешен только админу"
                )

            return await func(event, *args, **kwargs)

        return wrapper

    return access_required


async def get_user_from_system(event) -> User | None:
    async with db_manager.session_maker() as session:
        try:
            tg_username = "@" + event.from_user.username
            user = await get_user_by_tg_username(
                tg_username=tg_username, session=session
            )
        except HTTPException:
            message = (
                "Ваш аккаунт не привязан к профилю в системе psih! "
                "Привяжите ваш telegram-аккаунт и повторите попытку."
            )
            await answer_deny(event=event, message=message)
            return
        await session.close()
        return user


async def answer_deny(event, message: str) -> None:
    if isinstance(event, CallbackQuery):
        await event.message.answer(message, reply_markup=menu_reply_keyboard)
        await event.answer()
    elif isinstance(event, Message):
        await event.answer(message, reply_markup=menu_reply_keyboard)


def delete_and_send_new_message(func):
    @wraps(func)
    async def wrapper(callback: CallbackQuery, *args, **kwargs):
        await callback.message.delete()
        await func(callback, *args, **kwargs)
        await callback.answer()

    return wrapper


def edit_message(func):
    @wraps(func)
    async def wrapper(callback: CallbackQuery, *args, **kwargs):
        # Вызываем функцию для получения нового текста и клавиатуры
        new_text, new_reply_markup = await func(callback, *args, **kwargs)

        if not new_reply_markup:
            new_reply_markup = InlineKeyboardMarkup(inline_keyboard=[])

        # Обновляем текст сообщения и клавиатуру
        await callback.message.edit_text(text=new_text, reply_markup=new_reply_markup)

        # Закрываем инлайн-уведомление
        await callback.answer()

    return wrapper


def grouper(iterable, n, fillvalue=None):
    args = [iter(iterable)] * n
    return zip_longest(*args, fillvalue=fillvalue)


def convert_to_moscow_time(utc_dt: datetime):
    # Установка часового пояса UTC для входного времени
    utc_zone = pytz.timezone("UTC")
    moscow_zone = pytz.timezone("Europe/Moscow")

    # Перевод времени из UTC в московское время
    utc_dt = utc_zone.localize(utc_dt)
    moscow_dt = utc_dt.astimezone(moscow_zone)

    # Форматирование даты в нужный формат
    return moscow_dt.strftime("%d.%m %H:%M")


async def create_user_by_unique_token(token: str, tg_username: str) -> User:
    async with db_manager.session_maker() as session:
        try:
            await get_user_by_tg_username(session=session, tg_username=tg_username)
            raise UserExistsError
        except HTTPException:
            pass
        data = await redis_client.get(f"tg_register_confirm:{token}")
        if data is None:
            raise ValueError

        await redis_client.delete(f"tg_register_confirm:{token}")
        data = json.loads(data)
        username = data["username"]
        hashed_password = str.encode(data["hashed_password"], encoding="utf-8")
        user_create = UserCreateUsernameHashedPassword(
            username=username, hashed_password=hashed_password, tg_username=tg_username
        )

        return await create_user_by_username_hashed_password(
            session=session, user_create=user_create
        )
