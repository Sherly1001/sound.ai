import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { MqttModule } from 'src/mqtt/mqtt.module';
import { Model, ModelType } from 'src/schema/entities';
import { StorageModule } from 'src/storage/storage.module';
import { ModelController } from './model.controller';
import { ModelService } from './model.service';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    StorageModule,
    TypeOrmModule.forFeature([Model, ModelType]),
    MqttModule,
  ],
  providers: [ModelService],
  controllers: [ModelController],
})
export class ModelModule {}
