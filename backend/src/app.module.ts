import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiModule } from './api/api.module';
import { AuthModule } from './auth/auth.module';
import config from './config';
import { MqttModule } from './mqtt/mqtt.module';
import { SchemaModule } from './schema/schema.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    SchemaModule,
    ApiModule,
    AuthModule,
    StorageModule,
    MqttModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
