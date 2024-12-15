from typing import List

from fastapi import APIRouter, Body
from fastapi.params import Depends
from fastapi.security import HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import db_manager
from . import service
from ..auth.dependencies import get_current_active_auth_user
from .schemas import Formula, FormulaCreate, FormulaUpdatePartial, FormulasList, FormulaStaticAnalysed, \
    FormulaSemanticAnalysed
from ..users import User

http_bearer = HTTPBearer(auto_error=False)
router = APIRouter(
    tags=["Formulas"],
    prefix="/formulas",
    dependencies=[
        Depends(http_bearer),
    ],
)


@router.get(
    path="/me/",
    response_model=FormulasList,
    summary="Get formulas for current user",
)
async def get_formulas_by_user(
    session: AsyncSession = Depends(db_manager.session_dependency),
    user: User = Depends(get_current_active_auth_user),
    page_size: int = 1000,
    page_number: int = 1,
    search: str | None = None,
):
    """
    Gets assets list for current authenticated user

    - **access_token**: Header bearer access token (required)

    - **page_size**: Limit of formulas (default=1000)
    - **page_number**: Offset page number (default=1)
    - **search**: String for searching by name (optional)
    """
    return await service.get_formulas_by_user(
        session=session,
        user=user,
        page_size=page_size,
        page_number=page_number,
        search=search,
    )


@router.get(
    path="/{formula_id}/",
    response_model=Formula,
    summary="Get formula by id",
    dependencies=(Depends(get_current_active_auth_user),),
)
async def get_formula_by_id(
    formula_id: int,
    session: AsyncSession = Depends(db_manager.session_dependency),
):
    """
    Gets asset by id

    - **access_token**: Header bearer access token (required)

    - **formula_id**: Formula id (required)
    """
    return await service.get_formula_by_id(session=session, formula_id=formula_id)


@router.post(
    path="/",
    response_model=Formula,
    summary="Create formula for current user",
)
async def create_formula(
    formula_create: FormulaCreate,
    session: AsyncSession = Depends(db_manager.session_dependency),
    user: User = Depends(get_current_active_auth_user),
):
    """
    Creates a formula for current authenticated user.

    - **access_token**: Header bearer access token (required)

    - **name**: Name of the formula (required)
    - **content**: Formula content (required)
    - **legends**: List of formula legends (list of strings)
    - **description**: Description (optional)
    """
    return await service.create_formula(
        session=session, user=user, formula_create=formula_create
    )


@router.patch(
    path="/{formula_id}/",
    response_model=Formula,
    summary="Update partial formula for current user",
)
async def update_formula(
    formula_id: int,
    formula_update: FormulaUpdatePartial,
    session: AsyncSession = Depends(db_manager.session_dependency),
    user: User = Depends(get_current_active_auth_user),
):
    """
    Updates a formula for current authenticated user

    - **access_token**: Header bearer access token (required)

    - **name**: Name of the formula (optional)
    - **content**: Formula content (optional)
    - **legends**: List of formula legends (list of strings, optional)
    - **description**: Description (optional)
    """
    formula = await service.get_formula_by_id(session=session, formula_id=formula_id)
    return await service.update_formula(
        session=session, formula_update=formula_update, formula=formula, user=user
    )


@router.delete(
    path="/{formula_id}/",
    response_model=Formula,
    summary="Delete formula for current user",
)
async def delete_formula(
    formula_id: int,
    session: AsyncSession = Depends(db_manager.session_dependency),
    user: User = Depends(get_current_active_auth_user),
):
    """
    Deletes a formula for current authenticated user

    - **access_token**: Header bearer access token (required)
    """
    formula = await service.get_formula_by_id(session=session, formula_id=formula_id)
    return await service.delete_formula(session=session, formula=formula, user=user)


@router.post(
    path="/static-analyze/",
    response_model=List[FormulaStaticAnalysed],
    summary="Get static similar formulas by latex",
)
async def static_analyze_formula(
    latex: str = Body(...),
    _: User = Depends(get_current_active_auth_user),
):
    return await service.static_analyze_formula(latex=latex)


@router.post(
    path="/semantic-analyze/",
    response_model=List[FormulaSemanticAnalysed],
    summary="Get semantic similar formulas by latex",
)
async def semantic_analyze_formula(
    latex: str = Body(...),
    _: User = Depends(get_current_active_auth_user),
):
    return await service.semantic_analyze_formula(latex=latex)
