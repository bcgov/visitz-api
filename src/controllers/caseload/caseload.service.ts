import { Injectable } from '@nestjs/common';
import { CaseloadEntity } from '../../entities/caseload.entity';
import { GetRequestDetails } from '../../dto/get-request-details.dto';
import { ConfigService } from '@nestjs/config';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import {
  RecordType,
  RestrictedRecordEnum,
} from '../../common/constants/enumerations';
import { SinceQueryParams } from '../../dto/filter-query-params.dto';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';
import { DateTime } from 'luxon';
import { ParalellResponse } from '../../dto/parallel-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CaseloadService {
  recordTypes: Array<string>;

  caseIdirFieldName: string;
  incidentIdirFieldName: string;
  caseSinceFieldName: string;
  incidentSinceFieldName: string;
  caseRestrictedFieldName: string;
  incidentRestrictedFieldName: string;
  caseWorkspace: string;
  incidentWorkspace: string;
  caseEndpoint: string;
  incidentEndpoint: string;
  baseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly requestPreparerService: RequestPreparerService,
    private readonly utilitiesService: UtilitiesService,
  ) {
    this.recordTypes = [RecordType.Case, RecordType.Incident];
    this.caseIdirFieldName = this.configService.get<string>(
      `upstreamAuth.case.idirField`,
    );
    this.incidentIdirFieldName = this.configService.get<string>(
      `upstreamAuth.incident.idirField`,
    );
    this.caseSinceFieldName =
      this.configService.get<string>(`sinceFieldName.cases`);
    this.incidentSinceFieldName = this.configService.get<string>(
      `sinceFieldName.incidents`,
    );
    this.caseRestrictedFieldName = this.configService.get<string>(
      `upstreamAuth.case.restrictedField`,
    );
    this.incidentRestrictedFieldName = this.configService.get<string>(
      `upstreamAuth.incident.restrictedField`,
    );
    this.caseWorkspace = this.configService.get<string>(
      `upstreamAuth.case.workspace`,
    );
    this.incidentWorkspace = this.configService.get<string>(
      `upstreamAuth.incident.workspace`,
    );
    this.caseEndpoint = this.configService.get<string>(
      `upstreamAuth.case.endpoint`,
    );
    this.incidentEndpoint = this.configService.get<string>(
      `upstreamAuth.incident.endpoint`,
    );

    this.baseUrl = this.configService.get<string>(`endpointUrls.baseUrl`);
  }

  caseloadUpstreamRequestPreparer(idir: string): Array<GetRequestDetails> {
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
          this[`${type}SinceFieldName`],
          true,
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

  caseloadMapResponse(results: ParalellResponse) {
    const caseStatus: number =
      results.responses[0].status !== 404 ? results.responses[0].status : 204;
    const caseIsError: boolean = caseStatus >= 300 || caseStatus == 204;
    const incidentStatus: number =
      results.responses[1].status !== 404 ? results.responses[1].status : 204;
    const incidentIsError: boolean =
      incidentStatus >= 300 || incidentStatus == 204;

    const caseResponseBody = caseIsError
      ? results.responses[0].response.data
      : results.responses[0].data.items;
    const incidentResponseBody = incidentIsError
      ? results.responses[1].response.data
      : results.responses[1].data.items;

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
    };
    return response;
  }

  caseloadFilterItems(response, since: string) {
    const sinceDateTime = DateTime.fromISO(since);
    for (const type of this.recordTypes) {
      const items = response[`${type}s`][`items`];
      const typeFieldName = `${type}SinceFieldName`;
      if (items !== undefined) {
        response[`${type}s`][`items`] = items.filter(
          (entry) =>
            this.utilitiesService.convertUpstreamDateFormatToDateTime(
              entry[`${this[typeFieldName]}`],
            ) >= sinceDateTime,
        );
      }
    }
    return response;
  }

  async getCaseload(
    idir: string,
    filter?: SinceQueryParams,
  ): Promise<CaseloadEntity> {
    const getRequestSpecs = this.caseloadUpstreamRequestPreparer(idir);
    const results =
      await this.requestPreparerService.parallelGetRequest(getRequestSpecs);

    if (results.overallError !== undefined) {
      throw results.overallError;
    }
    let response = this.caseloadMapResponse(results);
    if (filter?.since !== undefined) {
      response = this.caseloadFilterItems(response, filter.since);
    }
    return plainToInstance(CaseloadEntity, response, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }
}
