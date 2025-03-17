import { Controller, Get, Req } from '@nestjs/common';
import {
  ApiParam,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { versionInfo } from '../../common/constants/swagger-constants';
import { ApiForbiddenErrorEntity } from '../../entities/api-forbidden-error.entity';
import { ApiInternalServerErrorEntity } from '../../entities/api-internal-server-error.entity';
import { ApiUnauthorizedErrorEntity } from '../../entities/api-unauthorized-error.entity';
import { idirUsernameHeaderField } from '../../common/constants/upstream-constants';
import { ExternalAuthService } from './external-auth.service';
import { Request } from 'express';

@Controller('check-authorization')
@ApiParam(versionInfo)
@ApiUnauthorizedResponse({ type: ApiUnauthorizedErrorEntity })
@ApiForbiddenResponse({ type: ApiForbiddenErrorEntity })
@ApiInternalServerErrorResponse({ type: ApiInternalServerErrorEntity })
export class ExternalAuthController {
  constructor(private readonly externalAuthService: ExternalAuthService) {}

  @Get('/')
  @ApiOperation({
    description:
      `Gives the employment status of the employee making the request and caches it. ` +
      `If return status is 200, employee is active. If return status is 403, employee is not active or not found.`,
  })
  @ApiOkResponse({
    description: 'Empty body. Employee is active.',
  })
  async checkAuthorizationEmployeeStatus(@Req() req: Request): Promise<void> {
    return await this.externalAuthService.checkEmployeeStatusUpstream(
      req.headers[idirUsernameHeaderField] as string,
    );
  }
}
