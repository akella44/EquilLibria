from ..database import db_manager
from .schemas import Matches

from fastapi import APIRouter, HTTPException, BackgroundTasks, Body
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.params import Depends

router = APIRouter(
    tags=["Expressions"],
    prefix="/matches",
)


@router.post(
    path="/semantic/",
    response_model=Matches,
    summary="Find semantic matching for math expression",
)
async def find_matches(
    background_tasks: BackgroundTasks,
    session: AsyncSession = Depends(db_manager.session_dependency),
    latex: str = Body(...),
):
    pass


@router.post(
    path="/static/",
    response_model=Matches,
    summary="Find static matching for math expression",
)
async def find_matches(
    background_tasks: BackgroundTasks,
    session: AsyncSession = Depends(db_manager.session_dependency),
    latex: str = Body(...),
):
    pass


@router.post(
    path="/",
    response_model=Matches,
    summary="Find matching for math expression with all availabe methods",
)
async def find_matches(
    background_tasks: BackgroundTasks,
    session: AsyncSession = Depends(db_manager.session_dependency),
    latex: str = Body(...),
):
    pass
