import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { RecordType } from '../../common/constants/enumerations';
import { CheckIdQueryParams } from '../../dto/filter-query-params.dto';
import {
  ActivityPlanIdPathParams,
  IdPathParams,
} from '../../dto/id-path-params.dto';
import {
  ActivityPlanEntity,
  NestedActivityPlanEntity,
} from '../../entities/activity-plan.entity';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import { UtilitiesService } from '../utilities/utilities.service';
import {
  activityPlanIdName,
  CONTENT_TYPE,
  UNIFORM_RESPONSE,
  uniformResponseParamName,
} from '../../common/constants/parameter-constants';
import { trustedIdirHeaderName } from '../../common/constants/upstream-constants';
import { PostActivityPlanDtoUpstream } from '../../dto/post-activity-plan.dto';

@Injectable()
export class ActivityPlanService {
  baseUrl: string;
  endpointUrls: object;
  workspace: string | undefined;
  afterFieldName: string | undefined;

  private readonly logger = new Logger(ActivityPlanService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly requestPreparerService: RequestPreparerService,
    private readonly utilitiesService: UtilitiesService,
  ) {
    this.baseUrl = encodeURI(
      this.configService.get<string>('endpointUrls.baseUrl'),
    );

    this.endpointUrls = {
      [RecordType.Case]: encodeURI(
        this.configService.get<string>('endpointUrls.caseActivityPlan'),
      ),
      [RecordType.Incident]: encodeURI(
        this.configService.get<string>('endpointUrls.incidentActivityPlan'),
      ),
      [RecordType.SR]: encodeURI(
        this.configService.get<string>('endpointUrls.srActivityPlan'),
      ),
    };

    this.workspace = this.configService.get('workspaces.activityPlan');
    this.afterFieldName = this.configService.get('afterFieldName.activityPlan');
  }

  async getSingleActivityPlanRecord(
    type: RecordType,
    id: ActivityPlanIdPathParams,
    res: Response,
    idir: string,
  ): Promise<ActivityPlanEntity> {
    const baseSearchSpec = `([Id]="${id[activityPlanIdName]}"`;
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
        false,
        idir,
      );
    const response = await this.requestPreparerService.sendGetRequest(
      upstreamUrl,
      headers,
      res,
      params,
    );
    return new ActivityPlanEntity(response.data);
  }

  async getListActivityPlanRecord(
    type: RecordType,
    id: IdPathParams,
    res: Response,
    idir: string,
    filter?: CheckIdQueryParams,
  ): Promise<NestedActivityPlanEntity> {
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
    const response = await this.requestPreparerService.checkIdsGetRequest(
      upstreamUrl,
      this.workspace,
      headers,
      params,
      baseSearchSpec,
      'Id',
      res,
      filter,
    );
    return new NestedActivityPlanEntity(response.data);
  }

  async postSingleActivityPlanRecord(
    type: RecordType,
    id: IdPathParams,
    body: PostActivityPlanDtoUpstream,
    idir: string,
  ): Promise<ActivityPlanEntity> {
    const headers = {
      Accept: CONTENT_TYPE,
      'Content-Type': CONTENT_TYPE,
      'Accept-Encoding': '*',
      [trustedIdirHeaderName]: idir,
    };
    const params = {
      [uniformResponseParamName]: UNIFORM_RESPONSE,
    };
    if (this.workspace !== undefined) {
      params['workspace'] = this.workspace;
    }

    const upstreamUrl = this.utilitiesService.constructUpstreamUrl(
      type,
      id,
      this.baseUrl,
      this.endpointUrls,
    );
    const response = await this.requestPreparerService.sendPutRequest(
      upstreamUrl,
      body,
      headers,
      params,
    );
    return new ActivityPlanEntity(response.data.items[0].ActivityPlan[0]);
  }
}
