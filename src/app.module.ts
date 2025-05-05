import { MiddlewareConsumer, Module, NestModule, Scope } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequestService } from './request.service';
import { AuthenticationMiddleware } from './middleware/authentication.middleware';
import { AuthGuard } from './guards/auth.guards';
import { LoggingInterceptor } from './interceptors/logging.interceptors';
import { FreezePipe } from './pipes/freeze.pipe';
import { HttpExceptionFilter } from './filters/http-exception.filters';
import { RolesGuard } from './guards/roles.guard';
//import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { databaseConfig } from './common/database/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: databaseConfig,
      inject: [ConfigService],
    }),
    //AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, RequestService,
  // {
  //   provide: 'APP_GUARD',
  //   useClass: AuthGuard,
  // },
  {
    provide: 'APP_INTERCEPTOR',
    scope: Scope.REQUEST,
    useClass: LoggingInterceptor,
  },
  {
    provide: 'APP_PIPE',
    useClass: FreezePipe
  },
  {
    provide: 'APP_FILTER',
    useClass: HttpExceptionFilter,
  },
  {
    provide: 'APP_GUARD',
    useClass: RolesGuard,
  }],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('*');
  }
}
