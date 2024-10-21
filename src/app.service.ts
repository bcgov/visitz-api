import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello world! This is the visitz-api.';
  }

  getCaseload(): string {
    return 'This is the caseload API endpoint.';
  }
}
