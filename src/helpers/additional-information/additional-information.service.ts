import { Injectable } from '@nestjs/common';
import { UtilitiesService } from '../utilities/utilities.service';
import { Response } from 'express';
import { RecordType } from '../../common/constants/enumerations';
import { ConfigService } from '@nestjs/config';
import { additionalInformationIdName } from '../../common/constants/parameter-constants';
import { FilterQueryParams } from '../../dto/filter-query-params.dto';
import {
  AdditionalInformationIdPathParams,
  IdPathParams,
} from '../../dto/id-path-params.dto';
import {
  NestedAdditionalInformationEntity,
  AdditionalInformationEntity,
} from '../../entities/additional-information.entity';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';

@Injectable()
export class AdditionalInformationService {
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
          'endpointUrls.incidentAdditionalInformation',
        ),
      ),
      [RecordType.SR]: encodeURI(
        this.configService.get<string>('endpointUrls.srAdditionalInformation'),
      ),
      [RecordType.Memo]: encodeURI(
        this.configService.get<string>(
          'endpointUrls.memoAdditionalInformation',
        ),
      ),
    };
    this.workspace = this.configService.get('workspaces.additionalInformation');
    this.afterFieldName = this.configService.get(
      'afterFieldName.additionalInformation',
    );
  }

  async getSingleAdditionalInformationRecord(
    type: RecordType,
    id: AdditionalInformationIdPathParams,
    res: Response,
    idir: string,
  ): Promise<AdditionalInformationEntity> {
    const baseSearchSpec = `([Id]="${id[additionalInformationIdName]}"`;
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
    return new AdditionalInformationEntity(response.data);
  }

  async getListAdditionalInformationRecord(
    type: RecordType,
    id: IdPathParams,
    res: Response,
    idir: string,
    filter?: FilterQueryParams,
  ): Promise<NestedAdditionalInformationEntity> {
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
    return new NestedAdditionalInformationEntity(response.data);
  }
}
