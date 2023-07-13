import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ClientMqtt } from '@nestjs/microservices';
import { MqttClient } from '@nestjs/microservices/external/mqtt-client.interface';
import { randomUUID } from 'crypto';
import { Packet } from 'mqtt';

@Injectable()
export class MqttService {
  static readonly topicPredictReq = 'ai/predict/req';
  static readonly topicPredictRes = 'ai/predict/res';
  static readonly topicNewModel = 'ai/new-model';
  static readonly topicRemoveModel = 'ai/remove-model';

  private readonly logger = new Logger(MqttService.name);

  private readonly client: MqttClient;
  private readonly timeout = 15 * 1000;
  private readonly resolveList: Record<
    string,
    [NodeJS.Timeout, (data: any) => void]
  > = {};

  constructor(@Inject('mqtt-client') mqtt: ClientMqtt) {
    this.client = mqtt.createClient();

    const topics = [
      {
        name: MqttService.topicPredictRes,
        handler: this.onRes.bind(this),
      },
    ];

    topics.forEach((t) => {
      this.client.subscribe(t.name);
    });

    this.client.on(
      'message',
      (topic: string, payload: Buffer, _packet: Packet) => {
        topics.forEach((t) => {
          if (t.name == topic) {
            try {
              const res = t.handler(payload);

              const id = res.id;
              if (id && this.resolveList[id]) {
                const [timeout, func] = this.resolveList[id];
                clearTimeout(timeout);
                func(res);
                delete this.resolveList[id];
              }
            } catch (err) {
              this.logger.error(err);
            }
          }
        });
      },
    );
  }

  onRes(payload: Buffer) {
    return JSON.parse(String(payload));
  }

  publish(topic: string, payload: any) {
    const id = randomUUID();

    payload.id = id;
    this.client.publish(topic, JSON.stringify(payload));

    return id;
  }

  publishAndWait(topic: string, payload: any) {
    return new Promise((res, rej) => {
      const timeout = setTimeout(() => {
        delete this.resolveList[payload.id];
        const err = new InternalServerErrorException('Message timeout');
        this.logger.error(err);
        rej(err);
      }, this.timeout);

      const id = this.publish(topic, payload);
      this.resolveList[id] = [timeout, res];

      return id;
    });
  }
}
