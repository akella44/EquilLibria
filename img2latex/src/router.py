import io
import uvicorn
import cv2
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from typing import Optional

from starlette.middleware.cors import CORSMiddleware
from server import OcrLatexService



app = FastAPI()

service = OcrLatexService(inference_mode='cpu', num_beam=1, mix_mode=False)

@app.post("/api/")
async def predict(file: UploadFile = File(...)) -> JSONResponse:
    
    contents = await file.read()
    temp_image_path = "temp_input_image.jpg"
    with open(temp_image_path, "wb") as f:
        f.write(contents)
    
    result = service.infer(temp_image_path)
    return JSONResponse(content={"result": result, "message": "The image was processed successfully"})
    

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
