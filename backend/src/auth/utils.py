import uuid
import jwt
from datetime import datetime, timedelta
import aiofiles

from ..config import auth_settings


async def encode_jwt(
    payload: dict,
    private_key_path: str = auth_settings.private_key_path,
    algorithm: str = auth_settings.algorithm,
    expire_minutes: int = auth_settings.access_token_expire_minutes,
    expire_timedelta: timedelta | None = None,
) -> str:
    # Читаем приватный ключ асинхронно
    async with aiofiles.open(private_key_path, mode="r") as file:
        private_key = await file.read()

    to_encode = payload.copy()
    now = datetime.utcnow()

    # Устанавливаем время истечения
    if expire_timedelta:
        expire = now + expire_timedelta
    else:
        expire = now + timedelta(minutes=expire_minutes)

    # Обновляем payload
    to_encode.update(
        exp=expire,
        iat=now,
        jti=str(uuid.uuid4()),
    )

    # Кодируем JWT с помощью приватного ключа
    encoded = jwt.encode(
        to_encode,
        private_key,
        algorithm=algorithm,
    )

    return encoded


async def decode_jwt(
    token: str | bytes,
    public_key_path: str = auth_settings.public_key_path,
    algorithm: str = auth_settings.algorithm,
) -> dict:
    # Читаем публичный ключ асинхронно
    async with aiofiles.open(public_key_path, mode="r") as file:
        public_key = await file.read()

    # Декодируем JWT с помощью публичного ключа
    decoded = jwt.decode(
        token,
        public_key,
        algorithms=[algorithm],
    )

    return decoded
