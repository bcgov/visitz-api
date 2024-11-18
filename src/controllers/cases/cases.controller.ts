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
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
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
import {
  CONTENT_TYPE,
  idName,
} from '../../common/constants/parameter-constants';
import { ApiInternalServerErrorEntity } from '../../entities/api-internal-server-error.entity';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import {
  InPersonVisitsEntity,
  InPersonVisitsListResponseCaseExample,
  InPersonVisitsSingleResponseCaseExample,
  NestedInPersonVisitsEntity,
  PostInPersonVisitResponseExample,
} from '../../entities/in-person-visits.entity';
import {
  AttachmentsEntity,
  AttachmentsListResponseCaseExample,
  AttachmentsSingleResponseCaseExample,
  NestedAttachmentsEntity,
} from '../../entities/attachments.entity';
import { PostInPersonVisitDto } from '../../dto/post-in-person-visit.dto';
import {
  idirUsernameHeaderField,
  startRowNumParamName,
} from '../../common/constants/upstream-constants';
import { Request, Response } from 'express';
import {
  noContentResponseSwagger,
  totalRecordCountHeadersSwagger,
} from '../../common/constants/swagger-constants';
import { StartRowNumQueryParams } from '../../dto/start-row-num-query-params.dto';

@Controller('case')
@UseGuards(AuthGuard)
@ApiInternalServerErrorResponse({ type: ApiInternalServerErrorEntity })
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/support-network`)
  @ApiOperation({
    description:
      'Find all Support Network entries related to a given Case entity by Case id.',
  })
  @ApiQuery({ name: 'since', required: false })
  @ApiQuery({ name: startRowNumParamName, required: false })
  @ApiExtraModels(SupportNetworkEntity, NestedSupportNetworkEntity)
  @ApiNoContentResponse(noContentResponseSwagger)
  @ApiOkResponse({
    headers: totalRecordCountHeadersSwagger,
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
  async getSingleCaseSupportNetworkInformationRecord(
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
  ): Promise<SupportNetworkEntity | NestedSupportNetworkEntity> {
    return await this.casesService.getSingleCaseSupportNetworkInformationRecord(
      id,
      res,
      since,
      startRowNum,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/visits`)
  @ApiOperation({
    description:
      'Find all In Person Child / Youth Visits related to a given Case entity by Case id.',
  })
  @ApiQuery({ name: 'since', required: false })
  @ApiQuery({ name: startRowNumParamName, required: false })
  @ApiExtraModels(InPersonVisitsEntity, NestedInPersonVisitsEntity)
  @ApiNoContentResponse(noContentResponseSwagger)
  @ApiOkResponse({
    headers: totalRecordCountHeadersSwagger,
    content: {
      [CONTENT_TYPE]: {
        schema: {
          oneOf: [
            { $ref: getSchemaPath(InPersonVisitsEntity) },
            { $ref: getSchemaPath(NestedInPersonVisitsEntity) },
          ],
        },
        examples: {
          InPersonVisitsSingleResponse: {
            value: InPersonVisitsSingleResponseCaseExample,
          },
          InPersonVisitsListResponse: {
            value: InPersonVisitsListResponseCaseExample,
          },
        },
      },
    },
  })
  async getSingleCaseInPersonVisitRecord(
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
  ): Promise<InPersonVisitsEntity | NestedInPersonVisitsEntity> {
    return await this.casesService.getSingleCaseInPersonVisitRecord(
      id,
      res,
      since,
      startRowNum,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post(`:${idName}/visits`)
  @ApiOperation({
    description:
      'Create an in person visit record related to the given case id.',
  })
  @ApiCreatedResponse({
    content: {
      [CONTENT_TYPE]: {
        examples: {
          InPersonVisitCreatedResponse: {
            value: PostInPersonVisitResponseExample,
          },
        },
      },
    },
  })
  async postSingleCaseInPersonVisitRecord(
    @Body(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        whitelist: true,
      }),
    )
    inPersonVisitDto: PostInPersonVisitDto,
    @Param(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    id: IdPathParams,
    @Req() req: Request,
  ): Promise<NestedInPersonVisitsEntity> {
    return await this.casesService.postSingleCaseInPersonVisitRecord(
      inPersonVisitDto,
      req.headers[idirUsernameHeaderField] as string,
      id,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`:${idName}/attachments`)
  @ApiOperation({
    description:
      'Find all Attachments metadata entries related to a given Case entity by Case id.',
  })
  @ApiQuery({ name: 'since', required: false })
  @ApiQuery({ name: startRowNumParamName, required: false })
  @ApiExtraModels(AttachmentsEntity, NestedAttachmentsEntity)
  @ApiNoContentResponse(noContentResponseSwagger)
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
            value: AttachmentsSingleResponseCaseExample,
          },
          AttachmentsListResponse: {
            value: AttachmentsListResponseCaseExample,
          },
        },
      },
    },
  })
  async getSingleCaseAttachmentRecord(
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
    return await this.casesService.getSingleCaseAttachmentRecord(
      id,
      res,
      since,
      startRowNum,
    );
  }
}
