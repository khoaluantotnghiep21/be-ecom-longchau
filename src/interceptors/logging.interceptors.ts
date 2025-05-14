import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { RequestService } from 'src/request.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);
  constructor(private readonly requestService: RequestService) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const useAgent = request.get('user-agent') || '';
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { ip, method, path: url } = request;
    this.logger.log(`
            ${method} ${url} ${useAgent} ${ip}: ${context.getClass().name}
             ${context.getHandler().name} invoked ...
             `);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    this.logger.debug('userId:', request.user?.userid);
    const now = Date.now();
    return next.handle().pipe(
      tap((res) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const response = context.switchToHttp().getResponse();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { statusCode } = response;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        const contentLength = response.get('content-length') || 0;
        this.logger.log(`
                    ${method} ${url} ${statusCode} ${contentLength} - ${useAgent} ${ip}: ${
                      Date.now() - now
                    }ms
                    `);
        this.logger.debug('Respone:', res);
      }),
    );
  }
}
