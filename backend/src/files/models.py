from typing import List

from sqlalchemy import DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

from ..database import Base


class Image(Base):
    __tablename__ = "images"

    path: Mapped[str] = mapped_column(nullable=False)
    url: Mapped[str] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow
    )

    rects: Mapped[List["Rect"]] = relationship(back_populates="image")

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    user: Mapped["User"] = relationship(back_populates="images")


class Rect(Base):
    __tablename__ = "rects"

    x1: Mapped[int] = mapped_column(nullable=False)
    y1: Mapped[int] = mapped_column(nullable=False)
    x2: Mapped[int] = mapped_column(nullable=False)
    y2: Mapped[int] = mapped_column(nullable=False)

    image_id: Mapped[int] = mapped_column(ForeignKey("images.id"))
    image: Mapped["Image"] = relationship(back_populates="rects")
