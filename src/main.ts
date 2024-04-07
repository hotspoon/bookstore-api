// main.ts
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { resolve } from 'path';
import { writeFileSync, existsSync, readFileSync } from 'fs';
import { static as expressStatic } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const pathToSwaggerStaticFolder = resolve(process.cwd(), 'swagger-static');
  const pathToSwaggerJson = resolve(pathToSwaggerStaticFolder, 'swagger.json');

  if (process.env.NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('Bookstore API')
      .setDescription('The Bookstore API description')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);

    // write swagger json file
    const swaggerJson = JSON.stringify(document, null, 2);
    writeFileSync(pathToSwaggerJson, swaggerJson);
    console.log(`Swagger JSON file written to: '/swagger-static/swagger.json'`);
  } else if (process.env.NODE_ENV === 'production') {
    // serve static files in production
    if (existsSync(pathToSwaggerJson)) {
      const document = JSON.parse(readFileSync(pathToSwaggerJson, 'utf8'));
      SwaggerModule.setup('api-docs', app, document);
    }
  }

  app.enableCors({
    origin: '*',
    methods: 'GET, HEAD, PUT, POST, DELETE, OPTIONS, PATCH',
    credentials: true,
    allowedHeaders:
      'Origin, X-Requested-With, Content-Type, Accept, Authentication, Access-control-allow-credentials, Access-control-allow-headers, Access-control-allow-methods, Access-control-allow-origin, User-Agent, Referer, Accept-Encoding, Accept-Language, Access-Control-Request-Headers, Cache-Control, Pragma',
  });

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
