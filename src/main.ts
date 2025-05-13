import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RequestSuccessInterceptor } from './interceptors/requestSuccess.interceptors';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new RequestSuccessInterceptor())
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
  .addTag('Product')
  .addTag('Category')
  .addTag('UploadFile')
  .addTag('Role')
  .addTag('IdentityUser')
  .addTag('Brand')

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
bootstrap();
