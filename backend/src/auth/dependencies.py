import json
import uuid

from aiogram import Bot
from fastapi import Depends, HTTPException, Form
from fastapi.security import OAuth2PasswordBearer
from jwt import InvalidTokenError
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from .schemas import (
    LinkTelegramBot,
    RegisterRequest,
)
from ..config import (
    TOKEN_TYPE_FIELD,
    ACCESS_TOKEN_TYPE,
    REFRESH_TOKEN_TYPE,
    settings,
    auth_settings,
)
from . import utils as auth_utils
from .. import utils
from ..users.schemas import User as UserSchema, LoginUser, UserCreate
from ..users import service, User
from ..database import db_manager, redis_client
from ..users.service import get_user_by_username, create_user
from ..utils import hash_password


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/jwt/login-swagger/")
bot = Bot(token=settings.bot_token)


async def get_current_token_payload(token: str = Depends(oauth2_scheme)) -> dict:
    try:
        payload = await auth_utils.decode_jwt(token=token)
    except InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Неверный токен: {e}",
        )
    return payload


async def validate_token_type(payload: dict, token_type: str) -> bool:
    current_token_type = payload.get(TOKEN_TYPE_FIELD)
    if current_token_type == token_type:
        return True
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=f"Неверный тип токена {current_token_type!r} ожидается {token_type!r}",
    )


async def get_user_by_token_sub(payload: dict, session: AsyncSession) -> UserSchema:
    id: str | None = payload.get("sub")
    if id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный токен (пользователь не найден)",
        )

    user = await service.get_user_by_id(session=session, user_id=int(id))
    if user:
        return user
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Неверный токен (пользователь не найден)",
    )


class UserGetterFromToken:
    def __init__(self, token_type: str):
        self.token_type = token_type

    async def __call__(
        self,
        payload: dict = Depends(get_current_token_payload),
        session: AsyncSession = Depends(db_manager.session_dependency),
    ) -> UserSchema:
        await validate_token_type(payload, self.token_type)
        return await get_user_by_token_sub(payload, session)


get_current_auth_user = UserGetterFromToken(ACCESS_TOKEN_TYPE)
get_current_auth_user_for_refresh = UserGetterFromToken(REFRESH_TOKEN_TYPE)


async def get_current_active_auth_user(
    user: UserSchema = Depends(get_current_auth_user),
) -> UserSchema:
    if user.active:
        return user
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Неактивный пользователь",
    )


async def validate_auth_user_form(
    username: str = Form(),
    password: str = Form(),
    session: AsyncSession = Depends(db_manager.session_dependency),
) -> UserSchema:
    return await validate_auth_user(
        username=username, password=password, session=session
    )


async def validate_auth_user_body(
    login_user: LoginUser,
    session: AsyncSession = Depends(db_manager.session_dependency),
) -> UserSchema:
    return await validate_auth_user(
        username=login_user.username, password=login_user.password, session=session
    )


async def validate_auth_user(
    username: str, password: str, session: AsyncSession
) -> UserSchema:
    unauthed_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Неверный логин или пароль",
    )

    try:
        user = await service.get_user_by_username(session=session, username=username)
    except HTTPException:
        raise unauthed_exc

    if not utils.validate_password(
        password=password, hashed_password=user.hashed_password
    ):
        raise unauthed_exc

    if not user.active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Пользователь не активен",
        )

    return user


async def register_user(
    user_create: UserCreate,
    session: AsyncSession = Depends(db_manager.session_dependency),
) -> LinkTelegramBot | User:
    try:
        user = await get_user_by_username(
            session=session, username=user_create.username
        )
    except HTTPException:
        user = None

    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Имя '{user.username}' уже занято",
        )

    if not user_create.telegram_2fa:
        user = await create_user(session=session, user=user_create)
        return user

    unique_token = str(uuid.uuid4())
    data = {
        "username": user_create.username,
        "hashed_password": hash_password(user_create.password).decode("utf-8"),
        "status": "",
    }
    await redis_client.set(
        f"tg_register_confirm:{unique_token}",
        json.dumps(data),
        ex=auth_settings.tg_confirm_expire_seconds,
    )
    url = settings.bot_url + f"?start={unique_token}"
    link_telegram_bot = LinkTelegramBot(
        url=url,
        expire_seconds=auth_settings.tg_confirm_expire_seconds,
        unique_token=unique_token,
    )
    return link_telegram_bot


async def auth_by_api_key(api_key: str = Depends(oauth2_scheme)):
    if api_key != settings.scan_service_api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Неверный ключ",
        )

