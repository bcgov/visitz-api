import { Inject, Injectable } from '@nestjs/common';
import { CaseloadEntity } from '../../entities/caseload.entity';
import { GetRequestDetails } from '../../dto/get-request-details.dto';
import { ConfigService } from '@nestjs/config';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import {
  RecordType,
  RestrictedRecordEnum,
} from '../../common/constants/enumerations';
import {
  FilterQueryParams,
  AfterQueryParams,
} from '../../dto/filter-query-params.dto';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';
import { DateTime } from 'luxon';
import { ParallelResponse } from '../../dto/parallel-response.dto';
import { plainToInstance } from 'class-transformer';
import {
  pageSizeMax,
  pageSizeParamName,
} from '../../common/constants/upstream-constants';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Request } from 'express';

@Injectable()
export class CaseloadService {
  recordTypes: Array<string>;

  caseIdirFieldName: string;
  incidentIdirFieldName: string;
  srIdirFieldName: string;
  memoIdirFieldName: string;
  caseAfterFieldName: string;
  incidentAfterFieldName: string;
  srAfterFieldName: string;
  memoAfterFieldName: string;
  caseRestrictedFieldName: string;
  incidentRestrictedFieldName: string;
  srRestrictedFieldName: string;
  memoRestrictedFieldName: string;
  caseWorkspace: string;
  incidentWorkspace: string;
  srWorkspace: string;
  memoWorkspace: string;
  caseEndpoint: string;
  incidentEndpoint: string;
  srEndpoint: string;
  memoEndpoint: string;
  baseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly requestPreparerService: RequestPreparerService,
    private readonly utilitiesService: UtilitiesService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.recordTypes = [
      RecordType.Case,
      RecordType.Incident,
      RecordType.SR,
      RecordType.Memo,
    ];
    this.caseIdirFieldName = this.configService.get<string>(
      `upstreamAuth.case.searchspecIdirField`,
    );
    this.incidentIdirFieldName = this.configService.get<string>(
      `upstreamAuth.incident.searchspecIdirField`,
    );
    this.srIdirFieldName = this.configService.get<string>(
      `upstreamAuth.sr.searchspecIdirField`,
    );
    this.memoIdirFieldName = this.configService.get<string>(
      `upstreamAuth.memo.searchspecIdirField`,
    );
    this.caseAfterFieldName =
      this.configService.get<string>(`afterFieldName.cases`);
    this.incidentAfterFieldName = this.configService.get<string>(
      `afterFieldName.incidents`,
    );
    this.srAfterFieldName =
      this.configService.get<string>(`afterFieldName.srs`);
    this.memoAfterFieldName =
      this.configService.get<string>(`afterFieldName.memos`);
    this.caseRestrictedFieldName = this.configService.get<string>(
      `upstreamAuth.case.restrictedField`,
    );
    this.incidentRestrictedFieldName = this.configService.get<string>(
      `upstreamAuth.incident.restrictedField`,
    );
    this.srRestrictedFieldName = this.configService.get<string>(
      `upstreamAuth.sr.restrictedField`,
    );
    this.memoRestrictedFieldName = this.configService.get<string>(
      `upstreamAuth.memo.restrictedField`,
    );
    this.caseWorkspace = this.configService.get<string>(
      `upstreamAuth.case.workspace`,
    );
    this.incidentWorkspace = this.configService.get<string>(
      `upstreamAuth.incident.workspace`,
    );
    this.srWorkspace = this.configService.get<string>(
      `upstreamAuth.sr.workspace`,
    );
    this.memoWorkspace = this.configService.get<string>(
      `upstreamAuth.memo.workspace`,
    );
    this.caseEndpoint = this.configService.get<string>(
      `upstreamAuth.case.endpoint`,
    );
    this.incidentEndpoint = this.configService.get<string>(
      `upstreamAuth.incident.endpoint`,
    );
    this.srEndpoint = this.configService.get<string>(
      `upstreamAuth.sr.endpoint`,
    );
    this.memoEndpoint = this.configService.get<string>(
      `upstreamAuth.memo.endpoint`,
    );

