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
  ApiOkResponse,
  ApiExtraModels,
  getSchemaPath,
  ApiQuery,
  ApiOperation,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ServiceRequestsService } from './service-requests.service';
import {
  NestedSupportNetworkEntity,
  PostSupportNetworkSRResponseExample,
  SupportNetworkEntity,
  SupportNetworkListResponseSRExample,
  SupportNetworkSingleResponseSRExample,
} from '../../entities/support-network.entity';
import {
  ActivityIdPathParams,
  ActivityPlanIdPathParams,
  AdditionalInformationIdPathParams,
  AttachmentIdPathParams,
  CallInformationIdPathParams,
  ContactEducationIdPathParams,
  ContactIdPathParams,
  ContactLanguagesIdPathParams,
  ContactLegalAuthorityIdPathParams,
  ContactMedicalBehavioralIdPathParams,
  IdPathParams,
  ResponseNarrativeIdPathParams,
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
  supportNetworkIdName,
  attachmentIdFieldName,
  responseNarrativeIdName,
  excludeEmptyFieldsParamName,
  checkIdsParamName,
  additionalInformationIdName,
  callInformationIdName,
  contactLanguageIdName,
  contactMedicalBehavioralIdName,
  contactEducationIdName,
  contactLegalAuthorityIdName,
  activityIdName,
  activityPlanIdName,
} from '../../common/constants/parameter-constants';
import { ApiInternalServerErrorEntity } from '../../entities/api-internal-server-error.entity';
import {
  AttachmentDetailsEntity,
  AttachmentDetailsSRExample,
  AttachmentsListResponseSRExample,
  AttachmentsSingleResponseSRExample,
  NestedAttachmentsEntity,
} from '../../entities/attachments.entity';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
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
  ContactsEntity,
  ContactsListResponseSRExample,
  ContactsSingleResponseSRExample,
  NestedContactsEntity,
} from '../../entities/contacts.entity';
import { ApiForbiddenErrorEntity } from '../../entities/api-forbidden-error.entity';
import { ApiUnauthorizedErrorEntity } from '../../entities/api-unauthorized-error.entity';
import { ApiBadRequestErrorEntity } from '../../entities/api-bad-request-error.entity';
import { ApiNotFoundErrorEntity } from '../../entities/api-not-found-error.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  PostAttachmentDto,
  PostAttachmentsSRReturnExample,
} from '../../dto/post-attachment.dto';
import { ApiUnprocessableEntityErrorEntity } from '../../entities/api-unprocessable-entity-error.entity';
import { FileTypeMagicNumberValidator } from '../../helpers/file-validators/file-validators';
import {
  NestedResponseNarrativeEntity,
  ResponseNarrativeEntity,
  ResponseNarrativeListResponseSRExample,
  ResponseNarrativeSingleResponseSRExample,
} from '../../entities/response-narrative.entity';
import {
  NestedAdditionalInformationEntity,
  AdditionalInformationListResponseSRExample,
  AdditionalInformationEntity,
  AdditionalInformationSingleResponseSRExample,
} from '../../entities/additional-information.entity';
import {
  NestedCallInformationEntity,
  CallInformationListResponseSRExample,
  CallInformationEntity,
  CallInformationSingleResponseSRExample,
} from '../../entities/call-information.entity';
import { PostSupportNetworkDto } from '../../dto/post-support-network.dto';
import {
  ContactLanguagesEntity,
  ContactLanguagesListResponseExample,
  ContactLanguagesSingleExample,
  NestedContactLanguagesEntity,
  PostContactLanguagesResponseExample,
} from '../../entities/contact-languages.entity';
import { PostContactLanguagesDto } from '../../dto/post-contact-languages.dto';
import {
  NestedContactMedicalBehavioralEntity,
  ContactMedicalBehavioralListResponseExample,
  ContactMedicalBehavioralEntity,
  ContactMedicalBehavioralSingleExample,
} from '../../entities/contact-medical-behavioral.entity';
import {
  NestedContactEducationEntity,
  ContactEducationListResponseExample,
  ContactEducationEntity,
  ContactEducationSingleExample,
  PostContactEducationResponseExample,
} from '../../entities/contact-education.entity';
import {
  NestedContactLegalAuthorityEntity,
  ContactLegalAuthorityListResponseExample,
  ContactLegalAuthorityEntity,
  ContactLegalAuthoritySingleExample,
} from '../../entities/contact-legals.entity';
import {
  NestedActivitiesEntity,
  ActivitiesListResponseSRExample,
  ActivitiesEntity,
  ActivitiesSingleResponseSRExample,
  PostActivitiesResponseSRExample,
} from '../../entities/activities.entity';
import { PostActivityDto } from '../../dto/post-activity.dto';
import { PostContactEducationDto } from '../../dto/post-contact-education.dto';
import {
  NestedActivityPlanEntity,
  ActivityPlanListResponseSRExample,
  ActivityPlanEntity,
  ActivityPlanSingleResponseSRExample,
  PostActivityPlanResponseSRExample,
} from '../../entities/activity-plan.entity';
import { PostActivityPlanDto } from '../../dto/post-activity-plan.dto';

