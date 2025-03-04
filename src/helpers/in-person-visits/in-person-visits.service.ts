import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { RecordType } from '../../common/constants/enumerations';
import { IdPathParams, VisitIdPathParams } from '../../dto/id-path-params.dto';
import { FilterQueryParams } from '../../dto/filter-query-params.dto';
import { ConfigService } from '@nestjs/config';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import {
  InPersonVisitsEntity,
  NestedInPersonVisitsEntity,
} from '../../entities/in-person-visits.entity';
import {
  CONTENT_TYPE,
  idName,
  UNIFORM_RESPONSE,
  uniformResponseParamName,
  visitIdName,
} from '../../common/constants/parameter-constants';
import { PostInPersonVisitDtoUpstream } from '../../dto/post-in-person-visit.dto';
import { Response } from 'express';
import {
  caseChildServices,
  childVisitEntityIdFieldName,
  trustedIdirHeaderName,
} from '../../common/constants/upstream-constants';
import { childServicesTypeError } from '../../common/constants/error-constants';

@Injectable()
export class InPersonVisitsService {
  url: string;
  postUrl: string;
  caseUrl: string;
  workspace: string | undefined;
  postWorkspace: string | undefined;
  caseWorkspace: string | undefined;
  afterFieldName: string | undefined;
  typeFieldName: string | undefined;

  private readonly logger = new Logger(InPersonVisitsService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly requestPreparerService: RequestPreparerService,
  ) {
    this.url = encodeURI(
      this.configService.get<string>('endpointUrls.baseUrl') +
        this.configService.get<string>('endpointUrls.inPersonVisits'),
    );
    this.postUrl = encodeURI(
      this.configService.get<string>('endpointUrls.baseUrl') +
        this.configService.get<string>('endpointUrls.postInPersonVisits'),
    );
    this.caseUrl = encodeURI(
      this.configService.get<string>('endpointUrls.baseUrl') +
        this.configService.get<string>('upstreamAuth.case.endpoint'),
    );
    this.workspace = this.configService.get('workspaces.inPersonVisits');
    this.postWorkspace = this.configService.get(
      'workspaces.postInPersonVisits',
    );
    this.caseWorkspace = this.configService.get('upstreamAuth.case.workspace');
    this.afterFieldName = this.configService.get(
      'afterFieldName.inPersonVisits',
    );
    this.typeFieldName = this.configService.get('upstreamAuth.case.typeField');
  }

  async getSingleInPersonVisitRecord(
    _type: RecordType,
    id: VisitIdPathParams,
    res: Response,
    idir: string,
  ): Promise<InPersonVisitsEntity> {
    const parentId = id[idName];
    const isValidChildCase = await this.isChildCaseType(parentId, idir);
    if (!isValidChildCase) {
      throw new BadRequestException([childServicesTypeError]);
    }
    const baseSearchSpec = `([Parent Id]="${parentId}" AND [Id]="${id[visitIdName]}"`;
    const [headers, params] =
      this.requestPreparerService.prepareHeadersAndParams(
        baseSearchSpec,
        this.workspace,
        this.afterFieldName,
        false,
        idir,
      );
    const response = await this.requestPreparerService.sendGetRequest(
      this.url,
      headers,
      res,
      params,
    );
    return new InPersonVisitsEntity(response.data);
  }

  async getListInPersonVisitRecord(
    _type: RecordType,
    id: IdPathParams,
    res: Response,
    idir: string,
    filter?: FilterQueryParams,
  ): Promise<NestedInPersonVisitsEntity> {
    const parentId = id[idName];
    const isValidChildCase = await this.isChildCaseType(parentId, idir);
    if (!isValidChildCase) {
      throw new BadRequestException([childServicesTypeError]);
    }
    const baseSearchSpec = `([Parent Id]="${parentId}"`;
    const [headers, params] =
      this.requestPreparerService.prepareHeadersAndParams(
        baseSearchSpec,
        this.workspace,
        this.afterFieldName,
        true,
        idir,
        filter,
      );
    const response = await this.requestPreparerService.sendGetRequest(
      this.url,
      headers,
      res,
      params,
    );
    return new NestedInPersonVisitsEntity(response.data);
  }

  async postSingleInPersonVisitRecord(
    _type: RecordType,
    body: PostInPersonVisitDtoUpstream,
    idir: string,
  ): Promise<NestedInPersonVisitsEntity> {
    const parentId = body[childVisitEntityIdFieldName];
    const isValidChildCase = await this.isChildCaseType(parentId, idir);
    if (!isValidChildCase) {
      throw new BadRequestException([childServicesTypeError]);
    }
    const headers = {
      Accept: CONTENT_TYPE,
      'Content-Type': CONTENT_TYPE,
      'Accept-Encoding': '*',
      [trustedIdirHeaderName]: idir,
    };
    const params = {
      [uniformResponseParamName]: UNIFORM_RESPONSE,
    };
    if (this.postWorkspace !== undefined) {
      params['workspace'] = this.postWorkspace;
    }
    const response = await this.requestPreparerService.sendPostRequest(
      this.postUrl,
      body,
      headers,
      params,
    );
    return new NestedInPersonVisitsEntity(response.data);
  }

  async isChildCaseType(parentId: string, idir: string): Promise<boolean> {
    const baseSearchSpec = `([Id]="${parentId}"`;
    const [headers, params] =
      this.requestPreparerService.prepareHeadersAndParams(
        baseSearchSpec,
        this.caseWorkspace,
        undefined,
        true,
        idir,
      );
    let response;
    try {
      response = await this.requestPreparerService.sendGetRequest(
        this.caseUrl,
        headers,
        undefined,
        params,
      );
    } catch {
      return false;
    }
    const type = response.data['items'][0][`${this.typeFieldName}`];
    if (type === undefined) {
      this.logger.error(`${this.typeFieldName} field not found in request`);
      return false;
    }
    return type === caseChildServices;
  }
}
