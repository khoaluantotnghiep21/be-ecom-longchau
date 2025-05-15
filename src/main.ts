import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RequestSuccessInterceptor } from './interceptors/requestSuccess.interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cấu hình CORS hoàn chỉnh
  app.enableCors({
    origin: true, // Cho phép tất cả các origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders:
      'Origin,X-Requested-With,Content-Type,Accept,Authorization,Access-Control-Allow-Origin',
    exposedHeaders: 'Content-Length,Content-Range',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.useGlobalInterceptors(new RequestSuccessInterceptor());
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API Documentation for the project Long Chau Pharmacy')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token',
    )
    .addTag('IdentityUser')
    .addTag('Product')
    .addTag('Category')
    .addTag('Brand')
    .addTag('Unit')
    .addTag('UnitDetals')
    .addTag('Ingredient')
    .addTag('Promotion')
    .addTag('UploadFile')
    .addTag('Role')
    .addTag('UserRole')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      hashPrefix: '',
    },
  });
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 4000);
}
void bootstrap();
