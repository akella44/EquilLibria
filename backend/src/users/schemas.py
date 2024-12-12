from datetime import datetime

from pydantic import BaseModel, EmailStr, ConfigDict, Field


class UserBase(BaseModel):
    pass


class UserCreate(UserBase):
    username: str = Field(
        ...,
        min_length=6,
        max_length=12,
        pattern="^[a-z0-9]+$",
    )
    password: str = Field(
        ...,
        min_length=8,
        max_length=16,
        pattern="^[A-Za-z0-9]+$",
    )
    telegram_2fa: bool = False


class UserCreateUsernameHashedPassword(UserBase):
    username: str = Field(
        ...,
        min_length=6,
        max_length=12,
        pattern="^[a-z0-9]+$",
    )
    tg_username: str = Field(default="@example")
    hashed_password: bytes


class UserMeUpdatePartial(BaseModel):
    password: str | None = Field(
        default=None,
        min_length=8,
        max_length=16,
        pattern="^[A-Za-z0-9]+$",
    )


class LoginUser(BaseModel):
    username: str = Field(
        ...,
        min_length=6,
        max_length=12,
        pattern="^[a-z0-9]+$",
    )
    password: str = Field(
        ...,
        min_length=8,
        max_length=16,
        pattern="^[A-Za-z0-9]+$",
    )


class VerifyCodeUser(BaseModel):
    username: str = Field(
        ...,
        min_length=6,
        max_length=12,
        pattern="^[a-z0-9]+$",
    )
    code: str = Field(
        ...,
        min_length=6,
        max_length=6,
        pattern="^[0-9]+$",
    )


class User(UserBase):
    id: int
    username: str
    tg_username: str | None
    photo_id: int
    created_at: datetime
    admin: bool
    active: bool
    model_config = ConfigDict(from_attributes=True)
