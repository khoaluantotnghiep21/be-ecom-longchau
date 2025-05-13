import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  
  @Injectable()
  export class RequestSuccessInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const ctx = context.switchToHttp();
      const response = ctx.getResponse();
      const request = ctx.getRequest();
  
      return next.handle().pipe(
        map((data) => ({
          statusCode: response.statusCode,
          message: 'Request Successfully',
          timestamp: new Date().toISOString(),
          path: request.url,
          data,
        })),
      );
    }
  }
  