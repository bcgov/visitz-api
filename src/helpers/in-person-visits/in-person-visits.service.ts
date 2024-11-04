import { Injectable } from '@nestjs/common';
import { RecordType } from '../../common/constants/enumerations';
import { IdPathParams } from '../../dto/id-path-params.dto';
import { SinceQueryParams } from '../../dto/since-query-params.dto';
import { ConfigService } from '@nestjs/config';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';

@Injectable()
export class InPersonVisitsService {
  url: string;
  workspace: string | undefined;
  constructor(
    private readonly configService: ConfigService,
    private readonly requestPreparerService: RequestPreparerService,
  ) {
    this.url = (
      this.configService.get<string>('UPSTREAM_BASE_URL') +
      this.configService.get<string>('IN_PERSON_VISITS_ENDPOINT')
    ).replace(/\s/g, '%20');
    this.workspace = this.configService.get('workspaces.inPersonVisits');
  }
  async getSingleInPersonVisitRecord(
    type: RecordType,
    id: IdPathParams,
    since?: SinceQueryParams,
  ) {
    const [headers, params] =
      this.requestPreparerService.prepareHeadersAndParams(
        type,
        id,
        this.workspace,
        since,
      );
    const response = await this.requestPreparerService.sendGetRequest(
      this.url,
      headers,
      params,
    );
    // TODO: Pass info to entity constructs once created
    return response.data;
  }
}
