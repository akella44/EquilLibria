from fastapi import FastAPI, Request, APIRouter

from .matching.router import router as matching_router
from .subexpressions.router import router as subexpressions_router

import logging
import asyncio

app = FastAPI(
    title="Formula matches service",
    description="API for getting formula matches",
    version="1.0",
)

main_router = APIRouter(prefix="/api")

main_router.include_router(matching_router)
main_router.include_router(subexpressions_router)

logger = logging.getLogger("app")
