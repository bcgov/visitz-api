import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  RecordEntityMap,
  RecordType,
} from '../../common/constants/enumerations';
import {
  SupportNetworkEntity,
  NestedSupportNetworkEntity,
} from '../../entities/support-network.entity';
import { IdPathParams } from '../../dto/id-path-params.dto';
import { SinceQueryParams } from '../../dto/since-query-params.dto';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import {
  baseUrlEnvVarName,
  supportNetworkEndpointEnvVarName,
} from '../../common/constants/upstream-constants';
import { idName } from '../../common/constants/parameter-constants';
import { Response } from 'express';
import { StartRowNumQueryParams } from '../../dto/start-row-num-query-params.dto';

@Injectable()
export class SupportNetworkService {
  url: string;
  workspace: string | undefined;
  sinceFieldName: string | undefined;
  constructor(
    private readonly configService: ConfigService,
    private readonly requestPreparerService: RequestPreparerService,
  ) {
    this.url = (
      this.configService.get<string>(baseUrlEnvVarName) +
      this.configService.get<string>(supportNetworkEndpointEnvVarName)
    ).replace(/\s/g, '%20');
    this.workspace = this.configService.get('workspaces.supportNetwork');
    this.sinceFieldName = this.configService.get(
      'sinceFieldName.supportNetwork',
    );
  }

  async getSingleSupportNetworkInformationRecord(
    type: RecordType,
    id: IdPathParams,
    res: Response,
    since?: SinceQueryParams,
    startRowNum?: StartRowNumQueryParams,
  ) {
    const baseSearchSpec = `([Entity Id]="${id[idName]}" AND [Entity Name]="${RecordEntityMap[type]}"`;
    const [headers, params] =
      this.requestPreparerService.prepareHeadersAndParams(
        baseSearchSpec,
        this.workspace,
        this.sinceFieldName,
        since,
        startRowNum,
      );
    const response = await this.requestPreparerService.sendGetRequest(
      this.url,
      headers,
      res,
      params,
    );
    if ((response.data as object).hasOwnProperty('items')) {
      return new NestedSupportNetworkEntity(response.data);
    }
    return new SupportNetworkEntity(response.data);
  }
}
