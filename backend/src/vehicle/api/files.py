import os

from pathlib import Path

from fastapi import APIRouter, Depends, File, UploadFile, status, HTTPException
from fastapi.responses import FileResponse

from vehicle.utils.auth import get_current_username
from vehicle.schemas.cars import PhotoSchema
from vehicle.utils.exeptions import CustomValidationError


UPLOAD_DIR = Path("photos/cars").resolve()
os.makedirs(UPLOAD_DIR, exist_ok=True)



router = APIRouter(
    prefix="/api/docs"
)


@router.post(
    "/",
    dependencies=[Depends(get_current_username)],
    response_model=PhotoSchema
)
def upload_car_photo(photo: UploadFile = File(...)):
    if not photo.content_type.startswith("image/"):
        raise CustomValidationError.single(
            msg="Неподдерживаемый формат файла",
            input_name="photo",input_value=photo.filename,
        )
    content = photo.file.read()
    file_path = os.path.join(UPLOAD_DIR, photo.filename)
    with open(file_path, "wb") as f:
        f.write(content)
    file_path = f"http://localhost/photo/{photo.filename}"
    return dict(photo=file_path)


@router.get("/{filepath:path}")
def get_photo(filepath: str):
    file_path = Path(filepath).resolve()
    if not str(file_path).startswith(str(UPLOAD_DIR)) or not file_path.is_file():
        raise CustomValidationError.single(
            msg="Файл не найден",
            input_name="filepath",
            input_value=filepath
        )
    return FileResponse(
        file_path,
    )
