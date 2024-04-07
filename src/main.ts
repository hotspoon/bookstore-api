// main.ts
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { resolve } from 'path';
import { writeFileSync, existsSync, readFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const pathToSwaggerStaticFolder = resolve(process.cwd(), 'swagger-static');
  const pathToSwaggerJson = resolve(pathToSwaggerStaticFolder, 'swagger.json');

  const swaggerPath = '/swagger-ui';
  const swaggerCDN = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.7.2';

  if (process.env.NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('Bookstore API')
      .setDescription('The Bookstore API description')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(swaggerPath, app, document, {
      customCssUrl: `${swaggerCDN}/swagger-ui.css`,
      customJs: [
        `${swaggerCDN}/swagger-ui-bundle.js`,
        `${swaggerCDN}/swagger-ui-standalone-preset.js`,
      ],
    });

    // write swagger json file
    const swaggerJson = JSON.stringify(document, null, 2);
    writeFileSync(pathToSwaggerJson, swaggerJson);
    console.log(`Swagger JSON file written to: '/swagger-static/swagger.json'`);
  } else if (process.env.NODE_ENV === 'production') {
    // serve static files in production
    if (existsSync(pathToSwaggerJson)) {
      const document = JSON.parse(readFileSync(pathToSwaggerJson, 'utf8'));
      SwaggerModule.setup(swaggerPath, app, document, {
        customCssUrl: `${swaggerCDN}/swagger-ui.css`,
        customJs: [
          `${swaggerCDN}/swagger-ui-bundle.js`,
          `${swaggerCDN}/swagger-ui-standalone-preset.js`,
        ],
      });
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
