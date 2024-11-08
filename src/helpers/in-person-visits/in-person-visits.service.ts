import { Injectable } from '@nestjs/common';
import { RecordType } from '../../common/constants/enumerations';
import { IdPathParams } from '../../dto/id-path-params.dto';
import { SinceQueryParams } from '../../dto/since-query-params.dto';
import { ConfigService } from '@nestjs/config';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import {
  NestedInPersonVisitsEntity,
  InPersonVisitsEntity,
} from '../../entities/in-person-visits.entity';
import {
  baseUrlEnvVarName,
  inPersonVisitsEndpointEnvVarName,
} from '../../common/constants/upstream-constants';
import { idName } from '../../common/constants/parameter-constants';

@Injectable()
export class InPersonVisitsService {
  url: string;
  workspace: string | undefined;
  sinceFieldName: string | undefined;
  constructor(
    private readonly configService: ConfigService,
    private readonly requestPreparerService: RequestPreparerService,
  ) {
    this.url = (
      this.configService.get<string>(baseUrlEnvVarName) +
      this.configService.get<string>(inPersonVisitsEndpointEnvVarName)
    ).replace(/\s/g, '%20');
    this.workspace = this.configService.get('workspaces.inPersonVisits');
    this.sinceFieldName = this.configService.get(
      'sinceFieldName.inPersonVisits',
    );
  }

  async getSingleInPersonVisitRecord(
    _type: RecordType,
    id: IdPathParams,
    since?: SinceQueryParams,
  ): Promise<InPersonVisitsEntity | NestedInPersonVisitsEntity> {
    const baseSearchSpec = `([Parent Id]="${id[idName]}"`;
    const [headers, params] =
      this.requestPreparerService.prepareHeadersAndParams(
        baseSearchSpec,
        this.workspace,
        this.sinceFieldName,
        since,
      );
    const response = await this.requestPreparerService.sendGetRequest(
      this.url,
      headers,
      params,
    );
    if ((response.data as object).hasOwnProperty('items')) {
      return new NestedInPersonVisitsEntity(response.data);
    }
    return new InPersonVisitsEntity(response.data);
  }
}
