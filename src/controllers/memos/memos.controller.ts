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
import { MemosService } from './memos.service';
import {
  ApiOperation,
  ApiQuery,
  ApiExtraModels,
  ApiOkResponse,
  getSchemaPath,
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
import {
  idName,
  CONTENT_TYPE,
  afterParamName,
  attachmentIdName,
  contactIdName,
  inlineAttachmentParamName,
  attachmentIdFieldName,
  excludeEmptyFieldsParamName,
  checkIdsParamName,
  additionalInformationIdName,
  callInformationIdName,
  contactLanguageIdName,
  contactMedicalBehavioralIdName,
  contactEducationIdName,
  contactLegalAuthorityIdName,
} from '../../common/constants/parameter-constants';
import {
  AdditionalInformationIdPathParams,
  AttachmentIdPathParams,
  CallInformationIdPathParams,
  ContactEducationIdPathParams,
  ContactIdPathParams,
  ContactLanguagesIdPathParams,
  ContactLegalAuthorityIdPathParams,
  ContactMedicalBehavioralIdPathParams,
  IdPathParams,
} from '../../dto/id-path-params.dto';
import {
  AttachmentDetailsQueryParams,
  CheckIdQueryParams,
} from '../../dto/filter-query-params.dto';
import {
  NestedAttachmentsEntity,
  AttachmentsListResponseMemoExample,
  AttachmentDetailsEntity,
  AttachmentDetailsMemoExample,
  AttachmentsSingleResponseMemoExample,
} from '../../entities/attachments.entity';
import { ApiInternalServerErrorEntity } from '../../entities/api-internal-server-error.entity';
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
  NestedContactsEntity,
  ContactsListResponseMemoExample,
  ContactsEntity,
  ContactsSingleResponseMemoExample,
} from '../../entities/contacts.entity';
import { ApiForbiddenErrorEntity } from '../../entities/api-forbidden-error.entity';
import { ApiUnauthorizedErrorEntity } from '../../entities/api-unauthorized-error.entity';
import { ApiBadRequestErrorEntity } from '../../entities/api-bad-request-error.entity';
import { ApiNotFoundErrorEntity } from '../../entities/api-not-found-error.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  PostAttachmentDto,
  PostAttachmentsMemoReturnExample,
} from '../../dto/post-attachment.dto';
import { ApiUnprocessableEntityErrorEntity } from '../../entities/api-unprocessable-entity-error.entity';
import { FileTypeMagicNumberValidator } from '../../helpers/file-validators/file-validators';
import {
  NestedAdditionalInformationEntity,
  AdditionalInformationListResponseMemoExample,
  AdditionalInformationEntity,
  AdditionalInformationSingleResponseMemoExample,
} from '../../entities/additional-information.entity';
import {
  NestedCallInformationEntity,
  CallInformationListResponseMemoExample,
  CallInformationEntity,
  CallInformationSingleResponseMemoExample,
} from '../../entities/call-information.entity';
import {
  NestedContactLanguagesEntity,
  ContactLanguagesListResponseExample,
  ContactLanguagesEntity,
  ContactLanguagesSingleExample,
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
} from '../../entities/contact-education.entity';
import {
  NestedContactLegalAuthorityEntity,
  ContactLegalAuthorityListResponseExample,
  ContactLegalAuthorityEntity,
  ContactLegalAuthoritySingleExample,
} from '../../entities/contact-legals.entity';

