import os
import cv2 as cv
from pathlib import Path
from onnxruntime import InferenceSession

from models.thrid_party.paddleocr.infer import predict_det, predict_rec, utility
from models.utils import mix_inference
from models.ocr_model.utils.to_katex import to_katex
from models.ocr_model.utils.inference import inference as latex_inference
from models.ocr_model.model.TexTeller import TexTeller
from models.det_model.inference import PredictConfig

class OcrLatexService:
    def __init__(self, 
                 inference_mode='cpu', 
                 num_beam=1, 
                 mix_mode=False,
                 infer_cfg_path="./models/det_model/model/infer_cfg.yml",
                 det_model_path="./models/det_model/model/rtdetr_r50vd_6x_coco.onnx",
                 det_model_dir="./models/thrid_party/paddleocr/checkpoints/det/default_model.onnx",
                 rec_model_dir="./models/thrid_party/paddleocr/checkpoints/rec/default_model.onnx"):
        
        self.inference_mode = inference_mode
        self.num_beam = num_beam
        self.mix_mode = mix_mode

        # Подготовка окружения
        os.chdir(Path(__file__).resolve().parent)

        # Загрузка текстовой модели
        self.latex_rec_model = TexTeller.from_pretrained()
        self.tokenizer = TexTeller.get_tokenizer()

        # Если потребуется микс-режим (det + rec для OCR)
        if self.mix_mode:
            self.infer_config = PredictConfig(infer_cfg_path)
            self.latex_det_model = InferenceSession(det_model_path)

            use_gpu = (self.inference_mode == 'cuda')
            SIZE_LIMIT = 20 * 1024 * 1024

            # Настройки для paddleocr
            self.paddleocr_args = utility.parse_args()
            self.paddleocr_args.use_onnx = True
            self.paddleocr_args.det_model_dir = det_model_dir
            self.paddleocr_args.rec_model_dir = rec_model_dir

            # The CPU inference of the detection model is often faster
            det_use_gpu = False
            rec_use_gpu = use_gpu and not (os.path.getsize(rec_model_dir) < SIZE_LIMIT)

            self.paddleocr_args.use_gpu = det_use_gpu
            self.detector = predict_det.TextDetector(self.paddleocr_args)
            self.paddleocr_args.use_gpu = rec_use_gpu
            self.recognizer = predict_rec.TextRecognizer(self.paddleocr_args)

            self.lang_ocr_models = [self.detector, self.recognizer]
            self.latex_rec_models = [self.latex_rec_model, self.tokenizer]

    def infer(self, img_path: str) -> str:
        # Выполнение инференса
        img = cv.imread(img_path)

        if not self.mix_mode:
            # Прямой инференс без детектора
            res = latex_inference(self.latex_rec_model, self.tokenizer, [img], self.inference_mode, self.num_beam)
            res = to_katex(res[0])
            return res
        else:
            # Микс-режим с использованием det+rec onnx моделей
            res = mix_inference(
                img_path, 
                self.infer_config, 
                self.latex_det_model, 
                self.lang_ocr_models, 
                self.latex_rec_models, 
                self.inference_mode, 
                self.num_beam
            )
            return res