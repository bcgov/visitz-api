import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  skip;
  private readonly logger = new Logger(AuthGuard.name);
  constructor(
    private readonly authService: AuthService,
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
    const controllerPath =
      Reflect.getMetadata('path', context.getClass()) || '';
    const isAuthorized = await this.authService.getRecordAndValidate(
      request,
      controllerPath,
    );
    if (isAuthorized) {
      this.logger.log({ msg: `Auth status: 200`, authStatusCode: 200 });
    } else {
      this.logger.log({ msg: `Auth status: 403`, authStatusCode: 403 });
    }
    return isAuthorized;
  }
}
