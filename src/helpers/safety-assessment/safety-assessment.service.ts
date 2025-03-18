import { Response } from 'express';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import {
  IdPathParams,
  SafetyAssessmentIdPathParams,
} from '../../dto/id-path-params.dto';
import { FilterQueryParams } from '../../dto/filter-query-params.dto';
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

@Injectable()
export class SafetyAssessmentService {
  url: string;
  workspace: string | undefined;
  afterFieldName: string | undefined;

  constructor(
    private readonly configService: ConfigService,
    private readonly requestPreparerService: RequestPreparerService,
  ) {
    this.url = encodeURI(
      this.configService.get<string>('endpointUrls.baseUrl') +
        this.configService.get<string>('endpointUrls.safetyAssessments'),
    );
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
    _type: RecordType,
    id: IdPathParams,
    res: Response,
    idir: string,
    filter?: FilterQueryParams,
  ) {
    const baseSearchSpec = ``;
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
    const response = await this.requestPreparerService.sendGetRequest(
      this.url + id[idName],
      headers,
      res,
      params,
    );
    return new NestedSafetyAssessmentEntity(response.data);
  }
}
