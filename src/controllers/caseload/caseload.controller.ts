import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  Req,
  Res,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { CaseloadService } from './caseload.service';
import {
  ApiParam,
  ApiOperation,
  ApiExtraModels,
  ApiNoContentResponse,
  ApiOkResponse,
  getSchemaPath,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiQuery,
} from '@nestjs/swagger';
import {
  CONTENT_TYPE,
  afterParamName,
  caseIncludeParam,
  excludeEmptyFieldsParamName,
  incidentIncludeParam,
  memoIncludeParam,
  srIncludeParam,
} from '../../common/constants/parameter-constants';
import {
  versionInfo,
  noContentResponseSwagger,
} from '../../common/constants/swagger-constants';
import {
  idirUsernameHeaderField,
  pageSizeParamName,
  recordCountNeededParamName,
  startRowNumParamName,
} from '../../common/constants/upstream-constants';
import { CaseloadQueryParams } from '../../dto/filter-query-params.dto';
import {
  CaseloadCompleteResponseExample,
  CaseloadEmptyArrayResponseExample,
  CaseloadEntity,
  OfficeCaseloadCompleteResponseExample,
  OfficeCaseloadEmptyArrayResponseExample,
  OfficeCaseloadEntity,
} from '../../entities/caseload.entity';
import { ApiBadRequestErrorEntity } from '../../entities/api-bad-request-error.entity';
import { ApiForbiddenErrorEntity } from '../../entities/api-forbidden-error.entity';
import { ApiInternalServerErrorEntity } from '../../entities/api-internal-server-error.entity';
import { ApiNotFoundErrorEntity } from '../../entities/api-not-found-error.entity';
import { ApiUnauthorizedErrorEntity } from '../../entities/api-unauthorized-error.entity';
import { Request, Response } from 'express';
import { ExternalAuthService } from '../external-auth/external-auth.service';

@Controller('')
@ApiParam(versionInfo)
@ApiBadRequestResponse({ type: ApiBadRequestErrorEntity })
@ApiUnauthorizedResponse({ type: ApiUnauthorizedErrorEntity })
@ApiForbiddenResponse({ type: ApiForbiddenErrorEntity })
@ApiNotFoundResponse({ type: ApiNotFoundErrorEntity })
@ApiInternalServerErrorResponse({ type: ApiInternalServerErrorEntity })
export class CaseloadController {
  constructor(
    private readonly caseloadService: CaseloadService,
    private readonly externalAuthService: ExternalAuthService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('caseload')
  @ApiOperation({
    description: `Displays the case, incident, service request and memo details related to the user's IDIR`,
  })
  @ApiQuery({ name: afterParamName, required: false })
  @ApiQuery({ name: excludeEmptyFieldsParamName, required: false })
  @ApiQuery({ name: caseIncludeParam, required: false })
  @ApiQuery({ name: incidentIncludeParam, required: false })
  @ApiQuery({ name: srIncludeParam, required: false })
  @ApiQuery({ name: memoIncludeParam, required: false })
  @ApiExtraModels(CaseloadEntity)
  @ApiNoContentResponse(noContentResponseSwagger)
  @ApiOkResponse({
    content: {
      [CONTENT_TYPE]: {
        schema: {
          $ref: getSchemaPath(CaseloadEntity),
        },
        examples: {
          CaseloadCompleteResponse: {
            value: CaseloadCompleteResponseExample,
          },
          CaseEmptyArrayResponse: {
            value: CaseloadEmptyArrayResponseExample,
          },
        },
      },
    },
  })
  async getCaseload(
    @Req() req: Request,
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
        skipMissingProperties: true,
      }),
    )
    filter?: CaseloadQueryParams,
  ): Promise<CaseloadEntity> {
    await this.externalAuthService.checkEmployeeStatusUpstream(req); // auth check
    return await this.caseloadService.getCaseload(
      req.headers[idirUsernameHeaderField] as string, // this will be set by the jwt in the previous auth check
      req,
      filter,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('office-caseload')
  @ApiOperation({
    description: `Displays the case, incident, service request and memo details related to the user's assigned office(s)`,
  })
  @ApiQuery({ name: afterParamName, required: false })
  @ApiQuery({ name: recordCountNeededParamName, required: false })
  @ApiQuery({ name: pageSizeParamName, required: false })
  @ApiQuery({ name: startRowNumParamName, required: false })
  @ApiQuery({ name: excludeEmptyFieldsParamName, required: false })
  @ApiQuery({ name: caseIncludeParam, required: false })
  @ApiQuery({ name: incidentIncludeParam, required: false })
  @ApiQuery({ name: srIncludeParam, required: false })
  @ApiQuery({ name: memoIncludeParam, required: false })
  @ApiExtraModels(OfficeCaseloadEntity)
  @ApiNoContentResponse(noContentResponseSwagger)
  @ApiOkResponse({
    content: {
      [CONTENT_TYPE]: {
        schema: {
          $ref: getSchemaPath(OfficeCaseloadEntity),
        },
        examples: {
          CaseloadCompleteResponse: {
            value: OfficeCaseloadCompleteResponseExample,
          },
          CaseEmptyArrayResponse: {
            value: OfficeCaseloadEmptyArrayResponseExample,
          },
        },
      },
    },
  })
  async getOfficeCaseload(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
        skipMissingProperties: true,
      }),
    )
    filter?: CaseloadQueryParams,
  ): Promise<OfficeCaseloadEntity> {
    const officeNames =
      await this.externalAuthService.checkEmployeeStatusUpstream(req); // auth check
    return await this.caseloadService.getOfficeCaseload(
      req.headers[idirUsernameHeaderField] as string, // this will be set by the jwt in the previous auth check
      req,
      res,
      officeNames,
      filter,
    );
  }
}
