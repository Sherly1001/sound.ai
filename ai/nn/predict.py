from typing import Any, List

import os
import json
import urllib
import urllib.request

from config import api
from .load_model import get_model

api_labels_path = os.path.join(api['url'], 'result',
                               'list-label?limit=100&orderASC=true')
api_labels_path = urllib.request.Request(api_labels_path,
                                         headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(api_labels_path) as res:
    res = json.loads(res.read())
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
