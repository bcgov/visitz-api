import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  getSchemaPath,
} from '@nestjs/swagger';

import { IncidentsService } from './incidents.service';
import {
  NestedSupportNetworkEntity,
  SupportNetworkEntity,
  SupportNetworkListResponseIncidentExample,
  SupportNetworkSingleResponseIncidentExample,
} from '../../entities/support-network.entity';
import { IdPathParams } from '../../dto/id-path-params.dto';
import { SinceQueryParams } from '../../dto/since-query-params.dto';
import { ApiNotFoundEntity } from '../../entities/api-not-found.entity';
import {
  CONTENT_TYPE,
  idName,
} from '../../common/constants/parameter-constants';
import { ApiInternalServerErrorEntity } from '../../entities/api-internal-server-error.entity';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import {
  AttachmentsEntity,
  NestedAttachmentsEntity,
  AttachmentsSingleResponseIncidentExample,
  AttachmentsListResponseIncidentExample,
} from '../../entities/attachments.entity';

@Controller('incident')
@UseGuards(AuthGuard)
@ApiNotFoundResponse({ type: ApiNotFoundEntity })
@ApiInternalServerErrorResponse({ type: ApiInternalServerErrorEntity })
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/support-network`)
  @ApiOperation({
    description:
      'Find all Support Network entries related to a given Incident entity by Incident id.',
  })
  @ApiQuery({ name: 'since', required: false })
  @ApiExtraModels(SupportNetworkEntity, NestedSupportNetworkEntity)
  @ApiOkResponse({
    content: {
      [CONTENT_TYPE]: {
        schema: {
          oneOf: [
            { $ref: getSchemaPath(SupportNetworkEntity) },
            { $ref: getSchemaPath(NestedSupportNetworkEntity) },
          ],
        },
        examples: {
          SupportNetworkSingleResponse: {
            value: SupportNetworkSingleResponseIncidentExample,
          },
          SupportNetworkListResponse: {
            value: SupportNetworkListResponseIncidentExample,
          },
        },
      },
    },
  })
  async getSingleIncidentSupportNetworkInformationRecord(
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
  ): Promise<SupportNetworkEntity | NestedSupportNetworkEntity> {
    return await this.incidentsService.getSingleIncidentSupportNetworkInformationRecord(
      id,
      since,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/attachments`)
  @ApiOperation({
    description:
      'Find all Attachments metadata entries related to a given Incident entity by Incident id.',
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
            value: AttachmentsSingleResponseIncidentExample,
          },
          AttachmentsListResponse: {
            value: AttachmentsListResponseIncidentExample,
          },
        },
      },
    },
  })
  async getSingleIncidentAttachmentRecord(
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
    return await this.incidentsService.getSingleIncidentAttachmentRecord(
      id,
      since,
    );
  }
}
