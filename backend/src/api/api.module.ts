import { Module } from '@nestjs/common';
import { DeviceModule } from './device/device.module';
import { ModelModule } from './model/model.module';
import { RecordModule } from './record/record.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, DeviceModule, ModelModule, RecordModule],
})
export class ApiModule {}
