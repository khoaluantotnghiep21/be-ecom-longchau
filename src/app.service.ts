import { Injectable, Logger } from '@nestjs/common';
import { RequestService } from './request.service';

@Injectable()
export class AppService {
  constructor(private readonly requestService: RequestService) {}
  private readonly logger = new Logger(AppService.name);
  getHello(): string {
    const userId = this.requestService.getUserId();
    this.logger.log(`User ID from request service: ${userId}`);
    return 'Hello World!';
  }
}
