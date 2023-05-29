import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Device } from 'src/schema/entities';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';

@Module({
  imports: [forwardRef(() => AuthModule), TypeOrmModule.forFeature([Device])],
  providers: [DeviceService],
  exports: [DeviceService],
  controllers: [DeviceController],
})
export class DeviceModule {}
