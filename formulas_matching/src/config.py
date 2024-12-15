from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import BaseModel


class Settings(BaseSettings):
    db_user: str
    db_pass: str
    db_host: str
    db_port: str
    db_name: str
    db_echo: bool
    redis_host: str
    redis_port: int
    dev: bool
    host_address: str

    model_config = SettingsConfigDict(env_file=".env")


class AuthSettings(BaseModel):
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7
    tg_bot_code_expire_seconds: int = 120
    tg_bot_code_max_attempts: int = 3
    tg_confirm_expire_seconds: int = 60 * 5


settings = Settings()
auth_settings = AuthSettings()

DEV = settings.dev

origins = [f"http://{settings.host_address}:5173"]
if DEV:
    origins.extend(
        [
            "http://localhost:5173",
        ]
    )
