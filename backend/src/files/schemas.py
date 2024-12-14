from datetime import datetime
from typing import List

from pydantic import BaseModel, ConfigDict


class UploadImagesResponse(BaseModel):
    image_ids: List[int]


class RectBase(BaseModel):
    x1: int
    y1: int
    x2: int
    y2: int


class RectCreate(RectBase):
    pass


class Rect(RectBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


class Image(BaseModel):
    id: int
    path: str
    url: str
    created_at: datetime
    rects: List[Rect]
    model_config = ConfigDict(from_attributes=True)


class ImagesList(BaseModel):
    images: list[Image]
    total_pages: int
    current_page: int


class Latex(BaseModel):
    latex: str
