import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  ParseArrayPipe,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { AppLogsService } from './app-logs.service';
import { versionInfo } from '../../common/constants/swagger-constants';
import { ApiBadRequestErrorEntity } from '../../entities/api-bad-request-error.entity';
import { ApiInternalServerErrorEntity } from '../../entities/api-internal-server-error.entity';
import { PostAppLogEntry, PostAppLogsDto } from '../../dto/post-app-logs.dto';

@Controller('app-logs')
@ApiParam(versionInfo)
@ApiBadRequestResponse({ type: ApiBadRequestErrorEntity })
@ApiInternalServerErrorResponse({ type: ApiInternalServerErrorEntity })
export class AppLogsController {
  constructor(private readonly appLogsService: AppLogsService) {}

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
  postAppLogs(
    @Body(new ParseArrayPipe({ items: PostAppLogEntry, whitelist: true }))
    appLogs: PostAppLogsDto,
  ): void {
    this.appLogsService.logAppLogs(appLogs);
  }
}
