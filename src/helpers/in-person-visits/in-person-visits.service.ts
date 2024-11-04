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
    _type: RecordType,
    id: IdPathParams,
    since?: SinceQueryParams,
  ): Promise<InPersonVisitsEntity | NestedInPersonVisitsEntity> {
    const baseSearchSpec = `([Parent Id]="${id.id}"`;
    const [headers, params] =
      this.requestPreparerService.prepareHeadersAndParams(
        baseSearchSpec,
        this.workspace,
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
