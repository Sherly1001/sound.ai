import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfig } from '../config';
import entities from './entities';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService<AppConfig, true>) => ({
        type: 'postgres',
        url: cfg.get('database.url', { infer: true }),
        logging: true,
        synchronize: true,
        entities: entities,
      }),
    }),
  ],
})
export class SchemaModule {}