@Controller('memo')
@UseGuards(AuthGuard)
@ApiNoContentResponse(noContentResponseSwagger)
@ApiBadRequestResponse({ type: ApiBadRequestErrorEntity })
@ApiUnauthorizedResponse({ type: ApiUnauthorizedErrorEntity })
@ApiForbiddenResponse({ type: ApiForbiddenErrorEntity })
@ApiNotFoundResponse({ type: ApiNotFoundErrorEntity })
@ApiInternalServerErrorResponse({ type: ApiInternalServerErrorEntity })
@ApiParam(versionInfo)
export class MemosController {
  constructor(private readonly memosService: MemosService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/attachments`)
  @ApiOperation({
    description:
      'Find all Attachments metadata entries related to a given Memo entity by Memo id.',
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
            value: AttachmentsListResponseMemoExample,
          },
        },
      },
    },
  })
  async getSingleMemoAttachmentRecord(
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
    return await this.memosService.getSingleMemoAttachmentRecord(
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
      'Download an Attachment related to a given Memo Id by its Attachment Id.',
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
            value: AttachmentDetailsMemoExample,
          },
          AttachmentDetailsNoDownloadResponse: {
            value: AttachmentsSingleResponseMemoExample,
          },
        },
      },
    },
  })
  async getSingleMemoAttachmentDetailsRecord(
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
    return await this.memosService.getSingleMemoAttachmentDetailsRecord(
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
    description: 'Upload an attachment related to the given memo id.',
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
            value: PostAttachmentsMemoReturnExample,
          },
        },
      },
    },
  })
  @ApiUnprocessableEntityResponse({ type: ApiUnprocessableEntityErrorEntity })
  async postSingleMemoAttachmentRecord(
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
    return await this.memosService.postSingleMemoAttachmentRecord(
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
      'Find all Contact entries related to a given Memo entity by Memo id.',
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
            value: ContactsListResponseMemoExample,
          },
        },
      },
    },
  })
  async getListMemoContactRecord(
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
    return await this.memosService.getListMemoContactRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
      filter,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/contacts/:${contactIdName}`)
  @ApiOperation({
    description: `Displays the single ${contactIdName} result if it is related to the given Memo id.`,
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
            value: ContactsSingleResponseMemoExample,
          },
        },
      },
    },
  })
  async getSingleMemoContactRecord(
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
    return await this.memosService.getSingleMemoContactRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/call-information`)
  @ApiOperation({
    description: `Find all call information entries related to a given Memo entity by Memo id.`,
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
            value: CallInformationListResponseMemoExample,
          },
        },
      },
    },
  })
  async getListMemoCallInformationRecord(
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
    return await this.memosService.getListMemoCallInformationRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
      filter,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/call-information/:${callInformationIdName}`)
  @ApiOperation({
    description: `Displays the single ${callInformationIdName} result if it is related to the given Memo id.`,
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
            value: CallInformationSingleResponseMemoExample,
          },
        },
      },
    },
  })
  async getSingleMemoCallInformationRecord(
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
    return await this.memosService.getSingleMemoCallInformationRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/additional-information`)
  @ApiOperation({
    description: `Find all additional information entries related to a given Memo entity by Memo id.`,
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
            value: AdditionalInformationListResponseMemoExample,
          },
        },
      },
    },
  })
  async getListMemoAdditionalInformationRecord(
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
    return await this.memosService.getListMemoAdditionalInformationRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
      filter,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/additional-information/:${additionalInformationIdName}`)
  @ApiOperation({
    description: `Displays the single ${additionalInformationIdName} result if it is related to the given Memo id.`,
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
            value: AdditionalInformationSingleResponseMemoExample,
          },
        },
      },
    },
  })
  async getSingleMemoAdditionalInformationRecord(
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
    return await this.memosService.getSingleMemoAdditionalInformationRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/contacts/:${contactIdName}/languages`)
  @ApiOperation({
    description:
      'Find all Contact Language entries related to a given Memo and contact entity by Memo and contact id.',
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
  async getListMemoContactLanguagesRecord(
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
    return await this.memosService.getListMemoContactLanguagesRecord(
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
    description: `Displays the single ${contactLanguageIdName} result if it is related to the given Memo and contact id.`,
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
  async getSingleMemoContactLanguagesRecord(
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
    return await this.memosService.getSingleMemoContactLanguagesRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post(`:${idName}/contacts/:${contactIdName}/languages`)
  @ApiOperation({
    description:
      'Create a contact language record related to the given memo and contact id.',
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
  async postSingleMemoContactLanguagesRecord(
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
    return await this.memosService.postSingleMemoContactLanguagesRecord(
      contactLanguagesDto,
      req.headers[idirUsernameHeaderField] as string,
      id,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/contacts/:${contactIdName}/medical-behavioral`)
  @ApiOperation({
    description:
      'Find all Contact Medical Behavioral entries related to a given Memo and contact entity by Memo and contact id.',
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
  async getListMemoContactMedicalBehavioralRecord(
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
    return await this.memosService.getListMemoContactMedicalBehavioralRecord(
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
    description: `Displays the single ${contactMedicalBehavioralIdName} result if it is related to the given Memo and contact id.`,
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
  async getSingleMemoContactMedicalBehavioralRecord(
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
    return await this.memosService.getSingleMemoContactMedicalBehavioralRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/contacts/:${contactIdName}/education`)
  @ApiOperation({
    description:
      'Find all Contact Education entries related to a given Memo and contact entity by Memo and contact id.',
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
  async getListMemoContactEducationRecord(
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
    return await this.memosService.getListMemoContactEducationRecord(
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
    description: `Displays the single ${contactEducationIdName} result if it is related to the given Memo and contact id.`,
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
  async getSingleMemoContactEducationRecord(
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
    return await this.memosService.getSingleMemoContactEducationRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/contacts/:${contactIdName}/legal-authorities`)
  @ApiOperation({
    description:
      'Find all Contact Legal Authority entries related to a given Memo and contact entity by Memo and contact id.',
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
  async getListMemoContactLegalAuthorityRecord(
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
    return await this.memosService.getListMemoContactLegalAuthorityRecord(
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
    description: `Displays the single ${contactLegalAuthorityIdName} result if it is related to the given Memo and contact id.`,
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
  async getSingleMemoContactLegalAuthorityRecord(
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
    return await this.memosService.getSingleMemoContactLegalAuthorityRecord(
      id,
      res,
      req.headers[idirUsernameHeaderField] as string,
    );
  }
}
