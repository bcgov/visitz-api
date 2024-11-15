import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Query,
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
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import {
  idName,
  CONTENT_TYPE,
} from '../../common/constants/parameter-constants';
import { IdPathParams } from '../../dto/id-path-params.dto';
import { SinceQueryParams } from '../../dto/since-query-params.dto';
import {
  AttachmentsEntity,
  NestedAttachmentsEntity,
  AttachmentsSingleResponseMemoExample,
  AttachmentsListResponseMemoExample,
} from '../../entities/attachments.entity';
import { ApiInternalServerErrorEntity } from '../../entities/api-internal-server-error.entity';
import { ApiNotFoundEntity } from '../../entities/api-not-found.entity';

@Controller('memo')
@ApiNotFoundResponse({ type: ApiNotFoundEntity })
@ApiInternalServerErrorResponse({ type: ApiInternalServerErrorEntity })
export class MemosController {
  constructor(private readonly memosService: MemosService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/attachments`)
  @ApiOperation({
    description:
      'Find all Attachments metadata entries related to a given Memo entity by Memo id.',
  })
  @ApiQuery({ name: 'since', required: false })
  @ApiExtraModels(AttachmentsEntity, NestedAttachmentsEntity)
  @ApiOkResponse({
    content: {
      [CONTENT_TYPE]: {
        schema: {
          oneOf: [
            { $ref: getSchemaPath(AttachmentsEntity) },
            { $ref: getSchemaPath(NestedAttachmentsEntity) },
          ],
        },
        examples: {
          AttachmentsSingleResponse: {
            value: AttachmentsSingleResponseMemoExample,
          },
          AttachmentsListResponse: {
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
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
        skipMissingProperties: true,
      }),
    )
    since?: SinceQueryParams,
  ): Promise<AttachmentsEntity | NestedAttachmentsEntity> {
    return await this.memosService.getSingleMemoAttachmentRecord(id, since);
  }
}
