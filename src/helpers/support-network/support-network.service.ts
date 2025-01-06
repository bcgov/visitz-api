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
import { FilterQueryParams } from '../../dto/filter-query-params.dto';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import {
  idName,
  supportNetworkIdName,
} from '../../common/constants/parameter-constants';
import { Response } from 'express';

@Injectable()
export class SupportNetworkService {
  url: string;
  workspace: string | undefined;
  sinceFieldName: string | undefined;
  constructor(
    private readonly configService: ConfigService,
    private readonly requestPreparerService: RequestPreparerService,
  ) {
    this.url = encodeURI(
      this.configService.get<string>('endpointUrls.baseUrl') +
        this.configService.get<string>('endpointUrls.supportNetwork'),
    );
    this.workspace = this.configService.get('workspaces.supportNetwork');
    this.sinceFieldName = this.configService.get(
      'sinceFieldName.supportNetwork',
    );
  }

  async getSingleSupportNetworkInformationRecord(
    type: RecordType,
    id: SupportNetworkIdPathParams,
    res: Response,
  ) {
    const baseSearchSpec =
      `([Entity Id]="${id[idName]}" AND [Entity Name]="${RecordEntityMap[type]}"` +
      ` AND [Id]="${id[supportNetworkIdName]}"`;
    const [headers, params] =
      this.requestPreparerService.prepareHeadersAndParams(
        baseSearchSpec,
        this.workspace,
        this.sinceFieldName,
        false,
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
    filter?: FilterQueryParams,
  ) {
    const baseSearchSpec = `([Entity Id]="${id[idName]}" AND [Entity Name]="${RecordEntityMap[type]}"`;
    const [headers, params] =
      this.requestPreparerService.prepareHeadersAndParams(
        baseSearchSpec,
        this.workspace,
        this.sinceFieldName,
        true,
        filter,
      );
    const response = await this.requestPreparerService.sendGetRequest(
      this.url,
      headers,
      res,
      params,
    );
    return new NestedSupportNetworkEntity(response.data);
  }
}