/*
	Note: The functions for getting multiple srs (/srs) and a single sr by id (/sr/:id)
	are located in the caseload controller file. This is for 2 reasons:
	1. The name for the multi get would conflict with the controller path here 
	(srs vs sr)
	2. The logic mostly utilizies common functions for fetching entities in caseload, including
	different authorization to prevent fetching the parent entity twice.
*/

@Controller('sr')
@UseGuards(AuthGuard)
@ApiNoContentResponse(noContentResponseSwagger)
@ApiBadRequestResponse({ type: ApiBadRequestErrorEntity })
@ApiUnauthorizedResponse({ type: ApiUnauthorizedErrorEntity })
@ApiForbiddenResponse({ type: ApiForbiddenErrorEntity })
@ApiNotFoundResponse({ type: ApiNotFoundErrorEntity })
@ApiInternalServerErrorResponse({ type: ApiInternalServerErrorEntity })
@ApiParam(versionInfo)
export class ServiceRequestsController {
  constructor(private readonly serviceRequestService: ServiceRequestsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/support-network`)
  @ApiOperation({
    description: `Find all Support Network entries related to a given Service Request entity by Service Request id.`,
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
            value: SupportNetworkListResponseSRExample,
          },
        },
      },
    },
  })
  async getListSRSupportNetworkInformationRecord(
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
    return await this.serviceRequestService.getListSRSupportNetworkInformationRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
      filter,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/support-network/:${supportNetworkIdName}`)
  @ApiOperation({
    description: `Displays the single ${supportNetworkIdName} result if it is related to the given Service Request id.`,
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
            value: SupportNetworkSingleResponseSRExample,
          },
        },
      },
    },
  })
  async getSingleSRSupportNetworkInformationRecord(
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
    return await this.serviceRequestService.getSingleSRSupportNetworkInformationRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/attachments`)
  @ApiOperation({
    description:
      'Find all Attachments metadata entries related to a given Service Request entity by Service Request id.',
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
            value: AttachmentsListResponseSRExample,
          },
        },
      },
    },
  })
  async getSingleSRAttachmentRecord(
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
    return await this.serviceRequestService.getSingleSRAttachmentRecord(
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
      'Download an Attachment or retrieve metadata related to a given Service Request Id by its Attachment Id.',
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
            value: AttachmentDetailsSRExample,
          },
          AttachmentDetailsNoDownloadResponse: {
            value: AttachmentsSingleResponseSRExample,
          },
        },
      },
    },
  })
  async getSingleSRAttachmentDetailsRecord(
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
    return await this.serviceRequestService.getSingleSRAttachmentDetailsRecord(
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
    description: 'Upload an attachment related to the given sr id.',
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
            value: PostAttachmentsSRReturnExample,
          },
        },
      },
    },
  })
  @ApiUnprocessableEntityResponse({ type: ApiUnprocessableEntityErrorEntity })
  async postSingleSRAttachmentRecord(
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
    return await this.serviceRequestService.postSingleSRAttachmentRecord(
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
      'Find all Contact entries related to a given Service Request entity by Service Request id.',
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
            value: ContactsListResponseSRExample,
          },
        },
      },
    },
  })
  async getListSRContactRecord(
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
    return await this.serviceRequestService.getListSRContactRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
      filter,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/contacts/:${contactIdName}`)
  @ApiOperation({
    description: `Displays the single ${contactIdName} result if it is related to the given Service Request id.`,
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
            value: ContactsSingleResponseSRExample,
          },
        },
      },
    },
  })
  async getSingleSRContactRecord(
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
    return await this.serviceRequestService.getSingleSRContactRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/response-narratives`)
  @ApiOperation({
    description: `Find all Response Narrative entries related to a given Service Request entity by Service Request id.`,
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
            value: ResponseNarrativeListResponseSRExample,
          },
        },
      },
    },
  })
  async getListSRResponseNarrativeRecord(
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
    return await this.serviceRequestService.getListSRResponseNarrativeRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
      filter,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/response-narratives/:${responseNarrativeIdName}`)
  @ApiOperation({
    description: `Displays the single ${responseNarrativeIdName} result if it is related to the given Service Request id.`,
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
            value: ResponseNarrativeSingleResponseSRExample,
          },
        },
      },
    },
  })
  async getSingleSRResponseNarrativeRecord(
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
    return await this.serviceRequestService.getSingleSRResponseNarrativeRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/call-information`)
  @ApiOperation({
    description: `Find all call information entries related to a given Service Request entity by Service Request id.`,
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
            value: CallInformationListResponseSRExample,
          },
        },
      },
    },
  })
  async getListSRCallInformationRecord(
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
    return await this.serviceRequestService.getListSRCallInformationRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
      filter,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/call-information/:${callInformationIdName}`)
  @ApiOperation({
    description: `Displays the single ${callInformationIdName} result if it is related to the given Service Request id.`,
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
            value: CallInformationSingleResponseSRExample,
          },
        },
      },
    },
  })
  async getSingleSRCallInformationRecord(
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
    return await this.serviceRequestService.getSingleSRCallInformationRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/additional-information`)
  @ApiOperation({
    description: `Find all additional information entries related to a given Service Request entity by Service Request id.`,
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
            value: AdditionalInformationListResponseSRExample,
          },
        },
      },
    },
  })
  async getListSRAdditionalInformationRecord(
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
    return await this.serviceRequestService.getListSRAdditionalInformationRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
      filter,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/additional-information/:${additionalInformationIdName}`)
  @ApiOperation({
    description: `Displays the single ${additionalInformationIdName} result if it is related to the given Service Request id.`,
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
            value: AdditionalInformationSingleResponseSRExample,
          },
        },
      },
    },
  })
  async getSingleSRAdditionalInformationRecord(
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
    return await this.serviceRequestService.getSingleSRAdditionalInformationRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post(`:${idName}/support-network`)
  @ApiOperation({
    description:
      'Create a support network record related to the given Service Request id.',
  })
  @ApiCreatedResponse({
    content: {
      [CONTENT_TYPE]: {
        examples: {
          SupportNetworkCreatedResponse: {
            value: PostSupportNetworkSRResponseExample,
          },
        },
      },
    },
  })
  async postSingleSRSupportNetworkRecord(
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
    return await this.serviceRequestService.postSingleSRSupportNetworkRecord(
      supportNetworkDto,
      req.headers[idirUsernameHeaderField] as string,
      id,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/contacts/:${contactIdName}/languages`)
  @ApiOperation({
    description:
      'Find all Contact Language entries related to a given Service Request and contact entity by Service Request and contact id.',
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
  async getListSRContactLanguagesRecord(
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
    return await this.serviceRequestService.getListSRContactLanguagesRecord(
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
    description: `Displays the single ${contactLanguageIdName} result if it is related to the given Service Request and contact id.`,
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
  async getSingleSRContactLanguagesRecord(
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
    return await this.serviceRequestService.getSingleSRContactLanguagesRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post(`:${idName}/contacts/:${contactIdName}/languages`)
  @ApiOperation({
    description:
      'Create a contact language record related to the given service request and contact id.',
  })
  @ApiCreatedResponse({
    content: {
      [CONTENT_TYPE]: {
        examples: {
          ContactLanguagesCreatedResponse: {
            value: PostContactLanguagesResponseExample,
          },
        },
      },
    },
  })
  async postSingleSRContactLanguagesRecord(
    @Req() req: Request,
    @Body(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        whitelist: true,
      }),
    )
    contactLanguagesDto: PostContactLanguagesDto,
    @Param(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    id: ContactIdPathParams,
  ): Promise<NestedContactLanguagesEntity> {
    return await this.serviceRequestService.postSingleSRContactLanguagesRecord(
      contactLanguagesDto,
      req.headers[idirUsernameHeaderField] as string,
      id,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/contacts/:${contactIdName}/medical-behavioral`)
  @ApiOperation({
    description:
      'Find all Contact Medical Behavioral entries related to a given Service Request and contact entity by Service Request and contact id.',
  })
  @ApiQuery({ name: afterParamName, required: false })
  @ApiQuery({ name: recordCountNeededParamName, required: false })
  @ApiQuery({ name: pageSizeParamName, required: false })
  @ApiQuery({ name: startRowNumParamName, required: false })
  @ApiQuery({ name: excludeEmptyFieldsParamName, required: false })
  @ApiQuery({ name: checkIdsParamName, required: false, type: 'string' })
  @ApiExtraModels(NestedContactMedicalBehavioralEntity)
  @ApiOkResponse({
    headers: existingIdsRecordCountHeadersSwagger,
    content: {
      [CONTENT_TYPE]: {
        schema: {
          $ref: getSchemaPath(NestedContactMedicalBehavioralEntity),
        },
        examples: {
          ContactMedicalBehavioralListResponse: {
            value: ContactMedicalBehavioralListResponseExample,
          },
        },
      },
    },
  })
  async getListSRContactMedicalBehavioralRecord(
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
  ): Promise<NestedContactMedicalBehavioralEntity> {
    return await this.serviceRequestService.getListSRContactMedicalBehavioralRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
      filter,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(
    `:${idName}/contacts/:${contactIdName}/medical-behavioral/:${contactMedicalBehavioralIdName}`,
  )
  @ApiOperation({
    description: `Displays the single ${contactMedicalBehavioralIdName} result if it is related to the given Service Request and contact id.`,
  })
  @ApiExtraModels(ContactMedicalBehavioralEntity)
  @ApiOkResponse({
    content: {
      [CONTENT_TYPE]: {
        schema: {
          $ref: getSchemaPath(ContactMedicalBehavioralEntity),
        },
        examples: {
          ContactMedicalBehavioralSingleResponse: {
            value: ContactMedicalBehavioralSingleExample,
          },
        },
      },
    },
  })
  async getSingleSRContactMedicalBehavioralRecord(
    @Req() req: Request,
    @Param(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    id: ContactMedicalBehavioralIdPathParams,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ContactMedicalBehavioralEntity> {
    return await this.serviceRequestService.getSingleSRContactMedicalBehavioralRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
    );
  }
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/contacts/:${contactIdName}/education`)
  @ApiOperation({
    description:
      'Find all Contact Education entries related to a given Service Request and contact entity by Service Request and contact id.',
  })
  @ApiQuery({ name: afterParamName, required: false })
  @ApiQuery({ name: recordCountNeededParamName, required: false })
  @ApiQuery({ name: pageSizeParamName, required: false })
  @ApiQuery({ name: startRowNumParamName, required: false })
  @ApiQuery({ name: excludeEmptyFieldsParamName, required: false })
  @ApiQuery({ name: checkIdsParamName, required: false, type: 'string' })
  @ApiExtraModels(NestedContactEducationEntity)
  @ApiOkResponse({
    headers: existingIdsRecordCountHeadersSwagger,
    content: {
      [CONTENT_TYPE]: {
        schema: {
          $ref: getSchemaPath(NestedContactEducationEntity),
        },
        examples: {
          ContactEducationListResponse: {
            value: ContactEducationListResponseExample,
          },
        },
      },
    },
  })
  async getListSRContactEducationRecord(
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
  ): Promise<NestedContactEducationEntity> {
    return await this.serviceRequestService.getListSRContactEducationRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
      filter,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(
    `:${idName}/contacts/:${contactIdName}/education/:${contactEducationIdName}`,
  )
  @ApiOperation({
    description: `Displays the single ${contactEducationIdName} result if it is related to the given Service Request and contact id.`,
  })
  @ApiExtraModels(ContactEducationEntity)
  @ApiOkResponse({
    content: {
      [CONTENT_TYPE]: {
        schema: {
          $ref: getSchemaPath(ContactEducationEntity),
        },
        examples: {
          ContactEducationSingleResponse: {
            value: ContactEducationSingleExample,
          },
        },
      },
    },
  })
  async getSingleSRContactEducationRecord(
    @Req() req: Request,
    @Param(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    id: ContactEducationIdPathParams,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ContactEducationEntity> {
    return await this.serviceRequestService.getSingleSRContactEducationRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post(`:${idName}/contacts/:${contactIdName}/education`)
  @ApiOperation({
    description:
      'Create a contact education record related to the given SR and contact id.',
  })
  @ApiCreatedResponse({
    content: {
      [CONTENT_TYPE]: {
        examples: {
          ContactEducationCreatedResponse: {
            value: PostContactEducationResponseExample,
          },
        },
      },
    },
  })
  async postSingleSRContactEducationRecord(
    @Req() req: Request,
    @Body(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        whitelist: true,
      }),
    )
    contactEducationDto: PostContactEducationDto,
    @Param(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    id: ContactIdPathParams,
  ): Promise<ContactEducationEntity> {
    return await this.serviceRequestService.postSingleSRContactEducationRecord(
      contactEducationDto,
      req.headers[idirUsernameHeaderField] as string,
      id,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/contacts/:${contactIdName}/legal-authorities`)
  @ApiOperation({
    description:
      'Find all Contact Legal Authority entries related to a given SR and contact entity by SR and contact id.',
  })
  @ApiQuery({ name: afterParamName, required: false })
  @ApiQuery({ name: recordCountNeededParamName, required: false })
  @ApiQuery({ name: pageSizeParamName, required: false })
  @ApiQuery({ name: startRowNumParamName, required: false })
  @ApiQuery({ name: excludeEmptyFieldsParamName, required: false })
  @ApiQuery({ name: checkIdsParamName, required: false, type: 'string' })
  @ApiExtraModels(NestedContactLegalAuthorityEntity)
  @ApiOkResponse({
    headers: existingIdsRecordCountHeadersSwagger,
    content: {
      [CONTENT_TYPE]: {
        schema: {
          $ref: getSchemaPath(NestedContactLegalAuthorityEntity),
        },
        examples: {
          ContactLegalAuthorityListResponse: {
            value: ContactLegalAuthorityListResponseExample,
          },
        },
      },
    },
  })
  async getListSRContactLegalAuthorityRecord(
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
  ): Promise<NestedContactLegalAuthorityEntity> {
    return await this.serviceRequestService.getListSRContactLegalAuthorityRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
      filter,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(
    `:${idName}/contacts/:${contactIdName}/legal-authorities/:${contactLegalAuthorityIdName}`,
  )
  @ApiOperation({
    description: `Displays the single ${contactLegalAuthorityIdName} result if it is related to the given SR and contact id.`,
  })
  @ApiExtraModels(ContactLegalAuthorityEntity)
  @ApiOkResponse({
    content: {
      [CONTENT_TYPE]: {
        schema: {
          $ref: getSchemaPath(ContactLegalAuthorityEntity),
        },
        examples: {
          ContactLegalAuthoritySingleResponse: {
            value: ContactLegalAuthoritySingleExample,
          },
        },
      },
    },
  })
  async getSingleSRContactLegalAuthorityRecord(
    @Req() req: Request,
    @Param(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    id: ContactLegalAuthorityIdPathParams,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ContactLegalAuthorityEntity> {
    return await this.serviceRequestService.getSingleSRContactLegalAuthorityRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/activities`)
  @ApiOperation({
    description:
      'Find all Activity entries related to a given SR entity by SR id.',
  })
  @ApiQuery({ name: afterParamName, required: false })
  @ApiQuery({ name: recordCountNeededParamName, required: false })
  @ApiQuery({ name: pageSizeParamName, required: false })
  @ApiQuery({ name: startRowNumParamName, required: false })
  @ApiQuery({ name: excludeEmptyFieldsParamName, required: false })
  @ApiQuery({ name: checkIdsParamName, required: false, type: 'string' })
  @ApiExtraModels(NestedActivitiesEntity)
  @ApiNoContentResponse(noContentResponseSwagger)
  @ApiOkResponse({
    headers: existingIdsRecordCountHeadersSwagger,
    content: {
      [CONTENT_TYPE]: {
        schema: {
          $ref: getSchemaPath(NestedActivitiesEntity),
        },
        examples: {
          ActivitiesListResponse: {
            value: ActivitiesListResponseSRExample,
          },
        },
      },
    },
  })
  async getListSRActivityRecord(
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
  ): Promise<NestedActivitiesEntity> {
    return await this.serviceRequestService.getListSRActivityRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
      filter,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/activities/:${activityIdName}`)
  @ApiOperation({
    description: `Displays the single ${activityIdName} result if it is related to the given SR id.`,
  })
  @ApiExtraModels(ActivitiesEntity)
  @ApiNoContentResponse(noContentResponseSwagger)
  @ApiOkResponse({
    content: {
      [CONTENT_TYPE]: {
        schema: {
          $ref: getSchemaPath(ActivitiesEntity),
        },
        examples: {
          ActivitiesSingleResponse: {
            value: ActivitiesSingleResponseSRExample,
          },
        },
      },
    },
  })
  async getSingleSRActivityRecord(
    @Req() req: Request,
    @Param(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    id: ActivityIdPathParams,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ActivitiesEntity> {
    return await this.serviceRequestService.getSingleSRActivityRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post(`:${idName}/activities`)
  @ApiOperation({
    description: 'Create an activity record related to the given SR id.',
  })
  @ApiCreatedResponse({
    content: {
      [CONTENT_TYPE]: {
        examples: {
          ActivityCreatedResponse: {
            value: PostActivitiesResponseSRExample,
          },
        },
      },
    },
  })
  async postSingleSRActivityRecord(
    @Req() req: Request,
    @Body(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        whitelist: true,
      }),
    )
    inPersonVisitDto: PostActivityDto,
    @Param(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    id: IdPathParams,
  ): Promise<ActivitiesEntity> {
    return await this.serviceRequestService.postSingleSRActivityRecord(
      inPersonVisitDto,
      req.headers[idirUsernameHeaderField] as string,
      id,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/activity-plans`)
  @ApiOperation({
    description:
      'Find all Activity Plan entries related to a given SR entity by SR id.',
  })
  @ApiQuery({ name: afterParamName, required: false })
  @ApiQuery({ name: recordCountNeededParamName, required: false })
  @ApiQuery({ name: pageSizeParamName, required: false })
  @ApiQuery({ name: startRowNumParamName, required: false })
  @ApiQuery({ name: excludeEmptyFieldsParamName, required: false })
  @ApiQuery({ name: checkIdsParamName, required: false, type: 'string' })
  @ApiExtraModels(NestedActivityPlanEntity)
  @ApiNoContentResponse(noContentResponseSwagger)
  @ApiOkResponse({
    headers: existingIdsRecordCountHeadersSwagger,
    content: {
      [CONTENT_TYPE]: {
        schema: {
          $ref: getSchemaPath(NestedActivityPlanEntity),
        },
        examples: {
          ActivityPlanListResponse: {
            value: ActivityPlanListResponseSRExample,
          },
        },
      },
    },
  })
  async getListSRActivityPlanRecord(
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
  ): Promise<NestedActivityPlanEntity> {
    return await this.serviceRequestService.getListSRActivityPlanRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
      filter,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/activity-plans/:${activityPlanIdName}`)
  @ApiOperation({
    description: `Displays the single ${activityPlanIdName} result if it is related to the given SR id.`,
  })
  @ApiExtraModels(ActivityPlanEntity)
  @ApiNoContentResponse(noContentResponseSwagger)
  @ApiOkResponse({
    content: {
      [CONTENT_TYPE]: {
        schema: {
          $ref: getSchemaPath(ActivityPlanEntity),
        },
        examples: {
          ActivityPlanSingleResponse: {
            value: ActivityPlanSingleResponseSRExample,
          },
        },
      },
    },
  })
  async getSingleSRActivityPlanRecord(
    @Req() req: Request,
    @Param(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    id: ActivityPlanIdPathParams,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ActivityPlanEntity> {
    return await this.serviceRequestService.getSingleSRActivityPlanRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post(`:${idName}/activity-plans`)
  @ApiOperation({
    description: 'Create an activity plan record related to the given SR id.',
  })
  @ApiCreatedResponse({
    content: {
      [CONTENT_TYPE]: {
        examples: {
          ActivityPlanCreatedResponse: {
            value: PostActivityPlanResponseSRExample,
          },
        },
      },
    },
  })
  async postSingleSRActivityPlanRecord(
    @Req() req: Request,
    @Body(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        whitelist: true,
      }),
    )
    activityPlanDto: PostActivityPlanDto,
    @Param(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    id: IdPathParams,
  ): Promise<ActivityPlanEntity> {
    return await this.serviceRequestService.postSingleSRActivityPlanRecord(
      activityPlanDto,
      req.headers[idirUsernameHeaderField] as string,
      id,
    );
  }
}
