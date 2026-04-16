import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  RecordEntityMap,
  RecordType,
} from '../../common/constants/enumerations';
import {
  NestedSupportNetworkEntity,
  SupportNetworkEntity,
} from '../../entities/support-network.entity';
import {
  IdPathParams,
  SupportNetworkIdPathParams,
} from '../../dto/id-path-params.dto';
import { CheckIdQueryParams } from '../../dto/filter-query-params.dto';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import {
  CONTENT_TYPE,
  idName,
  supportNetworkIdName,
  UNIFORM_RESPONSE,
  uniformResponseParamName,
} from '../../common/constants/parameter-constants';
import { Response } from 'express';
import { PostSupportNetworkDtoUpstream } from '../../dto/post-support-network.dto';
import { trustedIdirHeaderName } from '../../common/constants/upstream-constants';

@Injectable()
export class SupportNetworkService {
  url: string;
  postUrl: string;
  workspace: string | undefined;
  postWorkspace: string | undefined;
  afterFieldName: string | undefined;
  constructor(
    private readonly configService: ConfigService,
    private readonly requestPreparerService: RequestPreparerService,
  ) {
    this.url = encodeURI(
      this.configService.get<string>('endpointUrls.baseUrl') +
        this.configService.get<string>('endpointUrls.supportNetwork'),
    );
    this.postUrl = encodeURI(
      this.configService.get<string>('endpointUrls.baseUrl') +
        this.configService.get<string>('endpointUrls.postSupportNetwork'),
    );
    this.workspace = this.configService.get('workspaces.supportNetwork');
    this.postWorkspace = this.configService.get(
      'workspaces.postSupportNetwork',
    );
    this.afterFieldName = this.configService.get(
      'afterFieldName.supportNetwork',
    );
  }

  async getSingleSupportNetworkInformationRecord(
    type: RecordType,
    id: SupportNetworkIdPathParams,
    res: Response,
    idir: string,
  ) {
    const baseSearchSpec =
      `([Entity Id]="${id[idName]}" AND [Entity Name]="${RecordEntityMap[type]}"` +
      ` AND [Id]="${id[supportNetworkIdName]}"`;
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
    return new SupportNetworkEntity(response.data);
  }

  async getListSupportNetworkInformationRecord(
    type: RecordType,
    id: IdPathParams,
    res: Response,
    idir: string,
    filter?: CheckIdQueryParams,
  ) {
    const baseSearchSpec = `([Entity Id]="${id[idName]}" AND [Entity Name]="${RecordEntityMap[type]}"`;
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
      this.url,
      this.workspace,
      headers,
      params,
      baseSearchSpec,
      'Id',
      res,
      filter,
    );
    return new NestedSupportNetworkEntity(response.data);
  }

  async postSingleSupportNetworkRecord(
    _type: RecordType,
    body: PostSupportNetworkDtoUpstream,
    idir: string,
  ): Promise<NestedSupportNetworkEntity> {
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
    const response = await this.requestPreparerService.sendPutRequest(
      this.postUrl,
      body,
      headers,
      params,
    );
    return new NestedSupportNetworkEntity(response.data);
  }
}
