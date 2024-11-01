/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { RecordType } from '../../common/constants/enumerations';
import { IdPathParams } from '../../dto/id-path-params.dto';
import { SinceQueryParams } from '../../dto/since-query-params.dto';

@Injectable()
export class InPersonVisitsService {
  async getSingleInPersonVisitRecord(
    type: RecordType,
    id: IdPathParams,
    since?: SinceQueryParams,
  ) {}
}
