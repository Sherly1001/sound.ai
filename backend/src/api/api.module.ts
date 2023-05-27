import { Module } from '@nestjs/common';
import { DeviceModule } from './device/device.module';
import { UserModule } from './user/user.module';
import { ModelModule } from './model/model.module';

@Module({
  imports: [UserModule, DeviceModule, ModelModule],
})
export class ApiModule {}
