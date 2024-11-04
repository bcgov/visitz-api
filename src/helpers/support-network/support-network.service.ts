import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RecordType } from '../../common/constants/enumerations';
import {
  SupportNetworkEntity,
  NestedSupportNetworkEntity,
} from '../../entities/support-network.entity';
import { IdPathParams } from '../../dto/id-path-params.dto';
import { SinceQueryParams } from '../../dto/since-query-params.dto';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';

@Injectable()
export class SupportNetworkService {
  url: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly requestPreparerService: RequestPreparerService,
  ) {
    this.url = (
      this.configService.get<string>('UPSTREAM_BASE_URL') +
      this.configService.get<string>('SUPPORT_NETWORK_ENDPOINT')
    ).replace(/\s/g, '%20');
  }

  async getSingleSupportNetworkInformationRecord(
    type: RecordType,
    id: IdPathParams,
    since?: SinceQueryParams,
  ) {
    const [headers, params] =
      this.requestPreparerService.prepareHeadersAndParams(type, id, since);
    const response = await this.requestPreparerService.sendGetRequest(
      this.url,
      headers,
      params,
    );
    if ((response.data as object).hasOwnProperty('items')) {
      return new NestedSupportNetworkEntity(response.data);
    }
    return new SupportNetworkEntity(response.data);
  }
}
