import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getCaseload(): string {
    return 'This is the caseload API endpoint.';
  }
}
