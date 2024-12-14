from ultralytics import YOLO


print("Model is being loaded...")
model_weights = "/home/alex/formula_recognition/model/model_weights.pt"
model = YOLO(model_weights)