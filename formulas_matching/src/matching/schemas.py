from pydantic import BaseModel
from typing import List


# class Match(BaseModel):
#     full_expression: str
#     parts: List[str]


# class Matches(BaseModel):
#     source_expression: str
#     matching_rate: float
#     matched: List[Match]


class FormulaSemanticAnalysed(BaseModel):
    legends: list[str]
    description: str
    found_latex: str
    percentage: int

class FormulaStaticAnalysed(BaseModel):
    legends: list[str]
    description: str
    found_latex: str
    subexpressions: list[str]
