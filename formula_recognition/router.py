import uvicorn
from fastapi import FastAPI, File, UploadFile, BackgroundTasks
from fastapi.responses import JSONResponse
from typing import List
from PIL import Image
from io import BytesIO
from recognition import recognition
from recognition import Rect


app = FastAPI()



@app.post("/api/{id}/")
async def predict(file: UploadFile = File(...), id: str = "1", background_tasks: BackgroundTasks = None):
    file_content = await file.read()

    response = JSONResponse(content={"message": "OK"}, status_code=200)

    if background_tasks:
        background_tasks.add_task(process_image, file_content, id)

    return response

async def process_image(file_content: bytes, id: str):
    await recognition(file_content, id)
   



if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8002)