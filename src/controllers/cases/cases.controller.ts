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
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  getSchemaPath,
} from '@nestjs/swagger';
import { CasesService } from './cases.service';
import {
  NestedSupportNetworkEntity,
  SupportNetworkEntity,
  SupportNetworkListResponseCaseExample,
  SupportNetworkSingleResponseCaseExample,
} from '../../entities/support-network.entity';
import { IdPathParams } from '../../dto/id-path-params.dto';
import { SinceQueryParams } from '../../dto/since-query-params.dto';
import { ApiNotFoundEntity } from '../../entities/api-not-found.entity';
import { CONTENT_TYPE } from '../../common/constants/constants';

@Controller('case')
@ApiNotFoundResponse({ type: ApiNotFoundEntity })
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id/supportnetwork')
  @ApiOperation({
    description:
      'Find all Support Network entries related to a given Case entity by Case id.',
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
            value: SupportNetworkSingleResponseCaseExample,
          },
          SupportNetworkListResponse: {
            value: SupportNetworkListResponseCaseExample,
          },
        },
      },
    },
  })
  getSingleCaseSupportNetworkInformationRecord(
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
    return this.casesService.getSingleCaseSupportNetworkInformationRecord(
      id,
      since,
    );
  }
}
