from typing import List
from fastapi import HTTPException
from sqlalchemy import select, Result, or_, func, delete, insert
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from .schemas import FormulaStaticAnalysed
from .models import Formula, Subexpression
from starlette import status
from sqlalchemy.orm import selectinload
from ..core.latex_to_ast_converter import get_latex_subexpressions


async def get_all_static_matches(
    session: AsyncSession, subexpressions: List[str]
) -> List[FormulaStaticAnalysed]:
    static_analyze_results: List[FormulaStaticAnalysed] = []
    for subexpression in subexpressions:
        # select(models.Image)
        # .where(models.Image.user_id == user.id)
        # .options(selectinload(models.Image.rects))
        matching_query = (
            select(Subexpression)
            .where(Subexpression.latex == subexpression)
            .options(selectinload(Subexpression.formula))
        )
        matching_result: Result = await session.execute(matching_query)
        matches: List[Subexpression] = list(matching_result.scalars().all())

        static_analyze_result = FormulaStaticAnalysed()

        for match in matches:
            formula: Formula = await get_formula_by_id(
                session=session, formula_id=match.formula_id
            )
            static_analyze_result.description = formula.description
            static_analyze_result.legends = formula.legends
            static_analyze_result.full_expression = formula.content


async def get_formula_by_id(session: AsyncSession, formula_id: int):
    formula = await session.get(Formula, formula_id)
    if not formula:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Математическое выражение с ID ({formula_id}) не найдено",
        )
    return formula
