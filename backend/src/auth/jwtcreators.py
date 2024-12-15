from datetime import datetime, timedelta

from .utils import encode_jwt
from ..users.schemas import User
from ..config import (
    auth_settings,
    TOKEN_TYPE_FIELD,
    ACCESS_TOKEN_TYPE,
    REFRESH_TOKEN_TYPE,
)


async def create_jwt(
    token_type: str,
    token_data: dict,
    expire_minutes: int = auth_settings.access_token_expire_minutes,
    expire_timedelta: timedelta | None = None,
) -> str:
    jwt_payload = {TOKEN_TYPE_FIELD: token_type}
    jwt_payload.update(token_data)
    return await encode_jwt(
        payload=jwt_payload,
        expire_minutes=expire_minutes,
        expire_timedelta=expire_timedelta,
    )


async def create_access_token(user: User) -> str:
    jwt_payload = {
        "sub": user.id,
        "username": user.username,
        "active": user.active,
    }
    return await create_jwt(
        token_type=ACCESS_TOKEN_TYPE,
        token_data=jwt_payload,
        expire_minutes=auth_settings.access_token_expire_minutes,
    )


async def create_refresh_token(user: User) -> str:
    jwt_payload = {
        "sub": user.id,
    }
    return await create_jwt(
        token_type=REFRESH_TOKEN_TYPE,
        token_data=jwt_payload,
        expire_timedelta=timedelta(days=auth_settings.refresh_token_expire_days),
    )
