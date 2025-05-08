import { Injectable } from '@nestjs/common';
import { UtilitiesService } from '../utilities/utilities.service';
import { Response } from 'express';
import { RecordType } from '../../common/constants/enumerations';
import { ConfigService } from '@nestjs/config';
import { responseNarrativeIdName } from '../../common/constants/parameter-constants';
import { FilterQueryParams } from '../../dto/filter-query-params.dto';
import {
  ResponseNarrativeIdPathParams,
  IdPathParams,
} from '../../dto/id-path-params.dto';
import {
  NestedResponseNarrativeEntity,
  ResponseNarrativeEntity,
} from '../../entities/response-narrative.entity';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';

@Injectable()
export class ResponseNarrativeService {
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
        this.configService.get<string>(
          'endpointUrls.incidentResponseNarratives',
        ),
      ),
      [RecordType.SR]: encodeURI(
        this.configService.get<string>('endpointUrls.srResponseNarratives'),
      ),
    };
    this.workspace = this.configService.get('workspaces.responseNarratives');
    this.afterFieldName = this.configService.get(
      'afterFieldName.responseNarratives',
    );
  }

  async getSingleResponseNarrativeRecord(
    type: RecordType,
    id: ResponseNarrativeIdPathParams,
    res: Response,
    idir: string,
  ): Promise<ResponseNarrativeEntity> {
    const baseSearchSpec = `([Id]="${id[responseNarrativeIdName]}"`;
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
    return new ResponseNarrativeEntity(response.data);
  }

  async getListResponseNarrativeRecord(
    type: RecordType,
    id: IdPathParams,
    res: Response,
    idir: string,
    filter?: FilterQueryParams,
  ): Promise<NestedResponseNarrativeEntity> {
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
    const response = await this.requestPreparerService.sendGetRequest(
      upstreamUrl,
      headers,
      res,
      params,
    );
    return new NestedResponseNarrativeEntity(response.data);
  }
}
