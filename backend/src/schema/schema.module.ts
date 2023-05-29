import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfig } from '../config';
import entities from './entities';
import migrations from './migrations';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService<AppConfig, true>) => ({
        type: 'postgres',
        url: cfg.get('database.url', { infer: true }),
        logging: cfg.get('database.log', { infer: true }),
        entities: entities,
        migrations: migrations,
        synchronize: cfg.get('database.enableSync', { infer: true }),
        migrationsRun: cfg.get('database.runMigrations', { infer: true }),
      }),
    }),
  ],
})
export class SchemaModule {}
