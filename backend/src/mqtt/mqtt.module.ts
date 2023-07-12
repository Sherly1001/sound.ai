import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppConfig } from 'src/config';
import { MqttService } from './mqtt.service';

@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [
        {
          name: 'mqtt-client',
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (cfg: ConfigService<AppConfig, true>) => ({
            transport: Transport.MQTT,
            options: {
              url: cfg.get('mqtt.url', { infer: true }),
              username: cfg.get('mqtt.username', { infer: true }),
              password: cfg.get('mqtt.password', { infer: true }),
            },
          }),
        },
      ],
    }),
  ],
  providers: [MqttService],
  exports: [MqttService],
})
export class MqttModule {}
