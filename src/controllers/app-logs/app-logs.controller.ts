import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  ParseArrayPipe,
  Post,
  Req,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AppLogsService } from './app-logs.service';
import { ExternalAuthService } from '../external-auth/external-auth.service';
import { versionInfo } from '../../common/constants/swagger-constants';
import { ApiBadRequestErrorEntity } from '../../entities/api-bad-request-error.entity';
import { ApiForbiddenErrorEntity } from '../../entities/api-forbidden-error.entity';
import { ApiInternalServerErrorEntity } from '../../entities/api-internal-server-error.entity';
import { PostAppLogEntry, PostAppLogsDto } from '../../dto/post-app-logs.dto';

@Controller('app-logs')
@ApiParam(versionInfo)
@ApiBadRequestResponse({ type: ApiBadRequestErrorEntity })
@ApiForbiddenResponse({ type: ApiForbiddenErrorEntity })
@ApiInternalServerErrorResponse({ type: ApiInternalServerErrorEntity })
export class AppLogsController {
  constructor(
    private readonly appLogsService: AppLogsService,
    private readonly externalAuthService: ExternalAuthService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    description: 'Ingests a batch of app log entries.',
  })
  @ApiBody({
    description: 'Array of app log entries.',
    type: PostAppLogEntry,
    isArray: true,
  })
  @ApiCreatedResponse({ description: 'App logs received.' })
  async postAppLogs(
    @Req() req: Request,
    @Body(new ParseArrayPipe({ items: PostAppLogEntry, whitelist: true }))
    appLogs: PostAppLogsDto,
  ): Promise<void> {
    await this.externalAuthService.checkEmployeeStatusUpstream(req); // auth check
    this.appLogsService.logAppLogs(appLogs);
  }
}
