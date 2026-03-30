import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
  getSchemaPath,
} from '@nestjs/swagger';

import { IncidentsService } from './incidents.service';
import {
  NestedSupportNetworkEntity,
  PostSupportNetworkIncidentResponseExample,
  SupportNetworkEntity,
  SupportNetworkListResponseIncidentExample,
  SupportNetworkSingleResponseIncidentExample,
} from '../../entities/support-network.entity';
import {
  AdditionalInformationIdPathParams,
  AttachmentIdPathParams,
  CallInformationIdPathParams,
  ContactIdPathParams,
  ContactLanguagesIdPathParams,
  IdPathParams,
  IncidentConcernIdPathParams,
  ResponseNarrativeIdPathParams,
  SafetyAssessmentIdPathParams,
  SupportNetworkIdPathParams,
} from '../../dto/id-path-params.dto';
import {
  AttachmentDetailsQueryParams,
  CheckIdQueryParams,
} from '../../dto/filter-query-params.dto';
import {
  attachmentIdName,
  contactIdName,
  CONTENT_TYPE,
  idName,
  inlineAttachmentParamName,
  afterParamName,
  safetyAssessmentIdName,
  supportNetworkIdName,
  attachmentIdFieldName,
  responseNarrativeIdName,
  excludeEmptyFieldsParamName,
  checkIdsParamName,
  incidentConcernIdName,
  callInformationIdName,
  additionalInformationIdName,
  contactLanguageIdName,
} from '../../common/constants/parameter-constants';
import { ApiInternalServerErrorEntity } from '../../entities/api-internal-server-error.entity';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import {
  NestedAttachmentsEntity,
  AttachmentsListResponseIncidentExample,
  AttachmentDetailsEntity,
  AttachmentDetailsIncidentExample,
  AttachmentsSingleResponseIncidentExample,
} from '../../entities/attachments.entity';
import { Request, Response } from 'express';
import {
  existingIdsRecordCountHeadersSwagger,
  noContentResponseSwagger,
  totalRecordCountHeadersSwagger,
  versionInfo,
} from '../../common/constants/swagger-constants';
import {
  idirUsernameHeaderField,
  pageSizeParamName,
  recordCountNeededParamName,
  startRowNumParamName,
} from '../../common/constants/upstream-constants';
import {
  NestedContactsEntity,
  ContactsListResponseIncidentExample,
  ContactsEntity,
  ContactsSingleResponseIncidentExample,
} from '../../entities/contacts.entity';
import { ApiUnauthorizedErrorEntity } from '../../entities/api-unauthorized-error.entity';
import { ApiForbiddenErrorEntity } from '../../entities/api-forbidden-error.entity';
import { ApiBadRequestErrorEntity } from '../../entities/api-bad-request-error.entity';
import { ApiNotFoundErrorEntity } from '../../entities/api-not-found-error.entity';
import {
  NestedSafetyAssessmentEntity,
  SafetyAssessmentEntity,
  SafetyAssessmentListResponseIncidentExample,
  SafetyAssessmentSingleResponseIncidentExample,
} from '../../entities/safety-assessment.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  PostAttachmentDto,
  PostAttachmentsIncidentReturnExample,
} from '../../dto/post-attachment.dto';
import { ApiUnprocessableEntityErrorEntity } from '../../entities/api-unprocessable-entity-error.entity';
import { FileTypeMagicNumberValidator } from '../../helpers/file-validators/file-validators';
import {
  NestedResponseNarrativeEntity,
  ResponseNarrativeEntity,
  ResponseNarrativeListResponseIncidentExample,
  ResponseNarrativeSingleResponseIncidentExample,
} from '../../entities/response-narrative.entity';
import {
  IncidentConcernEntity,
  IncidentConcernListResponseExample,
  IncidentConcernSingleExample,
  NestedIncidentConcernEntity,
} from '../../entities/incident-concern.entity';
import {
  NestedCallInformationEntity,
  CallInformationListResponseIncidentExample,
  CallInformationEntity,
  CallInformationSingleResponseIncidentExample,
} from '../../entities/call-information.entity';
import {
  NestedAdditionalInformationEntity,
  AdditionalInformationListResponseIncidentExample,
  AdditionalInformationEntity,
  AdditionalInformationSingleResponseIncidentExample,
} from '../../entities/additional-information.entity';
import { PostSupportNetworkDto } from '../../dto/post-support-network.dto';
import {
  NestedContactLanguagesEntity,
  ContactLanguagesListResponseExample,
  ContactLanguagesEntity,
  ContactLanguagesSingleExample,
} from '../../entities/contact-languages.entity';

