from typing import List

from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.params import Depends
from fastapi.security import HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from .schemas import UploadImagesResponse, ImagesList, Image, Rect, RectCreate, Latex
from ..database import db_manager
from . import service
from ..auth.dependencies import get_current_active_auth_user
from ..users import User

http_bearer = HTTPBearer(auto_error=False)
router = APIRouter(
    tags=["Files"],
    prefix="/files",
    dependencies=[
        Depends(http_bearer),
    ],
)


@router.post(
    path="/upload/",
    response_model=UploadImagesResponse,
    summary="Upload file (png, jpg, pdf)",
)
async def upload_file(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    session: AsyncSession = Depends(db_manager.session_dependency),
    user: User = Depends(get_current_active_auth_user),
):
    """
    Upload file in format png, jpg or pdf.

    - **access_token**: Header bearer access token (required)

    - **file**: Upload file (png, jpg, pdf)
    """
    if not file:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File not found",
        )

    image_uuids, converted_files, image_ids = await service.upload_file(
        file=file, session=session, user=user
    )
    background_tasks.add_task(service.send_files_to_ai, converted_files, image_uuids)
    return UploadImagesResponse(image_ids=image_ids)


@router.get(
    path="/images/",
    response_model=ImagesList,
    summary="Get images with detected formulas and rectangles",
)
async def get_images(
    session: AsyncSession = Depends(db_manager.session_dependency),
    user: User = Depends(get_current_active_auth_user),
    page_size: int = 1000,
    page_number: int = 1,
):
    """
    Get images with detected formulas and rectangles for current user.

    - **access_token**: Header bearer access token (required)

    - **page_size**: Limit of images (default=1000)
    - **page_number**: Offset page number (default=1)
    """
    return await service.get_images_by_user(
        session=session, user=user, page_size=page_size, page_number=page_number
    )


@router.get(
    path="/images/{image_id}/",
    response_model=Image,
    summary="Get image with detected formulas and rectangles by id",
)
async def get_image_by_id(
    image_id: int,
    session: AsyncSession = Depends(db_manager.session_dependency),
    user: User = Depends(get_current_active_auth_user),
):
    """
    Get image with detected formulas and rectangles for current user by id.

    - **access_token**: Header bearer access token (required)

    - **image_id**: Image id (path, required)
    """
    return await service.get_image_by_id(session=session, user=user, image_id=image_id)


@router.post(
    path="/images/{image_uuid}/rects/",
    response_model=List[Rect],
    summary="Create rectangles of formulas in pictures",
)
async def create_rects(
    image_uuid: str,
    rects: List[RectCreate],
    session: AsyncSession = Depends(db_manager.session_dependency),
):
    """
    Create rectangles of formulas in pictures for ai service.

    - **image_uuid**: Image string uuid (path, required)

    - **rects**: List of rectangles (x1, y1, x2, y2) (required)
    """
    return await service.create_rects(
        session=session, image_uuid=image_uuid, rects=rects
    )


@router.get(
    path="/rects/{rect_id}/",
    response_model=Latex,
    summary="Get latex by rect id",
)
async def get_latex_by_rect_id(
    rect_id: int,
    session: AsyncSession = Depends(db_manager.session_dependency),
    _: User = Depends(get_current_active_auth_user),
):
    """
    Get latex formula by rect id (ai process).

    - **access_token**: Header bearer access token (required)

    - **rect_id**: Rectangle id (path, required)
    """
    return await service.get_latex_by_rect_id(session=session, rect_id=rect_id)
