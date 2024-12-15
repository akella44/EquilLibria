from fastapi import FastAPI, APIRouter
from contextlib import asynccontextmanager

from .matching.router import router as matching_router
from .subexpressions.router import router as subexpressions_router

from .core.equil_libria_bert import EquilLibriaBert
from .database import Base

import logging


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.model_instance = EquilLibriaBert()
    try:
        yield
    finally:
        app.state.executor.shutdown(wait=True)
        del app.state.model_instance


app = FastAPI(
    title="Formula matches service",
    description="API for getting formula matches",
    version="1.0",
    lifespan=lifespan,
)

main_router = APIRouter(prefix="/api")

main_router.include_router(matching_router)
main_router.include_router(subexpressions_router)

logger = logging.getLogger("app")
