from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from . import service
from .models import User
from ..database import db_manager


async def user_by_id_dependency(
    user_id: int, session: AsyncSession = Depends(db_manager.session_dependency)
) -> User:
    return await service.get_user_by_id(session=session, user_id=user_id)
