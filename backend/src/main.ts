import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfig } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const cfg = app.get(ConfigService<AppConfig, true>);

  await app.listen(cfg.get('port'), async () => {
    Logger.log(`App running at: ${await app.getUrl()}`, bootstrap.name);
  });
}
bootstrap();
