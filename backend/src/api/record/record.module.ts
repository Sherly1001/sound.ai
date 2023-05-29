import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Device } from 'src/schema/entities/device.entity';
import { Record } from 'src/schema/entities/record.entity';
import { StorageModule } from 'src/storage/storage.module';
import { RecordController } from './record.controller';
import { RecordService } from './record.service';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([Record, Device]),
    StorageModule,
  ],
  providers: [RecordService],
  controllers: [RecordController],
})
export class RecordModule {}
