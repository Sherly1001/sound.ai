from random import randint
from config import mqtt as mqtt_cfg

from typing import Any, Callable, Dict, List
from paho.mqtt.client import (MQTT_ERR_CONN_LOST, MQTT_ERR_CONN_REFUSED,
                              MQTT_ERR_SUCCESS, Client, MQTTMessage, MQTTv5)

topic_predict_req = 'ai/predict/req'
topic_predict_res = 'ai/predict/res'
topic_new_model = 'ai/new-model'
topic_remove_model = 'ai/remove-model'

Listener = Callable[[Client, Any, MQTTMessage], None]
subs: Dict[str, List[Listener]] = {}


def connect():
    global subs

    def connect_(client: Client):
        client.connect(mqtt_cfg['brocker'], mqtt_cfg['port'])

    def on_connect(client: Client, userdata, flags, rc, prop):
        print(client, 'connected')

    def on_disconnect(client: Client, userdata, rc, prop):
        print(client, 'disconnected')
        if rc == MQTT_ERR_CONN_LOST or rc == MQTT_ERR_CONN_REFUSED:
            connect_(client)
        else:
            raise Exception(f'mqtt err code: {rc}')

    def on_message(client: Client, userdata, msg: MQTTMessage):
        for topic in subs:
            if topic == msg.topic:
                for listener in subs[topic]:
                    listener(client, userdata, msg)

    client_id = f'ai-module_{randint(1, 1000)}'
    client = Client(client_id, protocol=MQTTv5)

    client.on_connect = on_connect
    client.on_disconnect = on_disconnect
    client.on_message = on_message

    client.username_pw_set(mqtt_cfg['username'], mqtt_cfg['password'])
    connect_(client)

    return client


def sub(client: Client, topic: str, listener: Listener):
    [rs, mid] = client.subscribe(topic)
    if rs != MQTT_ERR_SUCCESS: raise Exception('Not connected')
    subs.setdefault(topic, []).append(listener)
    return (rs, mid)


def unsub(client: Client, topic: str):
    global subs

    [rs, mid] = client.unsubscribe(topic)
    if rs != MQTT_ERR_SUCCESS: raise Exception('Not connected')
    subs[topic] = []
    return (rs, mid)
