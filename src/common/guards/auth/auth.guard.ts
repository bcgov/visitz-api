import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  skip;
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
    return await this.authService.getRecordAndValidate(request);
  }
}
