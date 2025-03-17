import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from '../../common/guards/auth/auth.service';

@Injectable()
export class ExternalAuthService {
  constructor(private readonly authService: AuthService) {}
  async checkEmployeeStatusUpstream(idir: string): Promise<void> {
    const status = await this.authService.getEmployeeActiveUpstream(idir);
    if (status === false) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Forbidden',
          message: 'Forbidden resource',
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