@Controller('incident')
@UseGuards(AuthGuard)
@ApiNoContentResponse(noContentResponseSwagger)
@ApiBadRequestResponse({ type: ApiBadRequestErrorEntity })
@ApiUnauthorizedResponse({ type: ApiUnauthorizedErrorEntity })
@ApiForbiddenResponse({ type: ApiForbiddenErrorEntity })
@ApiNotFoundResponse({ type: ApiNotFoundErrorEntity })
@ApiInternalServerErrorResponse({ type: ApiInternalServerErrorEntity })
@ApiParam(versionInfo)
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/support-network`)
  @ApiOperation({
    description: `Find all Support Network entries related to a given Incident entity by Incident id.`,
  })
  @ApiQuery({ name: afterParamName, required: false })
  @ApiQuery({ name: recordCountNeededParamName, required: false })
  @ApiQuery({ name: pageSizeParamName, required: false })
  @ApiQuery({ name: startRowNumParamName, required: false })
  @ApiQuery({ name: excludeEmptyFieldsParamName, required: false })
  @ApiQuery({ name: checkIdsParamName, required: false, type: 'string' })
  @ApiExtraModels(NestedSupportNetworkEntity)
  @ApiOkResponse({
    headers: existingIdsRecordCountHeadersSwagger,
    content: {
      [CONTENT_TYPE]: {
        schema: {
          $ref: getSchemaPath(NestedSupportNetworkEntity),
        },
        examples: {
          SupportNetworkListResponse: {
            value: SupportNetworkListResponseIncidentExample,
          },
        },
      },
    },
  })
  async getListIncidentSupportNetworkInformationRecord(
    @Req() req: Request,
    @Param(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    id: IdPathParams,
    @Res({ passthrough: true }) res: Response,
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
        skipMissingProperties: true,
      }),
    )
    filter?: CheckIdQueryParams,
  ): Promise<NestedSupportNetworkEntity> {
    return await this.incidentsService.getListIncidentSupportNetworkInformationRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
      filter,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/support-network/:${supportNetworkIdName}`)
  @ApiOperation({
    description: `Displays the single ${supportNetworkIdName} result if it is related to the given Incident id.`,
  })
  @ApiExtraModels(SupportNetworkEntity)
  @ApiOkResponse({
    content: {
      [CONTENT_TYPE]: {
        schema: {
          $ref: getSchemaPath(SupportNetworkEntity),
        },
        examples: {
          SupportNetworkSingleResponse: {
            value: SupportNetworkSingleResponseIncidentExample,
          },
        },
      },
    },
  })
  async getSingleIncidentSupportNetworkInformationRecord(
    @Req() req: Request,
    @Param(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    id: SupportNetworkIdPathParams,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SupportNetworkEntity> {
    return await this.incidentsService.getSingleIncidentSupportNetworkInformationRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/attachments`)
  @ApiOperation({
    description:
      'Find all Attachments metadata entries related to a given Incident entity by Incident id.',
  })
  @ApiQuery({ name: afterParamName, required: false })
  @ApiQuery({ name: recordCountNeededParamName, required: false })
  @ApiQuery({ name: pageSizeParamName, required: false })
  @ApiQuery({ name: startRowNumParamName, required: false })
  @ApiQuery({ name: excludeEmptyFieldsParamName, required: false })
  @ApiQuery({ name: checkIdsParamName, required: false, type: 'string' })
  @ApiExtraModels(NestedAttachmentsEntity)
  @ApiOkResponse({
    headers: existingIdsRecordCountHeadersSwagger,
    content: {
      [CONTENT_TYPE]: {
        schema: {
          $ref: getSchemaPath(NestedAttachmentsEntity),
        },
        examples: {
          AttachmentsResponse: {
            value: AttachmentsListResponseIncidentExample,
          },
        },
      },
    },
  })
  async getSingleIncidentAttachmentRecord(
    @Req() req: Request,
    @Param(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    id: IdPathParams,
    @Res({ passthrough: true }) res: Response,
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
        skipMissingProperties: true,
      }),
    )
    filter?: CheckIdQueryParams,
  ): Promise<NestedAttachmentsEntity> {
    return await this.incidentsService.getSingleIncidentAttachmentRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
      filter,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/attachments/:${attachmentIdName}`)
  @ApiOperation({
    description:
      'Download an Attachment related to a given Incident Id by its Attachment Id.',
  })
  @ApiQuery({ name: afterParamName, required: false })
  @ApiQuery({ name: recordCountNeededParamName, required: false })
  @ApiQuery({ name: pageSizeParamName, required: false })
  @ApiQuery({ name: startRowNumParamName, required: false })
  @ApiQuery({ name: excludeEmptyFieldsParamName, required: false })
  @ApiQuery({ name: checkIdsParamName, required: false, type: 'string' })
  @ApiQuery({ name: inlineAttachmentParamName, required: false })
  @ApiExtraModels(AttachmentDetailsEntity)
  @ApiOkResponse({
    headers: totalRecordCountHeadersSwagger,
    content: {
      [CONTENT_TYPE]: {
        schema: {
          $ref: getSchemaPath(AttachmentDetailsEntity),
        },
        examples: {
          AttachmentDetailsDownloadResponse: {
            value: AttachmentDetailsIncidentExample,
          },
          AttachmentDetailsNoDownloadResponse: {
            value: AttachmentsSingleResponseIncidentExample,
          },
        },
      },
    },
  })
  async getSingleIncidentAttachmentDetailsRecord(
    @Req() req: Request,
    @Param(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    id: AttachmentIdPathParams,
    @Res({ passthrough: true }) res: Response,
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
        skipMissingProperties: true,
      }),
    )
    filter?: AttachmentDetailsQueryParams,
  ): Promise<AttachmentDetailsEntity> {
    return await this.incidentsService.getSingleIncidentAttachmentDetailsRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
      filter,
    );
  }

  @UseInterceptors(FileInterceptor(attachmentIdFieldName))
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiConsumes('multipart/form-data')
  @Post(`:${idName}/attachments`)
  @ApiOperation({
    description: 'Upload an attachment related to the given incident id.',
  })
  @ApiBody({
    description: `File and file information. File should be provided in the '${attachmentIdFieldName}' field.`,
    type: PostAttachmentDto,
  })
  @ApiCreatedResponse({
    content: {
      [CONTENT_TYPE]: {
        examples: {
          AttachmentCreatedResponse: {
            value: PostAttachmentsIncidentReturnExample,
          },
        },
      },
    },
  })
  @ApiUnprocessableEntityResponse({ type: ApiUnprocessableEntityErrorEntity })
  async postSingleIncidentAttachmentRecord(
    @Req() req: Request,
    @Body(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        whitelist: true,
      }),
    )
    attachmentDto: PostAttachmentDto,
    @Param(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    id: IdPathParams,
    @UploadedFile(FileTypeMagicNumberValidator())
    file: Express.Multer.File,
  ): Promise<NestedAttachmentsEntity> {
    return await this.incidentsService.postSingleIncidentAttachmentRecord(
      attachmentDto,
      req.headers[idirUsernameHeaderField] as string,
      id,
      file,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/contacts`)
  @ApiOperation({
    description:
      'Find all Contact entries related to a given Incident entity by Incident id.',
  })
  @ApiQuery({ name: afterParamName, required: false })
  @ApiQuery({ name: recordCountNeededParamName, required: false })
  @ApiQuery({ name: pageSizeParamName, required: false })
  @ApiQuery({ name: startRowNumParamName, required: false })
  @ApiQuery({ name: excludeEmptyFieldsParamName, required: false })
  @ApiQuery({ name: checkIdsParamName, required: false, type: 'string' })
  @ApiExtraModels(NestedContactsEntity)
  @ApiOkResponse({
    headers: existingIdsRecordCountHeadersSwagger,
    content: {
      [CONTENT_TYPE]: {
        schema: {
          $ref: getSchemaPath(NestedContactsEntity),
        },
        examples: {
          ContactsListResponse: {
            value: ContactsListResponseIncidentExample,
          },
        },
      },
    },
  })
  async getListIncidentContactRecord(
    @Req() req: Request,
    @Param(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    id: IdPathParams,
    @Res({ passthrough: true }) res: Response,
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
        skipMissingProperties: true,
      }),
    )
    filter?: CheckIdQueryParams,
  ): Promise<NestedContactsEntity> {
    return await this.incidentsService.getListIncidentContactRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
      filter,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/contacts/:${contactIdName}`)
  @ApiOperation({
    description: `Displays the single ${contactIdName} result if it is related to the given Incident id.`,
  })
  @ApiExtraModels(ContactsEntity)
  @ApiOkResponse({
    content: {
      [CONTENT_TYPE]: {
        schema: {
          $ref: getSchemaPath(ContactsEntity),
        },
        examples: {
          ContactsSingleResponse: {
            value: ContactsSingleResponseIncidentExample,
          },
        },
      },
    },
  })
  async getSingleIncidentContactRecord(
    @Req() req: Request,
    @Param(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    id: ContactIdPathParams,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ContactsEntity> {
    return await this.incidentsService.getSingleIncidentContactRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/safety-assessments`)
  @ApiOperation({
    description:
      'Find all SafetyAssessment entries related to a given Incident entity by Incident id.',
  })
  @ApiQuery({ name: afterParamName, required: false })
  @ApiQuery({ name: recordCountNeededParamName, required: false })
  @ApiQuery({ name: pageSizeParamName, required: false })
  @ApiQuery({ name: startRowNumParamName, required: false })
  @ApiQuery({ name: excludeEmptyFieldsParamName, required: false })
  @ApiQuery({ name: checkIdsParamName, required: false, type: 'string' })
  @ApiExtraModels(NestedSafetyAssessmentEntity)
  @ApiOkResponse({
    headers: existingIdsRecordCountHeadersSwagger,
    content: {
      [CONTENT_TYPE]: {
        schema: {
          $ref: getSchemaPath(NestedSafetyAssessmentEntity),
        },
        examples: {
          SafetyAssessmentListResponse: {
            value: SafetyAssessmentListResponseIncidentExample,
          },
        },
      },
    },
  })
  async getListIncidentSafetyAssessmentRecord(
    @Req() req: Request,
    @Param(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    id: IdPathParams,
    @Res({ passthrough: true }) res: Response,
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
        skipMissingProperties: true,
      }),
    )
    filter?: CheckIdQueryParams,
  ): Promise<NestedSafetyAssessmentEntity> {
    return await this.incidentsService.getListIncidentSafetyAssessmentRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
      filter,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/safety-assessments/:${safetyAssessmentIdName}`)
  @ApiOperation({
    description: `Displays the single ${safetyAssessmentIdName} result if it is related to the given Incident id.`,
  })
  @ApiExtraModels(SafetyAssessmentEntity)
  @ApiOkResponse({
    content: {
      [CONTENT_TYPE]: {
        schema: {
          $ref: getSchemaPath(SafetyAssessmentEntity),
        },
        examples: {
          SafetyAssessmentSingleResponse: {
            value: SafetyAssessmentSingleResponseIncidentExample,
          },
        },
      },
    },
  })
  async getSingleIncidentSafetyAssessmentRecord(
    @Req() req: Request,
    @Param(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    id: SafetyAssessmentIdPathParams,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SafetyAssessmentEntity> {
    return await this.incidentsService.getSingleIncidentSafetyAssessmentRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/response-narratives`)
  @ApiOperation({
    description: `Find all Response Narrative entries related to a given Incident entity by Incident id.`,
  })
  @ApiQuery({ name: afterParamName, required: false })
  @ApiQuery({ name: recordCountNeededParamName, required: false })
  @ApiQuery({ name: pageSizeParamName, required: false })
  @ApiQuery({ name: startRowNumParamName, required: false })
  @ApiQuery({ name: excludeEmptyFieldsParamName, required: false })
  @ApiQuery({ name: checkIdsParamName, required: false, type: 'string' })
  @ApiExtraModels(NestedResponseNarrativeEntity)
  @ApiOkResponse({
    headers: existingIdsRecordCountHeadersSwagger,
    content: {
      [CONTENT_TYPE]: {
        schema: {
          $ref: getSchemaPath(NestedResponseNarrativeEntity),
        },
        examples: {
          ResponseNarrativeListResponse: {
            value: ResponseNarrativeListResponseIncidentExample,
          },
        },
      },
    },
  })
  async getListIncidentResponseNarrativeRecord(
    @Req() req: Request,
    @Param(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    id: IdPathParams,
    @Res({ passthrough: true }) res: Response,
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
        skipMissingProperties: true,
      }),
    )
    filter?: CheckIdQueryParams,
  ): Promise<NestedResponseNarrativeEntity> {
    return await this.incidentsService.getListIncidentResponseNarrativeRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
      filter,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/response-narratives/:${responseNarrativeIdName}`)
  @ApiOperation({
    description: `Displays the single ${responseNarrativeIdName} result if it is related to the given Incident id.`,
  })
  @ApiExtraModels(ResponseNarrativeEntity)
  @ApiOkResponse({
    content: {
      [CONTENT_TYPE]: {
        schema: {
          $ref: getSchemaPath(ResponseNarrativeEntity),
        },
        examples: {
          ResponseNarrativeSingleResponse: {
            value: ResponseNarrativeSingleResponseIncidentExample,
          },
        },
      },
    },
  })
  async getSingleIncidentResponseNarrativeRecord(
    @Req() req: Request,
    @Param(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    id: ResponseNarrativeIdPathParams,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseNarrativeEntity> {
    return await this.incidentsService.getSingleIncidentResponseNarrativeRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/concerns`)
  @ApiOperation({
    description: `Find all Incident Concern entries related to a given Incident entity by Incident id.`,
  })
  @ApiQuery({ name: afterParamName, required: false })
  @ApiQuery({ name: recordCountNeededParamName, required: false })
  @ApiQuery({ name: pageSizeParamName, required: false })
  @ApiQuery({ name: startRowNumParamName, required: false })
  @ApiQuery({ name: excludeEmptyFieldsParamName, required: false })
  @ApiQuery({ name: checkIdsParamName, required: false, type: 'string' })
  @ApiExtraModels(NestedIncidentConcernEntity)
  @ApiOkResponse({
    headers: existingIdsRecordCountHeadersSwagger,
    content: {
      [CONTENT_TYPE]: {
        schema: {
          $ref: getSchemaPath(NestedIncidentConcernEntity),
        },
        examples: {
          IncidentConcernListResponse: {
            value: IncidentConcernListResponseExample,
          },
        },
      },
    },
  })
  async getListIncidentConcernRecord(
    @Req() req: Request,
    @Param(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    id: IdPathParams,
    @Res({ passthrough: true }) res: Response,
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
        skipMissingProperties: true,
      }),
    )
    filter?: CheckIdQueryParams,
  ): Promise<NestedIncidentConcernEntity> {
    return await this.incidentsService.getListIncidentConcernRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
      filter,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/concerns/:${incidentConcernIdName}`)
  @ApiOperation({
    description: `Displays the single ${incidentConcernIdName} result if it is related to the given Incident id.`,
  })
  @ApiExtraModels(IncidentConcernEntity)
  @ApiOkResponse({
    content: {
      [CONTENT_TYPE]: {
        schema: {
          $ref: getSchemaPath(IncidentConcernEntity),
        },
        examples: {
          IncidentConcernSingleResponse: {
            value: IncidentConcernSingleExample,
          },
        },
      },
    },
  })
  async getSingleIncidentConcernRecord(
    @Req() req: Request,
    @Param(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    id: IncidentConcernIdPathParams,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IncidentConcernEntity> {
    return await this.incidentsService.getSingleIncidentConcernRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/call-information`)
  @ApiOperation({
    description: `Find all call information entries related to a given Incident entity by Incident id.`,
  })
  @ApiQuery({ name: afterParamName, required: false })
  @ApiQuery({ name: recordCountNeededParamName, required: false })
  @ApiQuery({ name: pageSizeParamName, required: false })
  @ApiQuery({ name: startRowNumParamName, required: false })
  @ApiQuery({ name: excludeEmptyFieldsParamName, required: false })
  @ApiQuery({ name: checkIdsParamName, required: false, type: 'string' })
  @ApiExtraModels(NestedCallInformationEntity)
  @ApiOkResponse({
    headers: existingIdsRecordCountHeadersSwagger,
    content: {
      [CONTENT_TYPE]: {
        schema: {
          $ref: getSchemaPath(NestedCallInformationEntity),
        },
        examples: {
          CallInformationListResponse: {
            value: CallInformationListResponseIncidentExample,
          },
        },
      },
    },
  })
  async getListIncidentCallInformationRecord(
    @Req() req: Request,
    @Param(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    id: IdPathParams,
    @Res({ passthrough: true }) res: Response,
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
        skipMissingProperties: true,
      }),
    )
    filter?: CheckIdQueryParams,
  ): Promise<NestedCallInformationEntity> {
    return await this.incidentsService.getListIncidentCallInformationRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
      filter,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/call-information/:${callInformationIdName}`)
  @ApiOperation({
    description: `Displays the single ${callInformationIdName} result if it is related to the given Incident id.`,
  })
  @ApiExtraModels(CallInformationEntity)
  @ApiOkResponse({
    content: {
      [CONTENT_TYPE]: {
        schema: {
          $ref: getSchemaPath(CallInformationEntity),
        },
        examples: {
          CallInformationSingleResponse: {
            value: CallInformationSingleResponseIncidentExample,
          },
        },
      },
    },
  })
  async getSingleIncidentCallInformationRecord(
    @Req() req: Request,
    @Param(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    id: CallInformationIdPathParams,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CallInformationEntity> {
    return await this.incidentsService.getSingleIncidentCallInformationRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/additional-information`)
  @ApiOperation({
    description: `Find all additional information entries related to a given Incident entity by Incident id.`,
  })
  @ApiQuery({ name: afterParamName, required: false })
  @ApiQuery({ name: recordCountNeededParamName, required: false })
  @ApiQuery({ name: pageSizeParamName, required: false })
  @ApiQuery({ name: startRowNumParamName, required: false })
  @ApiQuery({ name: excludeEmptyFieldsParamName, required: false })
  @ApiQuery({ name: checkIdsParamName, required: false, type: 'string' })
  @ApiExtraModels(NestedAdditionalInformationEntity)
  @ApiOkResponse({
    headers: existingIdsRecordCountHeadersSwagger,
    content: {
      [CONTENT_TYPE]: {
        schema: {
          $ref: getSchemaPath(NestedAdditionalInformationEntity),
        },
        examples: {
          AdditionalInformationListResponse: {
            value: AdditionalInformationListResponseIncidentExample,
          },
        },
      },
    },
  })
  async getListIncidentAdditionalInformationRecord(
    @Req() req: Request,
    @Param(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    id: IdPathParams,
    @Res({ passthrough: true }) res: Response,
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
        skipMissingProperties: true,
      }),
    )
    filter?: CheckIdQueryParams,
  ): Promise<NestedAdditionalInformationEntity> {
    return await this.incidentsService.getListIncidentAdditionalInformationRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
      filter,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/additional-information/:${additionalInformationIdName}`)
  @ApiOperation({
    description: `Displays the single ${additionalInformationIdName} result if it is related to the given Incident id.`,
  })
  @ApiExtraModels(AdditionalInformationEntity)
  @ApiOkResponse({
    content: {
      [CONTENT_TYPE]: {
        schema: {
          $ref: getSchemaPath(AdditionalInformationEntity),
        },
        examples: {
          AdditionalInformationSingleResponse: {
            value: AdditionalInformationSingleResponseIncidentExample,
          },
        },
      },
    },
  })
  async getSingleIncidentAdditionalInformationRecord(
    @Req() req: Request,
    @Param(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    id: AdditionalInformationIdPathParams,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AdditionalInformationEntity> {
    return await this.incidentsService.getSingleIncidentAdditionalInformationRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post(`:${idName}/support-network`)
  @ApiOperation({
    description:
      'Create a support network record related to the given incident id.',
  })
  @ApiCreatedResponse({
    content: {
      [CONTENT_TYPE]: {
        examples: {
          SupportNetworkCreatedResponse: {
            value: PostSupportNetworkIncidentResponseExample,
          },
        },
      },
    },
  })
  async postSingleIncidentSupportNetworkRecord(
    @Req() req: Request,
    @Body(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        whitelist: true,
      }),
    )
    supportNetworkDto: PostSupportNetworkDto,
    @Param(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    id: IdPathParams,
  ): Promise<NestedSupportNetworkEntity> {
    return await this.incidentsService.postSingleIncidentSupportNetworkRecord(
      supportNetworkDto,
      req.headers[idirUsernameHeaderField] as string,
      id,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/contacts/:${contactIdName}/languages`)
  @ApiOperation({
    description:
      'Find all Contact Language entries related to a given Incident and contact entity by Incident and contact id.',
  })
  @ApiQuery({ name: afterParamName, required: false })
  @ApiQuery({ name: recordCountNeededParamName, required: false })
  @ApiQuery({ name: pageSizeParamName, required: false })
  @ApiQuery({ name: startRowNumParamName, required: false })
  @ApiQuery({ name: excludeEmptyFieldsParamName, required: false })
  @ApiQuery({ name: checkIdsParamName, required: false, type: 'string' })
  @ApiExtraModels(NestedContactLanguagesEntity)
  @ApiOkResponse({
    headers: existingIdsRecordCountHeadersSwagger,
    content: {
      [CONTENT_TYPE]: {
        schema: {
          $ref: getSchemaPath(NestedContactLanguagesEntity),
        },
        examples: {
          ContactLanguagesListResponse: {
            value: ContactLanguagesListResponseExample,
          },
        },
      },
    },
  })
  async getListIncidentContactLanguagesRecord(
    @Req() req: Request,
    @Param(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    id: ContactIdPathParams,
    @Res({ passthrough: true }) res: Response,
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
        skipMissingProperties: true,
      }),
    )
    filter?: CheckIdQueryParams,
  ): Promise<NestedContactLanguagesEntity> {
    return await this.incidentsService.getListIncidentContactLanguagesRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
      filter,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(
    `:${idName}/contacts/:${contactIdName}/languages/:${contactLanguageIdName}`,
  )
  @ApiOperation({
    description: `Displays the single ${contactLanguageIdName} result if it is related to the given Incident and contact id.`,
  })
  @ApiExtraModels(ContactLanguagesEntity)
  @ApiOkResponse({
    content: {
      [CONTENT_TYPE]: {
        schema: {
          $ref: getSchemaPath(ContactLanguagesEntity),
        },
        examples: {
          ContactLanguagesSingleResponse: {
            value: ContactLanguagesSingleExample,
          },
        },
      },
    },
  })
  async getSingleIncidentContactLanguagesRecord(
    @Req() req: Request,
    @Param(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    id: ContactLanguagesIdPathParams,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ContactLanguagesEntity> {
    return await this.incidentsService.getSingleIncidentContactLanguagesRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
    );
  }
}
