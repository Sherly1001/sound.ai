import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { DeviceGuard } from 'src/auth/dev.guard';
import { UserGuard } from 'src/auth/user.guard';
import {
  Device,
  DiagnosticResult,
  Label,
  Model,
  Record,
  Score,
} from 'src/schema/entities';
import { ResultController } from './result.controller';
import { ResultService } from './result.service';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([
      DiagnosticResult,
      Device,
      Model,
      Record,
      Score,
      Label,
    ]),
  ],
  providers: [ResultService, UserGuard, DeviceGuard],
  controllers: [ResultController],
})
export class ResultModule {}
