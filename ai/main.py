import json
from typing import Any

from paho.mqtt.client import Client, MQTTMessage

import mqtt
import nn


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
        client.publish(mqtt.topic_res, json.dumps(response))


if __name__ == '__main__':
    client = mqtt.connect()
    mqtt.sub(client, mqtt.topic_req, on_predict_req)

    client.loop_forever()
