from transformers import BertTokenizer, BertForNextSentencePrediction
import torch
from typing import Optional
from ..config import settings

class EquilLibriaBert:
    def __init__(
        self, model_name: str = "tbs17/MathBERT", model_path: str = settings.model_path
    ) -> None:
        """
        Initializes the EquilLibriaBert class by loading the tokenizer and model.

        Args:
            model_name (str): The name or path of the pre-trained tokenizer.
            model_path (str): The path to the fine-tuned model directory.
        """
        self.tokenizer: BertTokenizer = BertTokenizer.from_pretrained(model_name)
        self.model: BertForNextSentencePrediction = (
            BertForNextSentencePrediction.from_pretrained(model_path)
        )
        self.device: torch.device = torch.device(
            "cuda" if torch.cuda.is_available() else "cpu"
        )
        self.model.to(self.device)
        self.model.eval()
        print(f"Model loaded on device: {self.device}")

    async def predict_similarity(
        self, eq1: str, eq2: str, max_length: int = 128
    ) -> float:
        """
        Predicts the similarity between two equations using the fine-tuned MathBert model.

        Args:
            eq1 (str): The first equation or sentence.
            eq2 (str): The second equation or sentence to evaluate as a continuation of eq1.
            max_length (int, optional): Maximum token length. Defaults to 128.

        Returns:
            float: The probability that eq2 is a valid continuation of eq1.
        """
        inputs = self.tokenizer(
            eq1,
            eq2,
            return_tensors="pt",
            truncation=True,
            padding="max_length",
            max_length=max_length,
        )

        inputs = {key: value.to(self.device) for key, value in inputs.items()}

        with torch.no_grad():
            outputs = self.model(**inputs)
            logits = outputs.logits

        probabilities = torch.softmax(logits, dim=1)
        similarity = probabilities[0][1].item()

        return similarity
