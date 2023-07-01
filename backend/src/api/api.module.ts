import { Module } from '@nestjs/common';
import { DashboardModule } from './dashboard/dashboard.module';
import { DeviceModule } from './device/device.module';
import { ModelModule } from './model/model.module';
import { RecordModule } from './record/record.module';
import { ResultModule } from './result/result.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    DashboardModule,
    UserModule,
    DeviceModule,
    ModelModule,
    RecordModule,
    ResultModule,
  ],
})
export class ApiModule {}
