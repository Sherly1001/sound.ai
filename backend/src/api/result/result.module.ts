import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { DeviceGuard } from 'src/auth/dev.guard';
import { UserGuard } from 'src/auth/user.guard';
import { MqttModule } from 'src/mqtt/mqtt.module';
import {
  Device,
  DiagnosticResult,
  Label,
  Model,
  Record,
  Score,
  User,
} from 'src/schema/entities';
import { RecordModule } from '../record/record.module';
import { ResultController } from './result.controller';
import { ResultService } from './result.service';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([
      DiagnosticResult,
      Device,
      User,
      Model,
      Record,
      Score,
      Label,
    ]),
    MqttModule,
    RecordModule,
  ],
  providers: [ResultService, UserGuard, DeviceGuard],
  controllers: [ResultController],
})
export class ResultModule {}
