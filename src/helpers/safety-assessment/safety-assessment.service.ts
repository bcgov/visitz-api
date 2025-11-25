import { Response } from 'express';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import {
  IdPathParams,
  SafetyAssessmentIdPathParams,
} from '../../dto/id-path-params.dto';
import { CheckIdQueryParams } from '../../dto/filter-query-params.dto';
import { RecordType } from '../../common/constants/enumerations';
import {
  NestedSafetyAssessmentEntity,
  SafetyAssessmentEntity,
} from '../../entities/safety-assessment.entity';
import {
  GET_CHILDREN,
  idName,
  safetyAssessmentIdName,
} from '../../common/constants/parameter-constants';
import { getChildrenParamName } from '../../common/constants/upstream-constants';
import { UtilitiesService } from '../utilities/utilities.service';

@Injectable()
export class SafetyAssessmentService {
  url: string;
  baseUrl: string;
  endpointUrls: object;
  workspace: string | undefined;
  afterFieldName: string | undefined;

  constructor(
    private readonly configService: ConfigService,
    private readonly requestPreparerService: RequestPreparerService,
    private readonly utilitiesService: UtilitiesService,
  ) {
    this.url = encodeURI(
      this.configService.get<string>('endpointUrls.baseUrl') +
        this.configService.get<string>('endpointUrls.safetyAssessments'),
    );
    this.baseUrl = encodeURI(
      this.configService.get<string>('endpointUrls.baseUrl'),
    );
    this.endpointUrls = {
      [RecordType.Incident]: encodeURI(
        this.configService.get<string>(
          'endpointUrls.safetyAssessmentsCheckIds',
        ),
      ),
    };
    this.workspace = this.configService.get('workspaces.safetyAssessments');
    this.afterFieldName = this.configService.get(
      'afterFieldName.safetyAssessments',
    );
  }

  async getSingleSafetyAssessmentRecord(
    _type: RecordType,
    id: SafetyAssessmentIdPathParams,
    res: Response,
    idir: string,
  ) {
    const baseSearchSpec = `([Id]="${id[safetyAssessmentIdName]}"`;
    const [headers, params] =
      this.requestPreparerService.prepareHeadersAndParams(
        baseSearchSpec,
        this.workspace,
        this.afterFieldName,
        false,
        idir,
      );
    params[getChildrenParamName] = GET_CHILDREN;
    const response = await this.requestPreparerService.sendGetRequest(
      this.url + id[idName],
      headers,
      res,
      params,
    );
    return new SafetyAssessmentEntity(response.data);
  }

  async getListSafetyAssessmentRecord(
    type: RecordType,
    id: IdPathParams,
    res: Response,
    idir: string,
    filter?: CheckIdQueryParams,
  ) {
    const baseSearchSpec = ``;
    const upstreamUrl = this.utilitiesService.constructUpstreamUrl(
      type,
      id,
      this.baseUrl,
      this.endpointUrls,
    );
    const [headers, params] =
      this.requestPreparerService.prepareHeadersAndParams(
        baseSearchSpec,
        this.workspace,
        this.afterFieldName,
        true,
        idir,
        filter,
      );
    params[getChildrenParamName] = GET_CHILDREN;
    const response = await this.requestPreparerService.checkIdsGetRequest(
      this.url + id[idName],
      this.workspace,
      headers,
      params,
      baseSearchSpec,
      'Id',
      res,
      filter,
      upstreamUrl,
    );
    return new NestedSafetyAssessmentEntity(response.data);
  }
}
