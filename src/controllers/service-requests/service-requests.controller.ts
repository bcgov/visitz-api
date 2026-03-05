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
  AdditionalInformationIdPathParams,
  AttachmentIdPathParams,
  CallInformationIdPathParams,
  ContactIdPathParams,
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
}
