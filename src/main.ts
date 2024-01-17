import { NestFactory } from '@nestjs/core';
import { AppModule } from '@infrastructure/modules/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // :: Configure and init swagger document
  const swaggerConfig = new DocumentBuilder()
    .setTitle('travel-mix')
    .setDescription('Project travel-mix API')
    .setVersion('1.0')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/api', app, swaggerDocument, {
    useGlobalPrefix: true,
  });

  await app.listen(3001);
}
bootstrap();
