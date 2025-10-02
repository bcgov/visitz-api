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
} from '../../common/constants/parameter-constants';
import {
  AttachmentIdPathParams,
  ContactIdPathParams,
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
}
