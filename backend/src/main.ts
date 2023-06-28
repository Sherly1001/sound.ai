import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppConfig } from './config';
import { ResultWapper } from './filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const cfg = app.get(ConfigService<AppConfig, true>);

  app.enableCors();

  app.useGlobalFilters(new ResultWapper());

  const doc = new DocumentBuilder()
    .setTitle('Sound.AI')
    .setDescription('The APIs for sound.ai')
    .addBearerAuth({ type: 'http' }, 'userAuth')
    .addBearerAuth({ type: 'http' }, 'adminAuth')
    .addBearerAuth({ type: 'http' }, 'devAuth')
    .build();

  const document = SwaggerModule.createDocument(app, doc);
  SwaggerModule.setup('docs', app, document);

  await app.listen(cfg.get('port'), async () => {
    Logger.log(`App running at: ${await app.getUrl()}`, bootstrap.name);
  });
}
bootstrap();
