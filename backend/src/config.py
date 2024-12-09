from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import BaseModel
from pathlib import Path
from logging.config import dictConfig


BASE_DIR = Path(__file__).parent.parent

DEV = True  # TODO: изменить

TOKEN_TYPE_FIELD = "type"
ACCESS_TOKEN_TYPE = "access"
REFRESH_TOKEN_TYPE = "refresh"

origins = [
    "http://equillibria.ru",
    "https://equillibria.ru",
]
if DEV:
    origins.extend(
        [
            "http://localhost:5173",
            "https://localhost:5173",
        ]
    )


class Settings(BaseSettings):
    db_user: str
    db_pass: str
    db_host: str
    db_port: str
    db_name: str
    db_echo: bool
    bot_token: str
    bot_url: str
    redis_host: str
    redis_port: int

    model_config = SettingsConfigDict(env_file=".env")


class AuthSettings(BaseModel):
    algorithm: str = "RS256"
    private_key_path: Path = BASE_DIR / "certs" / "jwt-private.pem"
    public_key_path: Path = BASE_DIR / "certs" / "jwt-public.pem"
    access_token_expire_minutes: int = 1  # TODO: изменить
    refresh_token_expire_days: int = 1
    tg_bot_code_expire_seconds: int = 120
    tg_bot_code_max_attempts: int = 3
    tg_confirm_expire_seconds: int = 60 * 5


settings = Settings()
auth_settings = AuthSettings()

LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        },
        "detailed": {
            "format": "%(asctime)s - %(name)s - %(levelname)s - %(module)s - %(funcName)s - %(message)s",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "default",
        },
        "file": {
            "class": "logging.FileHandler",
            "formatter": "detailed",
            "filename": "app.log",  # Логи будут записываться в файл app.log
        },
    },
    "root": {
        "handlers": ["console", "file"],
        "level": "INFO",
    },
    "loggers": {
        "uvicorn": {
            "handlers": ["console", "file"],
            "level": "INFO",
            "propagate": False,
        },
        "app": {
            "handlers": ["console", "file"],
            "level": "DEBUG",
            "propagate": False,
        },
    },
}


def setup_logging():
    dictConfig(LOGGING_CONFIG)
