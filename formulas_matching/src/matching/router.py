from ..database import db_manager
from .schemas import FormulaSemanticAnalysed, FormulaStaticAnalysed
from .service import get_all_static_matches, get_all_semantic_matches

from fastapi import APIRouter, Body, Request
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.params import Depends
from typing import List

from ..core.equil_libria_bert import EquilLibriaBert

router = APIRouter(
    tags=["Expressions"],
    prefix="/matches",
)


@router.post(
    path="/semantic/",
    response_model=List[FormulaSemanticAnalysed],
    summary="Find semantic matching for math expression",
)
async def find_semantic_matches(
    request: Request,
    session: AsyncSession = Depends(db_manager.session_dependency),
    latex: str = Body(...),
):
    model: EquilLibriaBert = request.app.state.model_instance
    return await get_all_semantic_matches(session=session, latex=latex, model=model)


@router.post(
    path="/static/",
    response_model=List[FormulaStaticAnalysed],
    summary="Find static matching for math expression",
)
async def find_static_matches(
    session: AsyncSession = Depends(db_manager.session_dependency),
    latex: str = Body(...),
):
    return await get_all_static_matches(session=session, latex=latex)
