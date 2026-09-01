import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { RecordType } from '../../common/constants/enumerations';
import { CheckIdQueryParams } from '../../dto/filter-query-params.dto';
import {
  ActivityIdPathParams,
  IdPathParams,
} from '../../dto/id-path-params.dto';
import {
  ActivitiesEntity,
  NestedActivitiesEntity,
} from '../../entities/activities.entity';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import { UtilitiesService } from '../utilities/utilities.service';
import {
  activityIdName,
  CONTENT_TYPE,
  UNIFORM_RESPONSE,
  uniformResponseParamName,
} from '../../common/constants/parameter-constants';
import { trustedIdirHeaderName } from '../../common/constants/upstream-constants';
import { PostActivityDtoUpstream } from '../../dto/post-activity.dto';

@Injectable()
export class ActivitiesService {
  baseUrl: string;
  endpointUrls: object;
  workspace: string | undefined;
  afterFieldName: string | undefined;

  private readonly logger = new Logger(ActivitiesService.name);

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
        this.configService.get<string>('endpointUrls.caseActivities'),
      ),
      [RecordType.Incident]: encodeURI(
        this.configService.get<string>('endpointUrls.incidentActivities'),
      ),
      [RecordType.SR]: encodeURI(
        this.configService.get<string>('endpointUrls.srActivities'),
      ),
      [RecordType.Memo]: encodeURI(
        this.configService.get<string>('endpointUrls.memoActivities'),
      ),
    };

    this.workspace = this.configService.get('workspaces.activities');
    this.afterFieldName = this.configService.get('afterFieldName.activities');
  }

  async getSingleActivityRecord(
    type: RecordType,
    id: ActivityIdPathParams,
    res: Response,
    idir: string,
  ): Promise<ActivitiesEntity> {
    const baseSearchSpec = `([Id]="${id[activityIdName]}"`;
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
    return new ActivitiesEntity(response.data);
  }

  async getListActivityRecord(
    type: RecordType,
    id: IdPathParams,
    res: Response,
    idir: string,
    filter?: CheckIdQueryParams,
  ): Promise<NestedActivitiesEntity> {
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
    return new NestedActivitiesEntity(response.data);
  }

  async postSingleActivityRecord(
    type: RecordType,
    id: IdPathParams,
    body: PostActivityDtoUpstream,
    idir: string,
  ): Promise<ActivitiesEntity> {
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
    return new ActivitiesEntity(response.data.items[0].Activities[0]);
  }
}
