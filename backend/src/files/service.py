import asyncio
import io
import os
import uuid
from math import ceil
from typing import List, Tuple
from pathlib import Path
import fitz  # PyMuPDF

from fastapi import UploadFile, HTTPException, status
from PIL import Image
import aiofiles
import aiohttp
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.files.schemas import ImagesList, Image as ImageSchema, RectCreate
from src.users import User
from src.files import models
from src.config import settings, STATIC_DIR


AI_RECOGNIZE_URL = settings.ai_recognize_url


async def upload_file(
    file: UploadFile, session: AsyncSession, user: User
) -> Tuple[List[str], List[Path], List[int]]:
    """
    Обрабатывает загрузку файла: валидирует, конвертирует и сохраняет на AI сервис.
    """
    image_uuids = []
    converted_files = []
    image_ids = []

    # Шаг 1: Валидация файла
    await validate_file(file)

    # Шаг 2: Конвертация и сохранение файла(ов)
    converted_files_paths, uuids = await convert_and_save(file)
    image_uuids.extend(uuids)
    converted_files.extend(converted_files_paths)

    for i, file_path in enumerate(converted_files_paths):
        image_uuid = image_uuids[i]
        url = f"http://{settings.host_address}:8000/static/{image_uuid}.jpg"
        image = models.Image(path=str(file_path), user_id=user.id, url=url)
        session.add(image)
        await session.commit()
        await session.refresh(image)
        image_ids.append(image.id)

    return image_uuids, converted_files, image_ids


async def validate_file(file: UploadFile):
    allowed_content_types = ["image/png", "image/jpeg", "application/pdf"]
    if file.content_type not in allowed_content_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Недопустимый тип файла: {file.content_type}",
        )


async def convert_and_save(file: UploadFile) -> Tuple[List[Path], List[str]]:
    converted_files = []
    uuids = []

    file_extension = Path(file.filename).suffix.lower()

    content = await file.read()

    if file_extension == ".png":
        # Конвертация PNG в JPG
        uuid_str = str(uuid.uuid4())
        jpg_path = STATIC_DIR / f"{uuid_str}.jpg"
        await convert_image_to_jpg(content, jpg_path)
        converted_files.append(jpg_path)
        uuids.append(uuid_str)

    elif file_extension == ".pdf":
        try:
            images = convert_pdf_to_images(content)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Ошибка конвертации PDF: {e}",
            )
        for page_number, image in enumerate(images, start=1):
            uuid_str = str(uuid.uuid4())
            jpg_path = STATIC_DIR / f"{uuid_str}.jpg"
            await save_pil_image(image, jpg_path)
            converted_files.append(jpg_path)
            uuids.append(uuid_str)

    elif file_extension in [".jpg", ".jpeg"]:
        # Сохранение JPG напрямую
        uuid_str = str(uuid.uuid4())
        jpg_path = STATIC_DIR / f"{uuid_str}.jpg"
        await save_bytes_as_jpg(content, jpg_path)
        converted_files.append(jpg_path)
        uuids.append(uuid_str)

    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Неизвестный тип файла"
        )

    return converted_files, uuids


def convert_pdf_to_images(pdf_bytes: bytes) -> List[Image.Image]:
    """
    Конвертирует PDF байты в список PIL.Image объектов.
    """
    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        images = []
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            pix = page.get_pixmap()
            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            images.append(img)
        return images
    except Exception as e:
        raise e


async def convert_image_to_jpg(image_bytes: bytes, save_path: Path):
    with Image.open(io.BytesIO(image_bytes)) as img:
        rgb_img = img.convert("RGB")
        rgb_img.save(save_path, format="JPEG", quality=85)


async def save_pil_image(image: Image.Image, save_path: Path):
    # Асинхронное сохранение через поток
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, image.convert, "RGB")
    image.convert("RGB").save(save_path, format="JPEG", quality=85)


async def save_bytes_as_jpg(image_bytes: bytes, save_path: Path):
    async with aiofiles.open(save_path, "wb") as out_file:
        await out_file.write(image_bytes)


async def send_files_to_ai(file_paths: List[Path], uuids: List[str]):
    async with aiohttp.ClientSession() as session:
        for file_path, uuid_str in zip(file_paths, uuids):
            result = await send_single_file(session, file_path, uuid_str)
            if isinstance(result, Exception):
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Ошибка при отправке на AI сервис: {str(result)}",
                )
            await asyncio.sleep(2)


