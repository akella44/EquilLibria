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
    formulas_dict = {}
    for sub in subexpressions:
        matching_query = (
            select(Subexpression)
            .where(Subexpression.latex == sub)
            .options(selectinload(Subexpression.formula))
        )
        result: Result = await session.execute(matching_query)
        subexpressions_models: List[Subexpression] = list(result.scalars().all())

        for subexpressions_model in subexpressions_models:
            if not subexpressions_model.id in formulas_dict:
                formulas_dict[subexpressions_model.id] = {"formula": subexpressions_model.formula, "subs": [sub]}
            formulas_dict[subexpressions_model.id]["subs"].append(sub)

    for _, dct in formulas_dict.items():
        formula = dct["formula"]
        subs = dct["subs"]
        legends = formula.legends
        description = formula.description
        latex = formula.content
        static_analyze_results.append(FormulaStaticAnalysed(
            legends=legends,
            description=description,
            found_latex=latex,
            subexpressions=subs,
        ))

    return static_analyze_results


async def get_formula_by_id(session: AsyncSession, formula_id: int):
    formula = await session.get(Formula, formula_id)
    if not formula:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Математическое выражение с ID ({formula_id}) не найдено",
        )
    return formula
