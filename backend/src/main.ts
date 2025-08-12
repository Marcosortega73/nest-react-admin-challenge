import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { SeedService } from 'database/seeds/seed.service';
import { ConfigService } from '@nestjs/config';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  
  app.useGlobalPipes(new ValidationPipe());

  const config = app.get(ConfigService);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Carna Project API')
    .setDescription('Carna Project API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('/api/docs', app, document);

  if (config.get('SEED_ON_BOOT') === 'true') {
    try {
      const seeder = await app.resolve(SeedService);
      await seeder.run();
      console.log('[SEED] Completed');
    } catch (e: any) {
      console.warn('[SEED] Skipped/failed:', e?.message ?? e);
    }
  }
  
  const port = parseInt(config.get('PORT') ?? '5000', 10);
  await app.listen(port, '0.0.0.0');
}
bootstrap();
