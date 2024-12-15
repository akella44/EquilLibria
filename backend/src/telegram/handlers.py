from aiogram import Dispatcher, Router, F
from aiogram.filters import Command, CommandStart, CommandObject
from aiogram.fsm.context import FSMContext
from aiogram.types import (
    Message,
    CallbackQuery,
    InlineKeyboardMarkup,
)

from ..database import redis_client

from .keyboards import menu_inline_keyboard, menu_reply_keyboard
from .utils import (
    get_user_from_system,
    edit_message,
    create_user_by_unique_token,
)
from ..users.exceptions import UserExistsError

router = Router()


@router.message(CommandStart())
async def cmd_start(message: Message, command: CommandObject):
    arg = command.args
    try:
        user = await create_user_by_unique_token(
            token=arg, tg_username="@" + message.from_user.username
        )
    except ValueError:
        await message.answer(
            f"Запрос на регистрацию не найден! Зарегистрируйтесь на сайте и перейдите по ссылке, нажав кнопку 'start'"
        )
        return
    except UserExistsError:
        await message.answer(f"Вы уже зарегистрированы на платформе!")
        return
    if not user:
        return
    await redis_client.set(f"telegram_chat_id:{user.username}", message.chat.id)
    await message.answer(
        f"Добро пожаловать! Ваш аккаунт привязан к платформе. Теперь вы можете получать 2FA коды.",
        reply_markup=menu_reply_keyboard,
    )


@router.message(Command("menu"))
async def cmd_menu(message: Message, state: FSMContext):
    await state.clear()
    await menu(event=message)


@router.callback_query(F.data == "menu")
@edit_message
async def menu_callback(
    callback: CallbackQuery, state: FSMContext
) -> tuple[str, InlineKeyboardMarkup]:
    await state.clear()
    return await menu(event=callback)


@router.message(F.text == "📋 Меню")
async def menu_message(message: Message, state: FSMContext):
    await state.clear()
    await menu(event=message)


async def menu(event) -> None | tuple[str, InlineKeyboardMarkup]:
    user = await get_user_from_system(event=event)
    message = "➖<b><a href='http://localhost:5173/'>Equilibria</a></b>➖"
    message += "\n<b>Удобная и надежная платформа</b>"
    if user:
        message += "\n\nℹ️ <b>Личный кабинет</b>"
        message += f"\nИмя: <u>{user.username}</u>"
        message += "\nАдмин: " + get_permission_emoji(user.admin)

    if isinstance(event, CallbackQuery):
        return message, menu_inline_keyboard
    elif isinstance(event, Message):
        await event.answer(message, reply_markup=menu_inline_keyboard)


def get_permission_emoji(permission: bool):
    return "▫️" if permission else "▪️"


def register_handlers(dp: Dispatcher):
    dp.include_router(router)
