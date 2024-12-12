from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer
from starlette import status

from .jwtcreators import (
    create_access_token,
    create_refresh_token,
)
from .dependencies import (
    get_current_auth_user_for_refresh,
    validate_auth_user_form,
    register_user,
)
from .service import login, verify_code
from ..config import DEV
from ..users import User
from ..users.schemas import User as UserSchema
from .schemas import TokenInfo, LinkTelegramBot, LoginFirstStepMessageResponse

http_bearer = HTTPBearer(auto_error=False)


router = APIRouter(
    prefix="/jwt",
    tags=["JWT"],
)


if DEV:

    @router.post(
        "/login-swagger/",
        response_model=TokenInfo,
        summary="User login",
        deprecated=True,
    )
    async def login_swagger(
        user: UserSchema = Depends(validate_auth_user_form),
    ):
        """
        Authenticates a user and returns access and refresh token.

        - **username**: User's login/username (required, 6-12 chars, pattern="^[a-z0-9]+$")
        - **password**: User's password (required, 8-16 chars, pattern="^[A-Za-z0-9]+$")
        """
        access_token = await create_access_token(user)
        refresh_token = await create_refresh_token(user)
        return TokenInfo(
            access_token=access_token,
            refresh_token=refresh_token,
        )


@router.post(
    "/register/",
    responses={202: {"model": LinkTelegramBot}, 200: {"model": UserSchema}},
    summary="User register",
)
async def register(response: LinkTelegramBot | User = Depends(register_user)):
    """
    Registers a user.

    - **username**: User's login/username (required, 6-12 chars, pattern="^[a-z0-9]+$")
    - **password**: User's password (required, 8-16 chars, pattern="^[A-Za-z0-9]+$")
    """
    if type(response) == User:
        response = UserSchema(
            id=response.id,
            username=response.username,
            tg_username=response.tg_username,
            created_at=response.created_at,
            admin=response.admin,
            active=response.active,
            photo_id=response.photo_id,
        )
    return response


@router.post(
    "/login/",
    responses={
        202: {"model": LoginFirstStepMessageResponse},
        200: {"model": TokenInfo},
    },
    summary="2FA login 1st step",
)
async def login_1_step(response: LoginFirstStepMessageResponse | User = Depends(login)):
    """
    Logins a user (if there isn`t 2fa) and returns JWT.
    Or starts first step of authentication (if there is 2fa)/

    - **username**: User's login/username (required, 6-12 chars, pattern="^[a-z0-9]+$")
    - **password**: User's password (required, 8-16 chars, pattern="^[A-Za-z0-9]+$")
    """
    if type(response) == User:
        access_token = await create_access_token(response)
        refresh_token = await create_refresh_token(response)
        return TokenInfo(
            access_token=access_token,
            refresh_token=refresh_token,
        )
    return response


@router.post("/login-2-step/", response_model=TokenInfo, summary="2FA login 2nd step")
async def login_2_step(user: UserSchema = Depends(verify_code)):
    """
    Authenticates a user and returns access and refresh token.

    - **username**: User's login/username (required, 6-12 chars, pattern="^[a-z0-9]+$")
    - **code**: User's code from telegram (required, 6 digits)
    """
    access_token = await create_access_token(user)
    refresh_token = await create_refresh_token(user)
    return TokenInfo(
        access_token=access_token,
        refresh_token=refresh_token,
    )


@router.post(
    "/refresh/",
    response_model=TokenInfo,
    response_model_exclude_none=True,
    dependencies=[Depends(http_bearer)],
    summary="Refresh JWT token",
)
async def auth_refresh_jwt(
    user: UserSchema = Depends(get_current_auth_user_for_refresh),
):
    """
    Refreshes an access token by refresh token.

    - **refresh_token**: Header bearer refresh token (required)
    """
    if not user.active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Неактивный пользователь",
        )
    access_token = await create_access_token(user)
    return TokenInfo(
        access_token=access_token,
    )
