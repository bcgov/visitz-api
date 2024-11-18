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
import { Response } from 'express';
import {
  noContentResponseSwagger,
  totalRecordCountHeadersSwagger,
} from '../../common/constants/swagger-constants';
import { StartRowNumQueryParams } from '../../dto/start-row-num-query-params.dto';
import { startRowNumParamName } from '../../common/constants/upstream-constants';

@Controller('memo')
@ApiNoContentResponse(noContentResponseSwagger)
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
  @ApiQuery({ name: startRowNumParamName, required: false })
  @ApiExtraModels(AttachmentsEntity, NestedAttachmentsEntity)
  @ApiOkResponse({
    headers: totalRecordCountHeadersSwagger,
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
    @Res({ passthrough: true }) res: Response,
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
        skipMissingProperties: true,
      }),
    )
    since?: SinceQueryParams,
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
        skipMissingProperties: true,
      }),
    )
    startRowNum?: StartRowNumQueryParams,
  ): Promise<AttachmentsEntity | NestedAttachmentsEntity> {
    return await this.memosService.getSingleMemoAttachmentRecord(
      id,
      res,
      since,
      startRowNum,
    );
  }
}
