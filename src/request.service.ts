import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class RequestService {
  private requestId: string;
  setUserId(userId: string) {
    this.requestId = userId;
  }
  getUserId(): string {
    return this.requestId;
  }
}
