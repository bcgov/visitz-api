import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WorkflowAuthService } from './workflow-auth.service';

@Injectable()
export class WorkflowAuthGuard implements CanActivate {
  skip;
  private readonly logger = new Logger(WorkflowAuthGuard.name);
  constructor(
    private readonly workflowAuthService: WorkflowAuthService,
    private readonly configService: ConfigService,
  ) {
    this.skip = this.configService.get('skipAuthGuard');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.skip) {
      // skip for local development
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const isAuthorized =
      await this.workflowAuthService.getRecordAndValidate(request);
    if (isAuthorized) {
      this.logger.log({ msg: `Auth status: 200`, authStatusCode: 200 });
    } else {
      this.logger.log({ msg: `Auth status: 403`, authStatusCode: 403 });
    }
    return isAuthorized;
  }
}
