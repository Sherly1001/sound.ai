import os
from typing import Any, Callable, Dict, List

import torch
import requests

from .model import Model
from config import api

ModelType = Callable[[Any, List[complex]], List[float]]
models: Dict[str, Model] = {}


def model_download_url(model_id: str):
    path = os.path.join(api['url'], 'model', 'download', model_id)
    return path


def model_storage_path(model_id: str):
    path = os.path.join(os.getcwd(), 'data', 'models', model_id + '.pt')
    os.makedirs(os.path.dirname(path), exist_ok=True)
    return path


def load_model_with_path(path: str):
    model = torch.load(path)
    return Model(model)


def download_model(model_id: str):
    url = model_download_url(model_id)
    path = model_storage_path(model_id)

    res = requests.get(url)
    with open(path, 'wb') as outfile:
        outfile.write(res.content)

    return load_model_with_path(path)


def load_model_from_storage(model_id: str):
    path = model_storage_path(model_id)

    if os.path.isfile(path): return load_model_with_path(path)

    model = download_model(model_id)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    torch.save(model, path)

    return model


def load_model(model_id: str):
    global models

    model = models.get(model_id)
    if model: return model

    model = load_model_from_storage(model_id)
    models[model_id] = model

    return model


def get_model(model_id: str) -> ModelType:
    model = load_model(model_id)

    def predict(record, fft: List[complex]):
        out = model.predict(fft)
        return out.tolist()

    return predict


def remove_model(model_id: str):
    if models.get('model_id') is not None:
        del models[model_id]
    path = model_storage_path(model_id)
    os.remove(path)
