import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../../common/guards/auth/auth.service';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';
import { idirUsernameHeaderField } from '../../common/constants/upstream-constants';

@Injectable()
export class ExternalAuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly authService: AuthService,
    private readonly utilitiesService: UtilitiesService,
  ) {}

  async checkEmployeeStatusUpstream(req: Request): Promise<string> {
    let idir = ``;
    try {
      idir = this.utilitiesService.grabIdir(req);
      req.headers[idirUsernameHeaderField] = idir; // set header to jwt idir for future use
    } catch {
      this.logger.error(`Idir username not found`);
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Forbidden',
          message: 'Forbidden resource',
        },
        HttpStatus.FORBIDDEN,
      );
    }
    const [status, officeNames] =
      await this.authService.getEmployeeActiveUpstream(idir);
    if (status === false || officeNames === undefined) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Forbidden',
          message: 'Forbidden resource',
        },
        HttpStatus.FORBIDDEN,
      );
    }
    return officeNames;
  }
}
