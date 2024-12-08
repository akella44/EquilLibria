from fastapi import APIRouter
from fastapi.params import Depends
from fastapi.security import HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import db_manager
from . import service
from ..auth.dependencies import get_current_active_auth_user
from .schemas import User, UserMeUpdatePartial

http_bearer = HTTPBearer(auto_error=False)
router = APIRouter(
    tags=["Users"],
    prefix="/users",
    dependencies=[
        Depends(http_bearer),
    ],
)


@router.get(
    path="/me/",
    response_model=User,
    description="Get current auth user",
)
async def get_current_auth_user(user: User = Depends(get_current_active_auth_user)):
    return user


@router.patch(
    path="/me/",
    response_model=User,
    description="Update current auth user",
)
async def update_current_auth_user(
    user_update: UserMeUpdatePartial,
    user: User = Depends(get_current_active_auth_user),
    session: AsyncSession = Depends(db_manager.session_dependency),
):
    return await service.update_user(
        session=session,
        user_update=user_update,
        user=user,
    )
