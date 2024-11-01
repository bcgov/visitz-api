import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Query,
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
import { CONTENT_TYPE } from '../../common/constants/parameter-constants';
import { ApiInternalServerErrorEntity } from '../../entities/api-internal-server-error.entity';

@Controller('incident')
@ApiNotFoundResponse({ type: ApiNotFoundEntity })
@ApiInternalServerErrorResponse({ type: ApiInternalServerErrorEntity })
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id/supportnetwork')
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
}
