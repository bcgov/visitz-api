import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Query,
  Res,
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
} from '@nestjs/swagger';
import {
  idName,
  CONTENT_TYPE,
  sinceParamName,
  attachmentIdName,
  contactIdName,
} from '../../common/constants/parameter-constants';
import {
  AttachmentIdPathParams,
  ContactIdPathParams,
  IdPathParams,
} from '../../dto/id-path-params.dto';
import { FilterQueryParams } from '../../dto/filter-query-params.dto';
import {
  NestedAttachmentsEntity,
  AttachmentsListResponseMemoExample,
  AttachmentDetailsEntity,
  AttachmentDetailsMemoExample,
} from '../../entities/attachments.entity';
import { ApiInternalServerErrorEntity } from '../../entities/api-internal-server-error.entity';
import { Response } from 'express';
import {
  noContentResponseSwagger,
  totalRecordCountHeadersSwagger,
  versionInfo,
} from '../../common/constants/swagger-constants';
import {
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

@Controller('memo')
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
  @ApiQuery({ name: sinceParamName, required: false })
  @ApiQuery({ name: recordCountNeededParamName, required: false })
  @ApiQuery({ name: pageSizeParamName, required: false })
  @ApiQuery({ name: startRowNumParamName, required: false })
  @ApiExtraModels(NestedAttachmentsEntity)
  @ApiOkResponse({
    headers: totalRecordCountHeadersSwagger,
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
    filter?: FilterQueryParams,
  ): Promise<NestedAttachmentsEntity> {
    return await this.memosService.getSingleMemoAttachmentRecord(
      id,
      res,
      filter,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/attachments/:${attachmentIdName}`)
  @ApiOperation({
    description:
      'Download an Attachment related to a given Memo Id by its Attachment Id.',
  })
  @ApiQuery({ name: sinceParamName, required: false })
  @ApiQuery({ name: recordCountNeededParamName, required: false })
  @ApiQuery({ name: pageSizeParamName, required: false })
  @ApiQuery({ name: startRowNumParamName, required: false })
  @ApiExtraModels(AttachmentDetailsEntity)
  @ApiOkResponse({
    headers: totalRecordCountHeadersSwagger,
    content: {
      [CONTENT_TYPE]: {
        schema: {
          $ref: getSchemaPath(AttachmentDetailsEntity),
        },
        examples: {
          AttachmentDetailsResponse: {
            value: AttachmentDetailsMemoExample,
          },
        },
      },
    },
  })
  async getSingleMemoAttachmentDetailsRecord(
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
    filter?: FilterQueryParams,
  ): Promise<AttachmentDetailsEntity> {
    return await this.memosService.getSingleMemoAttachmentDetailsRecord(
      id,
      res,
      filter,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/contacts`)
  @ApiOperation({
    description:
      'Find all Contact entries related to a given Memo entity by Memo id.',
  })
  @ApiQuery({ name: sinceParamName, required: false })
  @ApiQuery({ name: recordCountNeededParamName, required: false })
  @ApiQuery({ name: pageSizeParamName, required: false })
  @ApiQuery({ name: startRowNumParamName, required: false })
  @ApiExtraModels(NestedContactsEntity)
  @ApiOkResponse({
    headers: totalRecordCountHeadersSwagger,
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
    filter?: FilterQueryParams,
  ): Promise<NestedContactsEntity> {
    return await this.memosService.getListMemoContactRecord(id, res, filter);
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
    return await this.memosService.getSingleMemoContactRecord(id, res);
  }
}
