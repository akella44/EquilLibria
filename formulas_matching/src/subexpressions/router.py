from ..database import db_manager
from .service import create_decomposition_of_expression

from fastapi import APIRouter
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.params import Depends

router = APIRouter(
    tags=["Decompose"],
    prefix="/decomposition",
)


@router.post(path="/", summary="Decompose latex expression into subexpressions")
async def decompose_expression(
    expression_id: int,
    session: AsyncSession = Depends(db_manager.session_dependency),
):
    return await create_decomposition_of_expression(
        session=session, formula_id=expression_id
    )
