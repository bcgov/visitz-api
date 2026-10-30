import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  Req,
  Res,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  getSchemaPath,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { EnumerationService } from './enumeration.service';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';
import {
  CONTENT_TYPE,
  excludeEmptyFieldsParamName,
  typeParamName,
} from '../../common/constants/parameter-constants';
import {
  pageSizeParamName,
  recordCountNeededParamName,
  startRowNumParamName,
} from '../../common/constants/upstream-constants';
import {
  noContentResponseSwagger,
  totalRecordCountHeadersSwagger,
  versionInfo,
} from '../../common/constants/swagger-constants';
import { ListOfValuesQueryParams } from '../../dto/filter-query-params.dto';
import {
  ListOfValuesListResponseExample,
  NestedListOfValuesEntity,
} from '../../entities/list-of-values.entity';
import { ApiBadRequestErrorEntity } from '../../entities/api-bad-request-error.entity';
import { ApiInternalServerErrorEntity } from '../../entities/api-internal-server-error.entity';

@Controller('')
@ApiParam(versionInfo)
@ApiBadRequestResponse({ type: ApiBadRequestErrorEntity })
@ApiInternalServerErrorResponse({ type: ApiInternalServerErrorEntity })
export class EnumerationController {
  constructor(
    private readonly enumerationService: EnumerationService,
    private readonly utilitiesService: UtilitiesService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('list-of-values')
  @ApiOperation({
    description:
      'Displays active list of values configuration entries for the given Type.',
  })
  @ApiQuery({ name: typeParamName, required: true })
  @ApiQuery({ name: recordCountNeededParamName, required: false })
  @ApiQuery({ name: pageSizeParamName, required: false })
  @ApiQuery({ name: startRowNumParamName, required: false })
  @ApiQuery({ name: excludeEmptyFieldsParamName, required: false })
  @ApiExtraModels(NestedListOfValuesEntity)
  @ApiNoContentResponse(noContentResponseSwagger)
  @ApiOkResponse({
    headers: totalRecordCountHeadersSwagger,
    content: {
      [CONTENT_TYPE]: {
        schema: {
          $ref: getSchemaPath(NestedListOfValuesEntity),
        },
        examples: {
          ListOfValuesListResponse: {
            value: ListOfValuesListResponseExample,
          },
        },
      },
    },
  })
  async getListOfValues(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
          exposeDefaultValues: true,
        },
        forbidNonWhitelisted: true,
      }),
    )
    filter: ListOfValuesQueryParams,
  ): Promise<NestedListOfValuesEntity> {
    const idir = this.utilitiesService.grabIdir(req);
    return await this.enumerationService.getListOfValues(idir, res, filter);
  }
}