async def send_single_file(
    session: aiohttp.ClientSession, file_path: Path, uuid_str: str
):
    try:
        with open(file_path, "rb") as f:
            data = aiohttp.FormData()
            data.add_field(
                "file", f, filename=file_path.name, content_type="image/jpeg"
            )
            data.add_field("id", uuid_str)
            async with session.post(
                AI_RECOGNIZE_URL.format(uuid_str), data=data, timeout=10
            ) as response:
                if response.status != 200:
                    text = await response.text()
                    raise Exception(
                        f"AI сервис вернул статус {response.status}: {text}"
                    )
    except Exception as e:
        raise Exception(f"Не удалось отправить файл {file_path.name}: {e}")


async def get_images_by_user(
    session: AsyncSession,
    user: User,
    page_size: int = 1000,
    page_number: int = 1,
) -> ImagesList:
    stmt = (
        select(models.Image)
        .where(models.Image.user_id == user.id)
        .options(selectinload(models.Image.rects))  # загружаем rects
        .order_by(models.Image.id.desc())
    )

    result = await session.execute(stmt)
    images = list(result.scalars().all())

    limit = page_size
    offset = (page_number - 1) * page_size
    response_images = images[offset : offset + limit]
    total_pages = ceil(len(images) / page_size)

    images_list = ImagesList(
        images=response_images, total_pages=total_pages, current_page=page_number
    )
    return images_list


async def get_image_by_id(
    session: AsyncSession, user: User, image_id: int
) -> ImageSchema:
    stmt = (
        select(models.Image)
        .where(models.Image.user_id == user.id)
        .where(models.Image.id == image_id)
        .options(selectinload(models.Image.rects))  # загружаем rects
    )

    result = await session.execute(stmt)
    image = result.scalars().first()

    return image


async def create_rects(
    session: AsyncSession, image_uuid: str, rects: List[RectCreate]
) -> List[models.Rect]:
    search = f"%{image_uuid}.jpg"
    stmt = select(models.Image).where(models.Image.url.like(search))
    result = await session.execute(stmt)
    image = result.scalars().first()

    if not image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Image not found"
        )

    response_rects = []
    for rect in rects:
        rect = models.Rect(**rect.model_dump(), image_id=image.id)
        session.add(rect)
        response_rects.append(rect)
    await session.commit()
    return response_rects


async def fetch_rect_and_image(
    session: AsyncSession, rect_id: int
) -> Tuple[models.Rect, models.Image]:
    stmt = (
        select(models.Rect)
        .where(models.Rect.id == rect_id)
        .options(selectinload(models.Rect.image))
    )
    result = await session.execute(stmt)
    rect = result.scalars().first()

    if not rect:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Rect not found"
        )

    image = rect.image
    if not image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Image not found"
        )

    return rect, image


async def crop_image(
    image_path: str, x1: int, y1: int, x2: int, y2: int
) -> Image.Image:
    loop = asyncio.get_event_loop()
    try:
        original_img = await loop.run_in_executor(None, Image.open, image_path)
    except FileNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Файл изображения не найден по пути: {image_path}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ошибка при открытии изображения: {str(e)}",
        )

    try:
        crop_box = (x1, y1, x2, y2)
        cropped_img = original_img.crop(crop_box)
        return cropped_img
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ошибка при вырезании изображения: {str(e)}",
        )


async def convert_image_to_jpg_bytes(image: Image.Image) -> bytes:
    loop = asyncio.get_event_loop()
    img_bytes = io.BytesIO()
    try:
        await loop.run_in_executor(
            None, lambda: image.save(img_bytes, "JPEG", quality=85)
        )

        img_bytes.seek(0)
        return img_bytes.getvalue()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ошибка при конвертации изображения в JPEG: {str(e)}",
        )


async def send_image_to_ai_service(image_bytes: bytes) -> str:
    ai_url = settings.ai_convert_url

    timeout = aiohttp.ClientTimeout(total=30)
    async with aiohttp.ClientSession(timeout=timeout) as session_client:
        data = aiohttp.FormData()
        data.add_field(
            name="file",
            value=image_bytes,
            filename="cropped.jpg",
            content_type="image/jpeg",
        )
        try:
            async with session_client.post(ai_url, data=data) as response:
                if response.status != 200:
                    resp_text = await response.text()
                    raise HTTPException(
                        status_code=status.HTTP_502_BAD_GATEWAY,
                        detail=f"AI сервис вернул статус {response.status}: {resp_text}",
                    )
                result_text = await response.text()
                return result_text
        except asyncio.TimeoutError:
            raise HTTPException(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                detail="Таймаут при обращении к AI сервису.",
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Ошибка при обращении к AI сервису: {str(e)}",
            )


async def get_latex_by_rect_id(session: AsyncSession, rect_id: int) -> str:
    rect, image = await fetch_rect_and_image(session, rect_id)

    cropped_img = await crop_image(image.path, rect.x1, rect.y1, rect.x2, rect.y2)

    image_bytes = await convert_image_to_jpg_bytes(cropped_img)

    latex = await send_image_to_ai_service(image_bytes)

    return latex
