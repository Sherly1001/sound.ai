import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ModelType } from 'src/schema/entities/model-type.entity';
import { Model } from 'src/schema/entities/model.entity';
import { StorageModule } from 'src/storage/storage.module';
import { ModelController } from './model.controller';
import { ModelService } from './model.service';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    StorageModule,
    TypeOrmModule.forFeature([Model, ModelType]),
  ],
  providers: [ModelService],
  controllers: [ModelController],
})
export class ModelModule {}
