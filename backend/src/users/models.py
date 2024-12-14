import random
from typing import List

from sqlalchemy import DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

from ..database import Base


class User(Base):
    __tablename__ = "users"

    username: Mapped[str] = mapped_column(unique=True)
    tg_username: Mapped[str | None] = mapped_column(unique=True, nullable=True)
    hashed_password: Mapped[bytes]
    photo_id: Mapped[int] = mapped_column(
        default=lambda: random.randint(1, 5), nullable=False
    )
    admin: Mapped[bool] = mapped_column(default=False)
    active: Mapped[bool] = mapped_column(default=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow
    )

    formulas: Mapped[list["Formula"]] = relationship(back_populates="user")
    images: Mapped[list["Image"]] = relationship(back_populates="user")
