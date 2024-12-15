from sqlalchemy import DateTime, ForeignKey, ARRAY, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

from ..database import Base


class Formula(Base):
    __tablename__ = "formulas"

    content: Mapped[str] = mapped_column(nullable=False)
    name: Mapped[str] = mapped_column(nullable=False)
    legends: Mapped[list[str]] = mapped_column(ARRAY(String))
    description: Mapped[str] = mapped_column(nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow
    )

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    user: Mapped["User"] = relationship(back_populates="formulas")

    subexpressions: Mapped[list["Subexpression"]] = relationship(
        back_populates="formula"
    )


class Subexpression(Base):
    __tablename__ = "subexpressions"

    latex: Mapped[str] = mapped_column(nullable=False, index=True)

    formula_id: Mapped[int] = mapped_column(ForeignKey("formulas.id"))
    formula: Mapped["Formula"] = relationship(back_populates="subexpressions")
