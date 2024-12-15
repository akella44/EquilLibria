from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    db_user: str
    db_pass: str
    db_host: str
    db_port: str
    db_name: str
    db_echo: bool
    model_path: str

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