    this.baseUrl = this.configService.get<string>(`endpointUrls.baseUrl`);
  }

  caseloadUpstreamRequestPreparer(
    idir: string,
    filter: FilterQueryParams,
  ): Array<GetRequestDetails> {
    const getRequestSpecs: Array<GetRequestDetails> = [];
    for (const type of this.recordTypes) {
      const idirFieldVarName = `${type}IdirFieldName`;
      const restrictedFieldVarName = `${type}RestrictedFieldName`;
      const baseSearchSpec =
        `([${this[idirFieldVarName]}]="${idir}"` +
        ` AND [${this[restrictedFieldVarName]}]="${RestrictedRecordEnum.False}"`;
      const [headers, params] =
        this.requestPreparerService.prepareHeadersAndParams(
          baseSearchSpec,
          this[`${type}Workspace`],
          undefined, // we filter for after ourselves
          true,
          idir,
          filter,
        );
      getRequestSpecs.push(
        new GetRequestDetails({
          url: this.baseUrl + this[`${type}Endpoint`],
          headers: headers,
          params: params,
        }),
      );
    }
    return getRequestSpecs;
  }

  caseloadMapResponse(results: ParallelResponse) {
    const caseStatus: number =
      results.responses[0].status !== 404 ? results.responses[0].status : 204;
    const caseIsError: boolean = caseStatus >= 300 || caseStatus == 204;
    const incidentStatus: number =
      results.responses[1].status !== 404 ? results.responses[1].status : 204;
    const incidentIsError: boolean =
      incidentStatus >= 300 || incidentStatus == 204;
    const srStatus: number =
      results.responses[2].status !== 404 ? results.responses[2].status : 204;
    const srIsError: boolean = srStatus >= 300 || srStatus == 204;
    const memoStatus: number =
      results.responses[3].status !== 404 ? results.responses[3].status : 204;
    const memoIsError: boolean = memoStatus >= 300 || memoStatus == 204;

    const caseResponseBody = caseIsError
      ? results.responses[0].response.data
      : results.responses[0].data.items;
    const incidentResponseBody = incidentIsError
      ? results.responses[1].response.data
      : results.responses[1].data.items;
    const srResponseBody = srIsError
      ? results.responses[2].response.data
      : results.responses[2].data.items;
    const memoResponseBody = memoIsError
      ? results.responses[3].response.data
      : results.responses[3].data.items;

    const response = {
      cases: {
        assignedIds: caseIsError
          ? []
          : caseResponseBody.map((entry) => entry['Id']),
        status: caseStatus,
        message: caseIsError ? caseResponseBody : undefined,
        items: caseIsError ? undefined : caseResponseBody,
      },
      incidents: {
        assignedIds: incidentIsError
          ? []
          : incidentResponseBody.map((entry) => entry['Id']),
        status: incidentStatus,
        message: incidentIsError ? incidentResponseBody : undefined,
        items: incidentIsError ? undefined : incidentResponseBody,
      },
      srs: {
        assignedIds: srIsError
          ? []
          : srResponseBody.map((entry) => entry['Id']),
        status: srStatus,
        message: srIsError ? srResponseBody : undefined,
        items: srIsError ? undefined : srResponseBody,
      },
      memos: {
        assignedIds: memoIsError
          ? []
          : memoResponseBody.map((entry) => entry['Id']),
        status: memoStatus,
        message: memoIsError ? memoResponseBody : undefined,
        items: memoIsError ? undefined : memoResponseBody,
      },
    };
    return response;
  }

  caseloadFilterItems(response, after: string) {
    const afterDateTime = DateTime.fromISO(after, { zone: 'utc' });
    for (const type of this.recordTypes) {
      const items = response[`${type}s`][`items`];
      const typeFieldName = `${type}AfterFieldName`;
      if (items !== undefined) {
        response[`${type}s`][`items`] = items.filter(
          (entry) =>
            this.utilitiesService.convertUpstreamDateFormatToDateTime(
              entry[`${this[typeFieldName]}`],
            ) > afterDateTime,
        );
      }
    }
    return response;
  }

  async caseloadUnsetCacheItems(response, idir: string, req: Request) {
    const jti = this.utilitiesService.grabJTI(req);
    for (const type of this.recordTypes) {
      for (const id of response[`${type}s`]['assignedIds']) {
        try {
          const replaceKey = this.utilitiesService.cacheKeyPreparer(
            idir,
            type as RecordType,
            id,
            jti,
          );
          await this.cacheManager.del(replaceKey);
        } catch {
          continue;
        }
      }
    }
  }

  async getCaseload(
    idir: string,
    req: Request,
    filter?: AfterQueryParams,
  ): Promise<CaseloadEntity> {
    const filterObject = {
      [pageSizeParamName]: pageSizeMax,
    };
    const initialFilter = plainToInstance(FilterQueryParams, filterObject, {
      enableImplicitConversion: true,
    });
    const getRequestSpecs = this.caseloadUpstreamRequestPreparer(
      idir,
      initialFilter,
    );
    const results =
      await this.requestPreparerService.parallelGetRequest(getRequestSpecs);

    if (results.overallError !== undefined) {
      throw results.overallError;
    }

    let response = this.caseloadMapResponse(results);
    if (filter?.after !== undefined) {
      response = this.caseloadFilterItems(response, filter.after);
    }

    await this.caseloadUnsetCacheItems(response, idir, req);

    return plainToInstance(CaseloadEntity, response, {
      enableImplicitConversion: true,
    });
  }
}
