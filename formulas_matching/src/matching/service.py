from typing import List
from fastapi import HTTPException
from sqlalchemy import select, Result
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from .schemas import FormulaStaticAnalysed, FormulaSemanticAnalysed
from .models import Subexpression
from starlette import status
from sqlalchemy.orm import selectinload
from sympy.parsing.latex.errors import LaTeXParsingError
from ..core.latex_to_ast_converter import get_latex_subexpressions
from ..core.equil_libria_bert import EquilLibriaBert
import asyncio


async def get_all_static_matches(
    session: AsyncSession, latex: str
) -> List[FormulaStaticAnalysed]:
    static_analyze_results: List[FormulaStaticAnalysed] = []
    formulas_dict = {}
    try:
        subexpressions = get_latex_subexpressions(formula.content)
    except LaTeXParsingError as le:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ошибка обработки LaTex выражения ({le})",
        )
    for sub in subexpressions:
        matching_query = (
            select(Subexpression)
            .where(Subexpression.latex == sub)
            .where(Subexpression.latex == sub)
            .options(selectinload(Subexpression.formula))
        )
        result: Result = await session.execute(matching_query)
        subexpressions_models: List[Subexpression] = list(result.scalars().all())
        result: Result = await session.execute(matching_query)
        subexpressions_models: List[Subexpression] = list(result.scalars().all())

        for subexpressions_model in subexpressions_models:
            if not subexpressions_model.id in formulas_dict:
                formulas_dict[subexpressions_model.id] = {
                    "formula": subexpressions_model.formula,
                    "subs": [sub],
                }
            formulas_dict[subexpressions_model.id]["subs"].append(sub)

    for _, dct in formulas_dict.items():
        formula = dct["formula"]
        subs = dct["subs"]
        legends = formula.legends
        description = formula.description
        latex = formula.content
        static_analyze_results.append(
            FormulaStaticAnalysed(
                legends=legends,
                description=description,
                found_latex=latex,
                subexpressions=subs,
            )
        )

    return sorted(
        static_analyze_results,
        key=lambda x: max((len(s) for s in x.subexpressions), default=0),
        reverse=True
    )[:20]


async def get_all_semantic_matches(
    session: AsyncSession, latex: str, model: EquilLibriaBert
) -> List[FormulaSemanticAnalysed]:
    semantic_analyze_results: List[FormulaSemanticAnalysed] = []
    formulas_query = select(Subexpression).options(selectinload(Subexpression.formula))
    query_result: Result = await session.execute(formulas_query)
    subexpressions_models: List[Subexpression] = list(query_result.scalars().all())
    for subexpressions_model in subexpressions_models:
        coefficient_similarity: float = await asyncio.create_task(
            model.predict_similarity(latex, subexpressions_model.latex)
        )
        if coefficient_similarity > 0.9:
            semantic_analyze_results.append(
                FormulaSemanticAnalysed(
                    subexpressions_model.formula.legends,
                    subexpressions_model.formula.description,
                    subexpressions_model.formula.content,
                    int(coefficient_similarity * 100),
                )
            )
    return sorted(semantic_analyze_results, key=lambda x: x.percentage, reverse=True)[:20]
