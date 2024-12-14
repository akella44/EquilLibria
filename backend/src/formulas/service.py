from math import ceil
from typing import List

from fastapi import HTTPException
from sqlalchemy import select, Result
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from .models import Formula
from .schemas import FormulaCreate, FormulaUpdatePartial, FormulasList
from ..users import User


async def get_formula_by_id(session: AsyncSession, formula_id: int) -> Formula:
    formula = await session.get(Formula, formula_id)
    if not formula:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Формула с ID ({formula_id}) не найдена",
        )
    return formula


async def get_formulas_by_user(
    session: AsyncSession,
    user: User,
    page_size: int = 1000,
    page_number: int = 1,
    search: str | None = None,
) -> FormulasList:
    stmt = (
        select(Formula).filter(Formula.user_id == user.id).order_by(Formula.id.desc())
    )
    if search:
        search = f"%{search}%"
        stmt = stmt.where(Formula.name.like(search))
    result: Result = await session.execute(stmt)
    formulas = list(result.scalars().all())

    limit = page_size
    offset = (page_number - 1) * page_size
    response_formulas = formulas[offset : offset + limit]
    total_pages = ceil(len(formulas) / page_size)
    formulas_list = FormulasList(
        formulas=response_formulas, total_pages=total_pages, current_page=page_number
    )
    return formulas_list


async def create_formula(
    session: AsyncSession, user: User, formula_create: FormulaCreate
) -> Formula:
    formula = Formula(**formula_create.model_dump(), user_id=user.id)
    session.add(formula)
    await session.commit()
    await session.refresh(formula)
    return formula


async def update_formula(
    session: AsyncSession,
    formula: Formula,
    formula_update: FormulaUpdatePartial,
    user: User,
) -> Formula:
    if formula.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Нет доступа к формуле"
        )
    for name, value in formula_update.model_dump(exclude_unset=True).items():
        setattr(formula, name, value)
    await session.commit()
    return formula


async def delete_formula(
    session: AsyncSession, formula: Formula, user: User
) -> Formula:
    if formula.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Нет доступа к формуле"
        )
    await session.delete(formula)
    await session.commit()
    return formula


async def analyze_formula(formula_id: int,
    session: AsyncSession) -> List[...]:
    formula = await session.get(Formula, formula_id)
