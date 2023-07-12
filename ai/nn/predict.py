from config import labels

from typing import Any
from random import random


def predict(model_id: str, record: Any, fft: str):
    fftarr = list(map(complex, fft.split(',')))
    # TODO: load model and predict

    scores = list(
        map(lambda labelId: {
            'labelId': labelId,
            'score': random()
        }, labels))

    return scores
