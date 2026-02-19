import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { RecordType } from '../../common/constants/enumerations';
import { CheckIdQueryParams } from '../../dto/filter-query-params.dto';
import {
  IncidentConcernIdPathParams,
  IdPathParams,
} from '../../dto/id-path-params.dto';
import {
  IncidentConcernEntity,
  NestedIncidentConcernEntity,
} from '../../entities/incident-concern.entity';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import { UtilitiesService } from '../utilities/utilities.service';
import { incidentConcernIdName } from '../../common/constants/parameter-constants';

@Injectable()
export class IncidentConcernService {
  baseUrl: string;
  endpointUrls: object;
  workspace: string | undefined;
  afterFieldName: string | undefined;
  constructor(
    private readonly configService: ConfigService,
    private readonly requestPreparerService: RequestPreparerService,
    private readonly utilitiesService: UtilitiesService,
  ) {
    this.baseUrl = encodeURI(
      this.configService.get<string>('endpointUrls.baseUrl'),
    );
    this.endpointUrls = {
      [RecordType.Incident]: encodeURI(
        this.configService.get<string>('endpointUrls.incidentConcern'),
      ),
    };
    this.workspace = this.configService.get('workspaces.incidentConcern');
    this.afterFieldName = this.configService.get(
      'afterFieldName.incidentConcern',
    );
  }

  async getSingleIncidentConcernRecord(
    type: RecordType,
    id: IncidentConcernIdPathParams,
    res: Response,
    idir: string,
  ): Promise<IncidentConcernEntity> {
    const baseSearchSpec = `([Id]="${id[incidentConcernIdName]}"`;
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
    return new IncidentConcernEntity(response.data);
  }

  async getListIncidentConcernRecord(
    type: RecordType,
    id: IdPathParams,
    res: Response,
    idir: string,
    filter?: CheckIdQueryParams,
  ): Promise<NestedIncidentConcernEntity> {
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
    return new NestedIncidentConcernEntity(response.data);
  }
}
