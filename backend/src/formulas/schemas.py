from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class FormulaBase(BaseModel):
    content: str
    name: str
    legends: list[str] = []
    description: str | None


class FormulaCreate(FormulaBase):
    pass


class FormulaUpdatePartial(FormulaBase):
    content: str | None = None
    name: str | None = None
    legends: list[str] | None = None
    description: str | None = None


class Formula(FormulaBase):
    id: int
    user_id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class FormulasList(BaseModel):
    formulas: list[Formula]
    total_pages: int
    current_page: int
