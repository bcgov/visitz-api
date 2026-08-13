import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
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
  checkIdsParamName,
  entityScopeParamName,
  excludeEmptyFieldsParamName,
  idName,
  incidentIncludeParam,
  memoIncludeParam,
  srIncludeParam,
} from '../../common/constants/parameter-constants';
import {
  versionInfo,
  noContentResponseSwagger,
  existingIdsRecordCountHeadersSwagger,
} from '../../common/constants/swagger-constants';
import {
  idirUsernameHeaderField,
  pageSizeParamName,
  recordCountNeededParamName,
  startRowNumParamName,
} from '../../common/constants/upstream-constants';
import {
  CaseloadQueryParams,
  EntityQueryParams,
} from '../../dto/filter-query-params.dto';
import { IdPathParams } from '../../dto/id-path-params.dto';
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
import {
  NestedSREntity,
  SRListResponseExample,
} from '../../entities/sr.entity';
import {
  NestedCaseEntity,
  CaseListResponseExample,
} from '../../entities/case.entity';
import {
  NestedIncidentEntity,
  IncidentListResponseExample,
} from '../../entities/incident.entity';
import {
  NestedMemoEntity,
  MemoListResponseExample,
} from '../../entities/memo.entity';
import { Request, Response } from 'express';
import { ExternalAuthService } from '../external-auth/external-auth.service';
import { EntityScope, RecordType } from '../../common/constants/enumerations';

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
  @ApiQuery({ name: recordCountNeededParamName, required: false })
  @ApiQuery({ name: pageSizeParamName, required: false })
  @ApiQuery({ name: startRowNumParamName, required: false })
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
  ): Promise<CaseloadEntity> {
    await this.externalAuthService.checkEmployeeStatusUpstream(req); // auth check
    return await this.caseloadService.getCaseload(
      req.headers[idirUsernameHeaderField] as string, // this will be set by the jwt in the previous auth check
      req,
      res,
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

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('srs')
  @ApiOperation({
    description: `Displays the service request details related to the user's IDIR, or their assigned office(s)`,
  })
  @ApiQuery({ name: afterParamName, required: false })
  @ApiQuery({ name: excludeEmptyFieldsParamName, required: false })
  @ApiQuery({ name: recordCountNeededParamName, required: false })
  @ApiQuery({ name: pageSizeParamName, required: false })
  @ApiQuery({ name: startRowNumParamName, required: false })
  @ApiQuery({ name: entityScopeParamName, required: false })
  @ApiQuery({ name: checkIdsParamName, required: false, type: 'string' })
  @ApiExtraModels(NestedSREntity)
  @ApiNoContentResponse(noContentResponseSwagger)
  @ApiOkResponse({
    headers: existingIdsRecordCountHeadersSwagger,
    content: {
      [CONTENT_TYPE]: {
        schema: {
          $ref: getSchemaPath(NestedSREntity),
        },
        examples: {
          SRListResponse: {
            value: SRListResponseExample,
          },
        },
      },
    },
  })
  async getSrs(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
          exposeDefaultValues: true,
        },
        forbidNonWhitelisted: true,
      }),
    )
    filter?: EntityQueryParams,
  ): Promise<NestedSREntity> {
    const officeNames =
      await this.externalAuthService.checkEmployeeStatusUpstream(req); // auth check
    return (await this.caseloadService.getSingleEntityType(
      req.headers[idirUsernameHeaderField] as string, // this will be set by the jwt in the previous auth check
      req,
      res,
      RecordType.SR,
      filter?.[entityScopeParamName] === EntityScope.Office
        ? officeNames
        : undefined,
      filter,
    )) as NestedSREntity;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`sr/:${idName}`)
  @ApiOperation({
    description: `Displays the service request details for the given sr id.`,
  })
  @ApiExtraModels(NestedSREntity)
  @ApiNoContentResponse(noContentResponseSwagger)
  @ApiOkResponse({
    content: {
      [CONTENT_TYPE]: {
        schema: {
          $ref: getSchemaPath(NestedSREntity),
        },
        examples: {
          SRListResponse: {
            value: SRListResponseExample,
          },
        },
      },
    },
  })
  async getSrById(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    idParam: IdPathParams,
  ): Promise<NestedSREntity> {
    const officeNames =
      await this.externalAuthService.checkEmployeeStatusUpstream(req); // auth check
    return (await this.caseloadService.getEntityById(
      req.headers[idirUsernameHeaderField] as string, // this will be set by the jwt in the previous auth check
      idParam[idName],
      req,
      res,
      RecordType.SR,
      officeNames,
    )) as NestedSREntity;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('cases')
  @ApiOperation({
    description: `Displays the case details related to the user's IDIR, or their assigned office(s)`,
  })
  @ApiQuery({ name: afterParamName, required: false })
  @ApiQuery({ name: excludeEmptyFieldsParamName, required: false })
  @ApiQuery({ name: recordCountNeededParamName, required: false })
  @ApiQuery({ name: pageSizeParamName, required: false })
  @ApiQuery({ name: startRowNumParamName, required: false })
  @ApiQuery({ name: entityScopeParamName, required: false })
  @ApiQuery({ name: checkIdsParamName, required: false, type: 'string' })
  @ApiExtraModels(NestedCaseEntity)
  @ApiNoContentResponse(noContentResponseSwagger)
  @ApiOkResponse({
    headers: existingIdsRecordCountHeadersSwagger,
    content: {
      [CONTENT_TYPE]: {
        schema: {
          $ref: getSchemaPath(NestedCaseEntity),
        },
        examples: {
          CaseListResponse: {
            value: CaseListResponseExample,
          },
        },
      },
    },
  })
  async getCases(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
          exposeDefaultValues: true,
        },
        forbidNonWhitelisted: true,
      }),
    )
    filter?: EntityQueryParams,
  ): Promise<NestedCaseEntity> {
    const officeNames =
      await this.externalAuthService.checkEmployeeStatusUpstream(req); // auth check
    return (await this.caseloadService.getSingleEntityType(
      req.headers[idirUsernameHeaderField] as string, // this will be set by the jwt in the previous auth check
      req,
      res,
      RecordType.Case,
      filter?.[entityScopeParamName] === EntityScope.Office
        ? officeNames
        : undefined,
      filter,
    )) as NestedCaseEntity;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`case/:${idName}`)
  @ApiOperation({
    description: `Displays the case details for the given case id.`,
  })
  @ApiExtraModels(NestedCaseEntity)
  @ApiNoContentResponse(noContentResponseSwagger)
  @ApiOkResponse({
    content: {
      [CONTENT_TYPE]: {
        schema: {
          $ref: getSchemaPath(NestedCaseEntity),
        },
        examples: {
          CaseListResponse: {
            value: CaseListResponseExample,
          },
        },
      },
    },
  })
  async getCaseById(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    idParam: IdPathParams,
  ): Promise<NestedCaseEntity> {
    const officeNames =
      await this.externalAuthService.checkEmployeeStatusUpstream(req); // auth check
    return (await this.caseloadService.getEntityById(
      req.headers[idirUsernameHeaderField] as string, // this will be set by the jwt in the previous auth check
      idParam[idName],
      req,
      res,
      RecordType.Case,
      officeNames,
    )) as NestedCaseEntity;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('incidents')
  @ApiOperation({
    description: `Displays the incident details related to the user's IDIR, or their assigned office(s)`,
  })
  @ApiQuery({ name: afterParamName, required: false })
  @ApiQuery({ name: excludeEmptyFieldsParamName, required: false })
  @ApiQuery({ name: recordCountNeededParamName, required: false })
  @ApiQuery({ name: pageSizeParamName, required: false })
  @ApiQuery({ name: startRowNumParamName, required: false })
  @ApiQuery({ name: entityScopeParamName, required: false })
  @ApiQuery({ name: checkIdsParamName, required: false, type: 'string' })
  @ApiExtraModels(NestedIncidentEntity)
  @ApiNoContentResponse(noContentResponseSwagger)
  @ApiOkResponse({
    headers: existingIdsRecordCountHeadersSwagger,
    content: {
      [CONTENT_TYPE]: {
        schema: {
          $ref: getSchemaPath(NestedIncidentEntity),
        },
        examples: {
          IncidentListResponse: {
            value: IncidentListResponseExample,
          },
        },
      },
    },
  })
  async getIncidents(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
          exposeDefaultValues: true,
        },
        forbidNonWhitelisted: true,
      }),
    )
    filter?: EntityQueryParams,
  ): Promise<NestedIncidentEntity> {
    const officeNames =
      await this.externalAuthService.checkEmployeeStatusUpstream(req); // auth check
    return (await this.caseloadService.getSingleEntityType(
      req.headers[idirUsernameHeaderField] as string, // this will be set by the jwt in the previous auth check
      req,
      res,
      RecordType.Incident,
      filter?.[entityScopeParamName] === EntityScope.Office
        ? officeNames
        : undefined,
      filter,
    )) as NestedIncidentEntity;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`incident/:${idName}`)
  @ApiOperation({
    description: `Displays the incident details for the given incident id.`,
  })
  @ApiExtraModels(NestedIncidentEntity)
  @ApiNoContentResponse(noContentResponseSwagger)
  @ApiOkResponse({
    content: {
      [CONTENT_TYPE]: {
        schema: {
          $ref: getSchemaPath(NestedIncidentEntity),
        },
        examples: {
          IncidentListResponse: {
            value: IncidentListResponseExample,
          },
        },
      },
    },
  })
  async getIncidentById(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    idParam: IdPathParams,
  ): Promise<NestedIncidentEntity> {
    const officeNames =
      await this.externalAuthService.checkEmployeeStatusUpstream(req); // auth check
    return (await this.caseloadService.getEntityById(
      req.headers[idirUsernameHeaderField] as string, // this will be set by the jwt in the previous auth check
      idParam[idName],
      req,
      res,
      RecordType.Incident,
      officeNames,
    )) as NestedIncidentEntity;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('memos')
  @ApiOperation({
    description: `Displays the memo details related to the user's IDIR, or their assigned office(s)`,
  })
  @ApiQuery({ name: afterParamName, required: false })
  @ApiQuery({ name: excludeEmptyFieldsParamName, required: false })
  @ApiQuery({ name: recordCountNeededParamName, required: false })
  @ApiQuery({ name: pageSizeParamName, required: false })
  @ApiQuery({ name: startRowNumParamName, required: false })
  @ApiQuery({ name: entityScopeParamName, required: false })
  @ApiQuery({ name: checkIdsParamName, required: false, type: 'string' })
  @ApiExtraModels(NestedMemoEntity)
  @ApiNoContentResponse(noContentResponseSwagger)
  @ApiOkResponse({
    headers: existingIdsRecordCountHeadersSwagger,
    content: {
      [CONTENT_TYPE]: {
        schema: {
          $ref: getSchemaPath(NestedMemoEntity),
        },
        examples: {
          MemoListResponse: {
            value: MemoListResponseExample,
          },
        },
      },
    },
  })
  async getMemos(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
          exposeDefaultValues: true,
        },
        forbidNonWhitelisted: true,
      }),
    )
    filter?: EntityQueryParams,
  ): Promise<NestedMemoEntity> {
    const officeNames =
      await this.externalAuthService.checkEmployeeStatusUpstream(req); // auth check
    return (await this.caseloadService.getSingleEntityType(
      req.headers[idirUsernameHeaderField] as string, // this will be set by the jwt in the previous auth check
      req,
      res,
      RecordType.Memo,
      filter?.[entityScopeParamName] === EntityScope.Office
        ? officeNames
        : undefined,
      filter,
    )) as NestedMemoEntity;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`memo/:${idName}`)
  @ApiOperation({
    description: `Displays the memo details for the given memo id.`,
  })
  @ApiExtraModels(NestedMemoEntity)
  @ApiNoContentResponse(noContentResponseSwagger)
  @ApiOkResponse({
    content: {
      [CONTENT_TYPE]: {
        schema: {
          $ref: getSchemaPath(NestedMemoEntity),
        },
        examples: {
          MemoListResponse: {
            value: MemoListResponseExample,
          },
        },
      },
    },
  })
  async getMemoById(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    idParam: IdPathParams,
  ): Promise<NestedMemoEntity> {
    const officeNames =
      await this.externalAuthService.checkEmployeeStatusUpstream(req); // auth check
    return (await this.caseloadService.getEntityById(
      req.headers[idirUsernameHeaderField] as string, // this will be set by the jwt in the previous auth check
      idParam[idName],
      req,
      res,
      RecordType.Memo,
      officeNames,
    )) as NestedMemoEntity;
  }
}
