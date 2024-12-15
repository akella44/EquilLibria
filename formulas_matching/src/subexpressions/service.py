import logging
from fastapi import HTTPException
from starlette import status
from sqlalchemy import select, Result, or_, func, delete, insert
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from .models import Formula, Subexpression
from ..core.latex_to_ast_converter import get_latex_subexpressions
from sympy.parsing.latex.errors import LaTeXParsingError


async def get_expression_by_id(session: AsyncSession, expression_id: int) -> Formula:
    expression: Formula = await session.get(Formula, expression_id)
    if not expression:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Математическое выражение с ID ({expression_id}) не найдено",
        )
    return expression


async def create_decomposition_of_expression(
    session: AsyncSession, formula_id: int
) -> None:
    formula: Formula = await get_expression_by_id(formula_id)
    try:
        subexpressions = get_latex_subexpressions(formula.content)
    except LaTeXParsingError as le:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ошибка обработки LaTex выражения ({le})",
        )
    for subexpression in subexpressions:
        subexpression_entity = Subexpression(latex=subexpression, formula_id=formula_id)
        session.add(subexpression_entity)
    await session.commit()
