import { Injectable } from '@nestjs/common';
import { RecordType } from '../../common/constants/enumerations';
import { IdPathParams } from '../../dto/id-path-params.dto';
import { SinceQueryParams } from '../../dto/since-query-params.dto';
import { ConfigService } from '@nestjs/config';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import {
  NestedInPersonVisitsEntity,
  InPersonVisitsEntity,
} from '../../entities/in-person-visits.entity';
import {
  baseUrlEnvVarName,
  inPersonVisitsEndpointEnvVarName,
  postInPersonVisitsEndpointEnvVarName,
} from '../../common/constants/upstream-constants';
import {
  CONTENT_TYPE,
  idName,
} from '../../common/constants/parameter-constants';
import { PostInPersonVisitDtoUpstream } from 'src/dto/post-in-person-visit.dto';
import { Response } from 'express';

@Injectable()
export class InPersonVisitsService {
  url: string;
  postUrl: string;
  workspace: string | undefined;
  postWorkspace: string | undefined;
  sinceFieldName: string | undefined;
  constructor(
    private readonly configService: ConfigService,
    private readonly requestPreparerService: RequestPreparerService,
  ) {
    this.url = (
      this.configService.get<string>(baseUrlEnvVarName) +
      this.configService.get<string>(inPersonVisitsEndpointEnvVarName)
    ).replace(/\s/g, '%20');
    this.postUrl = (
      this.configService.get<string>(baseUrlEnvVarName) +
      this.configService.get<string>(postInPersonVisitsEndpointEnvVarName)
    ).replace(/\s/g, '%20');
    this.workspace = this.configService.get('workspaces.inPersonVisits');
    this.postWorkspace = this.configService.get(
      'workspaces.postInPersonVisits',
    );
    this.sinceFieldName = this.configService.get(
      'sinceFieldName.inPersonVisits',
    );
  }

  async getSingleInPersonVisitRecord(
    _type: RecordType,
    id: IdPathParams,
    res: Response,
    since?: SinceQueryParams,
  ): Promise<InPersonVisitsEntity | NestedInPersonVisitsEntity> {
    const baseSearchSpec = `([Parent Id]="${id[idName]}"`;
    const [headers, params] =
      this.requestPreparerService.prepareHeadersAndParams(
        baseSearchSpec,
        this.workspace,
        this.sinceFieldName,
        since,
      );
    const response = await this.requestPreparerService.sendGetRequest(
      this.url,
      headers,
      res,
      params,
    );
    if ((response.data as object).hasOwnProperty('items')) {
      return new NestedInPersonVisitsEntity(response.data);
    }
    return new InPersonVisitsEntity(response.data);
  }

  async postSingleInPersonVisitRecord(
    _type: RecordType,
    body: PostInPersonVisitDtoUpstream,
  ): Promise<NestedInPersonVisitsEntity> {
    const headers = {
      Accept: CONTENT_TYPE,
      'Content-Type': CONTENT_TYPE,
      'Accept-Encoding': '*',
    };
    const params = {};
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
}
