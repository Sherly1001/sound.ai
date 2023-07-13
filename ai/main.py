import json
from typing import Any

from paho.mqtt.client import Client, MQTTMessage

import mqtt
import nn
import nn.load_model


def on_predict_req(client: Client, _: Any, msg: MQTTMessage):
    payload = None
    response = None

    try:
        payload = json.loads(msg.payload)
        if payload.get('id') is None:
            raise Exception('predict: missing req id')
        if payload.get('modelId') is None:
            raise Exception('predict: missing field modelId')
        if payload.get('record') is None:
            raise Exception('predict: missing field record')
        if payload.get('fft') is None:
            raise Exception('predict: missing field fft')

        result = nn.predict(payload['modelId'], payload['record'],
                            payload['fft'])

        response = {'data': result, 'id': payload['id']}

    except Exception as err:
        print('predict err:', err)
        response = {
            'error': str(err),
            'id': payload['id'] if payload is not None else None
        }

    finally:
        client.publish(mqtt.topic_predict_res, json.dumps(response))


def on_new_model(client: Client, _: Any, msg: MQTTMessage):
    try:
        payload = json.loads(msg.payload)
        if payload.get('modelId') is None:
            raise Exception('missing field modelId')
        print('downloading model:', payload['modelId'])
        nn.load_model.download_model(payload['modelId'])
        print('new model loaded:', payload['modelId'])
    except Exception as err:
        print('new model err:', err)


def on_remove_model(client: Client, _: Any, msg: MQTTMessage):
    try:
        payload = json.loads(msg.payload)
        if payload.get('modelId') is None:
            raise Exception('missing field modelId')
        nn.load_model.remove_model(payload['modelId'])
    except Exception as err:
        print('remove model err:', err)


if __name__ == '__main__':
    client = mqtt.connect()

    mqtt.sub(client, mqtt.topic_predict_req, on_predict_req)
    mqtt.sub(client, mqtt.topic_new_model, on_new_model)
    mqtt.sub(client, mqtt.topic_remove_model, on_remove_model)

    client.loop_forever()
