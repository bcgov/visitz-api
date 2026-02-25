import { Injectable } from '@nestjs/common';
import { UtilitiesService } from '../utilities/utilities.service';
import { Response } from 'express';
import { RecordType } from '../../common/constants/enumerations';
import { ConfigService } from '@nestjs/config';
import { callInformationIdName } from '../../common/constants/parameter-constants';
import { FilterQueryParams } from '../../dto/filter-query-params.dto';
import {
  CallInformationIdPathParams,
  IdPathParams,
} from '../../dto/id-path-params.dto';
import {
  NestedCallInformationEntity,
  CallInformationEntity,
} from '../../entities/call-information.entity';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';

@Injectable()
export class CallInformationService {
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
        this.configService.get<string>('endpointUrls.incidentCallInformation'),
      ),
      [RecordType.SR]: encodeURI(
        this.configService.get<string>('endpointUrls.srCallInformation'),
      ),
      [RecordType.Memo]: encodeURI(
        this.configService.get<string>('endpointUrls.memoCallInformation'),
      ),
    };
    this.workspace = this.configService.get('workspaces.callInformation');
    this.afterFieldName = this.configService.get(
      'afterFieldName.callInformation',
    );
  }

  async getSingleCallInformationRecord(
    type: RecordType,
    id: CallInformationIdPathParams,
    res: Response,
    idir: string,
  ): Promise<CallInformationEntity> {
    const baseSearchSpec = `([Id]="${id[callInformationIdName]}"`;
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
    return new CallInformationEntity(response.data);
  }

  async getListCallInformationRecord(
    type: RecordType,
    id: IdPathParams,
    res: Response,
    idir: string,
    filter?: FilterQueryParams,
  ): Promise<NestedCallInformationEntity> {
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
    return new NestedCallInformationEntity(response.data);
  }
}
