import torch
import numpy as np
from PIL import Image
from model.model import model
from pydantic import BaseModel
from fastapi.encoders import jsonable_encoder
import aiohttp
from io import BytesIO

BACKEND_URL = 'http://backend:8000/api/files/images/{:s}/rects/'

class Rect(BaseModel):
    x1: int
    y1: int
    x2: int
    y2: int

def convert_to_rect(coordinates: list) -> list[Rect]:
    rects = []
    for coordinate in coordinates:
        x1 = int(coordinate[0])
        y1 = int(coordinate[1])
        x2 = int(coordinate[2])
        y2 = int(coordinate[3])
        rect = Rect(x1=x1, y1=y1, x2=x2, y2=y2)
        rects.append(rect)
    return rects

async def recognition(jpg_bytes: bytes, id: str) -> list[list[int]]:
    with Image.open(BytesIO(jpg_bytes)) as img:
        img.save(f"./local_storage/1.jpg")

    coordinates = []
    try:
        with torch.no_grad():
            predictions = model.predict(
                source=f"./local_storage/1.jpg",
                conf=0.75,
                iou=0.75,
                stream=True,
            )
        boxes = next(predictions).boxes.xyxy.cpu().numpy()
        adjusted_boxes = boxes + np.array([-10, -5, 0, 10])
        coordinates.append(adjusted_boxes.tolist())
    except Exception as e:
        raise RuntimeError(f"Error during recognition: {e}")
    print(coordinates)
    
    rects = convert_to_rect(coordinates[0])
    json_result = jsonable_encoder(rects)

    async with aiohttp.ClientSession() as session:
        async with session.post(BACKEND_URL.format(id), json=json_result) as response:
            if response.status != 200:
                print(f"Invalid {response.status}")
    return coordinates
