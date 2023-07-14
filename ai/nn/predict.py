from typing import Any, List

import os
import json
import requests

from config import api
from .load_model import get_model

url = os.path.join(api['url'], 'result',
                               'list-label?limit=100&orderASC=true')
res = requests.get(url)
res = json.loads(res.content)
if res.get('data') is not None:
    labels: List[str] = list(
        map(lambda l: l['labelId'], res['data']['items']))
else:
    raise Exception(f'failed to load labels: {res["error"]}')


def predict(model_id: str, record: Any, fft: str):
    global labels

    fftarr: List[complex] = list(map(complex, fft.split(',')))

    model = get_model(model_id)
    results = model(record, fftarr)

    scores = list(
        map(lambda r: {
            'labelId': r[0],
            'score': r[1]
        }, zip(labels, results)))

    return scores
