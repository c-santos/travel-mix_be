import { NestFactory } from '@nestjs/core';
import { AppModule } from '@infrastructure/modules/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionsFilter } from '@infrastructure/http/filters/http-exceptions.filter';
import { LoggerInterceptor } from '@infrastructure/interceptors/logger.interceptor';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Filters and interceptors
  // app.useGlobalFilters(new HttpExceptionsFilter());
  app.useGlobalInterceptors(new LoggerInterceptor());

  app.use(cookieParser());

  // Configure and init swagger document
  const swaggerConfig = new DocumentBuilder()
    .setTitle('travel-mix')
    .setDescription('Project travel-mix API')
    .setVersion('1.0')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/api', app, swaggerDocument, {
    useGlobalPrefix: true,
  });

  // Listen
  await app.listen(3005);
}
bootstrap();
