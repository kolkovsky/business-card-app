import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app-config.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableShutdownHooks();

  const config = app.get(AppConfigService);
  app.set('trust proxy', config.trustProxyHops);
  await app.listen(config.port, '0.0.0.0');

  Logger.log(`Application is running on ${await app.getUrl()}`, 'Bootstrap');
}

void bootstrap();
