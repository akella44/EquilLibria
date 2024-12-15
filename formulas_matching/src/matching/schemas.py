from pydantic import BaseModel
from typing import List


class FormulaSemanticAnalysed(BaseModel):
    legends: List[str]
    description: str
    found_latex: str
    percentage: int


class FormulaStaticAnalysed(BaseModel):
    legends: List[str]
    description: str
    found_latex: str
    subexpressions: list[str]
