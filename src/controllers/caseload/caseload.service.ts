import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  CaseloadEntity,
  OfficeCaseloadEntity,
} from '../../entities/caseload.entity';
import { GetRequestDetails } from '../../dto/get-request-details.dto';
import { ConfigService } from '@nestjs/config';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import {
  BooleanStringEnum,
  CaseType,
  EntityStatus,
  IncidentType,
  RecordType,
  YNEnum,
} from '../../common/constants/enumerations';
import {
  FilterQueryParams,
  CaseloadQueryParams,
} from '../../dto/filter-query-params.dto';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';
import { DateTime } from 'luxon';
import { ParallelResponse } from '../../dto/parallel-response.dto';
import { plainToInstance } from 'class-transformer';
import {
  pageSizeMax,
  pageSizeParamName,
  queryHierarchyParamName,
} from '../../common/constants/upstream-constants';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Request, Response } from 'express';
import {
  caseIncludeParam,
  excludeEmptyFieldsParamName,
  incidentIncludeParam,
  memoIncludeParam,
  officeNamesSeparator,
  queryHierarchyCaseChildClassName,
  queryHierarchyCaseParentClassName,
  queryHierarchyIncidentChildAdditionalClassName,
  queryHierarchyIncidentChildCallClassName,
  queryHierarchyIncidentChildConcernsClassName,
  queryHierarchyIncidentParentClassName,
  srIncludeParam,
} from '../../common/constants/parameter-constants';
import { QueryHierarchyComponent } from '../../dto/query-hierarchy-component.dto';
import { CaseExample, CasePositionExample } from '../../entities/case.entity';
import { caseloadIncludeEntityError } from '../../common/constants/error-constants';
import {
  IncidentAdditionalInformationExample,
  IncidentCallInformationExample,
  IncidentConcernsExample,
  IncidentExample,
} from '../../entities/incident.entity';

@Injectable()
export class CaseloadService {
  recordTypes: Array<RecordType>;

  caseIdirFieldName: string;
  incidentIdirFieldName: string;
  srIdirFieldName: string;
  memoIdirFieldName: string;
  caseStatusFieldName: string;
  incidentStatusFieldName: string;
  srStatusFieldName: string;
  memoStatusFieldName: string;
  caseOfficeFieldName: string;
  incidentOfficeFieldName: string;
  srOfficeFieldName: string;
  memoOfficeFieldName: string;
  caseAfterFieldName: string;
  incidentAfterFieldName: string;
  srAfterFieldName: string;
  memoAfterFieldName: string;
  caseRestrictedFieldName: string;
  incidentRestrictedFieldName: string;
  srRestrictedFieldName: string;
  memoRestrictedFieldName: string;
  caseTypeFieldName: string;
  incidentTypeFieldName: string;
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
    this.caseStatusFieldName = this.configService.get<string>(
      `upstreamAuth.case.statusField`,
    );
    this.incidentStatusFieldName = this.configService.get<string>(
      `upstreamAuth.incident.statusField`,
    );
    this.srStatusFieldName = this.configService.get<string>(
      `upstreamAuth.sr.statusField`,
    );
    this.memoStatusFieldName = this.configService.get<string>(
      `upstreamAuth.memo.statusField`,
    );
    this.caseOfficeFieldName = this.configService.get<string>(
      `upstreamAuth.case.officeField`,
    );
    this.incidentOfficeFieldName = this.configService.get<string>(
      `upstreamAuth.incident.officeField`,
    );
    this.srOfficeFieldName = this.configService.get<string>(
      `upstreamAuth.sr.officeField`,
    );
    this.memoOfficeFieldName = this.configService.get<string>(
      `upstreamAuth.memo.officeField`,
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
    this.caseTypeFieldName = this.configService.get<string>(
      `upstreamAuth.case.typeField`,
    );
    this.incidentTypeFieldName = this.configService.get<string>(
      `upstreamAuth.incident.typeField`,
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

  recordTypeSearchSpecAppend(params, type: RecordType) {
    if (type === RecordType.Case) {
      params['searchspec'] =
        params['searchspec'] +
        ` AND ([${this.caseTypeFieldName}]="${CaseType.ChildServices}"` +
        ` OR [${this.caseTypeFieldName}]="${CaseType.FamilyServices}")`;
    } else if (type == RecordType.Incident) {
      params['searchspec'] =
        params['searchspec'] +
        ` AND ([${this.incidentTypeFieldName}]="${IncidentType.ChildProtection}")`;
    }
    return params;
  }

  caseloadUpstreamRequestPreparer(
    idir: string,
    filter: FilterQueryParams,
    entityTypes: RecordType[],
  ): Array<GetRequestDetails> {
    const getRequestSpecs: Array<GetRequestDetails> = [];
    for (const type of entityTypes) {
      const idirFieldVarName = `${type}IdirFieldName`;
      const statusFieldVarName = `${type}StatusFieldName`;
      const restrictedFieldVarName = `${type}RestrictedFieldName`;
      let baseSearchSpec = ``;
      if (type === RecordType.Case || type == RecordType.Incident) {
        baseSearchSpec = `EXISTS `;
      }
      baseSearchSpec =
        baseSearchSpec +
        `([${this[idirFieldVarName]}]="${idir}") AND ([${this[statusFieldVarName]}]="${EntityStatus.Open}")` +
        ` AND ([${this[restrictedFieldVarName]}]="${YNEnum.False}"`;
      // eslint-disable-next-line prefer-const
      let [headers, params] =
        this.requestPreparerService.prepareHeadersAndParams(
          baseSearchSpec,
          this[`${type}Workspace`],
          undefined, // we filter for after ourselves
          true,
          idir,
          filter,
        );
      params = this.recordTypeSearchSpecAppend(params, type as RecordType);
      if (type === RecordType.Case) {
        params[queryHierarchyParamName] =
          this.utilitiesService.constructQueryHierarchy(
            new QueryHierarchyComponent({
              classExample: CaseExample,
              name: queryHierarchyCaseParentClassName,
              searchspec: params['searchspec'],
              exclude: [queryHierarchyCaseChildClassName],
              childComponents: [
                new QueryHierarchyComponent({
                  classExample: CasePositionExample,
                  name: queryHierarchyCaseChildClassName,
                }),
              ],
            }),
          );
        delete params['searchspec'];
      } else if (type === RecordType.Incident) {
        params[queryHierarchyParamName] =
          this.utilitiesService.constructQueryHierarchy(
            new QueryHierarchyComponent({
              classExample: IncidentExample,
              name: queryHierarchyIncidentParentClassName,
              searchspec: params['searchspec'],
              exclude: [
                queryHierarchyIncidentChildAdditionalClassName,
                queryHierarchyIncidentChildCallClassName,
                queryHierarchyIncidentChildConcernsClassName,
              ],
              childComponents: [
                new QueryHierarchyComponent({
                  classExample: IncidentAdditionalInformationExample,
                  name: queryHierarchyIncidentChildAdditionalClassName,
                }),
                new QueryHierarchyComponent({
                  classExample: IncidentCallInformationExample,
                  name: queryHierarchyIncidentChildCallClassName,
                }),
                new QueryHierarchyComponent({
                  classExample: IncidentConcernsExample,
                  name: queryHierarchyIncidentChildConcernsClassName,
                }),
              ],
            }),
          );
        delete params['searchspec'];
      }
      getRequestSpecs.push(
        new GetRequestDetails({
          url: this.baseUrl + this[`${type}Endpoint`],
          headers: headers,
          params: params,
          type: type,
        }),
      );
    }
    return getRequestSpecs;
  }

  officeCaseloadUpstreamRequestPreparer(
    idir: string,
    filter: FilterQueryParams,
    officeNames: string,
    entityTypes: RecordType[],
  ): Array<GetRequestDetails> {
    const getRequestSpecs: Array<GetRequestDetails> = [];
    for (const type of entityTypes) {
      const idirFieldVarName = `${type}IdirFieldName`;
      const officeFieldVarName = `${type}OfficeFieldName`;
      const statusFieldVarName = `${type}StatusFieldName`;
      const restrictedFieldVarName = `${type}RestrictedFieldName`;
      let baseSearchSpec =
        `(` +
        this.utilitiesService.officeNamesStringToSearchSpec(
          officeNames,
          `${this[officeFieldVarName]}`,
        ) +
        ' OR ';
      if (type === RecordType.Case || type == RecordType.Incident) {
        baseSearchSpec = baseSearchSpec + `EXISTS `;
      }
      baseSearchSpec =
        baseSearchSpec +
        `([${this[idirFieldVarName]}]="${idir}"))` +
        ` AND ([${this[statusFieldVarName]}]="${EntityStatus.Open}") AND (` +
        `[${this[restrictedFieldVarName]}]="${YNEnum.False}"`;
      // eslint-disable-next-line prefer-const
      let [headers, params] =
        this.requestPreparerService.prepareHeadersAndParams(
          baseSearchSpec,
          this[`${type}Workspace`],
          undefined, // we filter for after ourselves
          true,
          idir,
          filter,
        );
      params = this.recordTypeSearchSpecAppend(params, type as RecordType);
      if (type === RecordType.Case) {
        params[queryHierarchyParamName] =
          this.utilitiesService.constructQueryHierarchy(
            new QueryHierarchyComponent({
              classExample: CaseExample,
              name: queryHierarchyCaseParentClassName,
              searchspec: params['searchspec'],
              exclude: [queryHierarchyCaseChildClassName],
              childComponents: [
                new QueryHierarchyComponent({
                  classExample: CasePositionExample,
                  name: queryHierarchyCaseChildClassName,
                }),
              ],
            }),
          );
        delete params['searchspec'];
      } else if (type === RecordType.Incident) {
        params[queryHierarchyParamName] =
          this.utilitiesService.constructQueryHierarchy(
            new QueryHierarchyComponent({
              classExample: IncidentExample,
              name: queryHierarchyIncidentParentClassName,
              searchspec: params['searchspec'],
              exclude: [
                queryHierarchyIncidentChildAdditionalClassName,
                queryHierarchyIncidentChildCallClassName,
                queryHierarchyIncidentChildConcernsClassName,
              ],
              childComponents: [
                new QueryHierarchyComponent({
                  classExample: IncidentAdditionalInformationExample,
                  name: queryHierarchyIncidentChildAdditionalClassName,
                }),
                new QueryHierarchyComponent({
                  classExample: IncidentCallInformationExample,
                  name: queryHierarchyIncidentChildCallClassName,
                }),
                new QueryHierarchyComponent({
                  classExample: IncidentConcernsExample,
                  name: queryHierarchyIncidentChildConcernsClassName,
                }),
              ],
            }),
          );
        delete params['searchspec'];
      }
      getRequestSpecs.push(
        new GetRequestDetails({
          url: this.baseUrl + this[`${type}Endpoint`],
          headers: headers,
          params: params,
          type: type,
        }),
      );
    }
    return getRequestSpecs;
  }

  caseloadMapResponse(results: ParallelResponse) {
    const typeIndicies = {
      caseIndex: -1,
      incidentIndex: -1,
      srIndex: -1,
      memoIndex: -1,
    };
    let currentIndex = 0;
    for (const type of results.orderedTypes) {
      const currentTypeIndex = `${type}Index`;
      typeIndicies[currentTypeIndex] = currentIndex;
      currentIndex = currentIndex + 1;
    }

    const response = {};
    if (typeIndicies.caseIndex > -1) {
      const caseStatus: number =
        results.responses[typeIndicies.caseIndex].status !== 404
          ? results.responses[typeIndicies.caseIndex].status
          : 204;
      const caseIsError: boolean = caseStatus >= 300 || caseStatus == 204;
      const caseResponseBody = caseIsError
        ? results.responses[typeIndicies.caseIndex].response.data
        : results.responses[typeIndicies.caseIndex].data.items;
      response['cases'] = {
        assignedIds: caseIsError
          ? []
          : caseResponseBody.map((entry) => entry['Id']),
        status: caseStatus,
        message: caseIsError ? caseResponseBody : undefined,
        items: caseIsError ? undefined : caseResponseBody,
      };
    }
    if (typeIndicies.incidentIndex > -1) {
      const incidentStatus: number =
        results.responses[typeIndicies.incidentIndex].status !== 404
          ? results.responses[typeIndicies.incidentIndex].status
          : 204;
      const incidentIsError: boolean =
        incidentStatus >= 300 || incidentStatus == 204;
      const incidentResponseBody = incidentIsError
        ? results.responses[typeIndicies.incidentIndex].response.data
        : results.responses[typeIndicies.incidentIndex].data.items;
      response['incidents'] = {
        assignedIds: incidentIsError
          ? []
          : incidentResponseBody.map((entry) => entry['Id']),
        status: incidentStatus,
        message: incidentIsError ? incidentResponseBody : undefined,
        items: incidentIsError ? undefined : incidentResponseBody,
      };
    }
    if (typeIndicies.srIndex > -1) {
      const srStatus: number =
        results.responses[typeIndicies.srIndex].status !== 404
          ? results.responses[typeIndicies.srIndex].status
          : 204;
      const srIsError: boolean = srStatus >= 300 || srStatus == 204;
      const srResponseBody = srIsError
        ? results.responses[typeIndicies.srIndex].response.data
        : results.responses[typeIndicies.srIndex].data.items;
      response['srs'] = {
        assignedIds: srIsError
          ? []
          : srResponseBody.map((entry) => entry['Id']),
        status: srStatus,
        message: srIsError ? srResponseBody : undefined,
        items: srIsError ? undefined : srResponseBody,
      };
    }
    if (typeIndicies.memoIndex > -1) {
      const memoStatus: number =
        results.responses[typeIndicies.memoIndex].status !== 404
          ? results.responses[typeIndicies.memoIndex].status
          : 204;
      const memoIsError: boolean = memoStatus >= 300 || memoStatus == 204;
      const memoResponseBody = memoIsError
        ? results.responses[typeIndicies.memoIndex].response.data
        : results.responses[typeIndicies.memoIndex].data.items;
      response['memos'] = {
        assignedIds: memoIsError
          ? []
          : memoResponseBody.map((entry) => entry['Id']),
        status: memoStatus,
        message: memoIsError ? memoResponseBody : undefined,
        items: memoIsError ? undefined : memoResponseBody,
      };
    }

    return response;
  }

  caseloadFilterItemsAfter(response, after: string, entityTypes: RecordType[]) {
    const afterDateTime = DateTime.fromISO(after, { zone: 'utc' });
    for (const type of entityTypes) {
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

  async caseloadUnsetCacheItems(
    response,
    idir: string,
    req: Request,
    entityTypes: RecordType[],
  ) {
    const jti = this.utilitiesService.grabJTI(req);
    for (const type of entityTypes) {
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

  createEntityTypeArray(filter?: CaseloadQueryParams): RecordType[] {
    if (filter) {
      const entityTypeArray: RecordType[] = [];
      if (filter[caseIncludeParam] !== BooleanStringEnum.False) {
        entityTypeArray.push(RecordType.Case);
      }
      if (filter[incidentIncludeParam] !== BooleanStringEnum.False) {
        entityTypeArray.push(RecordType.Incident);
      }
      if (filter[srIncludeParam] !== BooleanStringEnum.False) {
        entityTypeArray.push(RecordType.SR);
      }
      if (filter[memoIncludeParam] !== BooleanStringEnum.False) {
        entityTypeArray.push(RecordType.Memo);
      }
      if (entityTypeArray.length < 1) {
        throw new BadRequestException(caseloadIncludeEntityError);
      }
      return entityTypeArray;
    }
    return structuredClone(this.recordTypes);
  }

  async getMapAndFilterCaseload(
    getRequestSpecs: Array<GetRequestDetails>,
    idir: string,
    req: Request,
    entityTypes: RecordType[],
    filter?: FilterQueryParams,
    res?: Response,
  ) {
    const results = await this.requestPreparerService.parallelGetRequest(
      getRequestSpecs,
      res,
    );

    if (results.overallError !== undefined) {
      throw results.overallError;
    }

    let response = this.caseloadMapResponse(results);
    if (filter?.after !== undefined) {
      response = this.caseloadFilterItemsAfter(
        response,
        filter.after,
        entityTypes,
      );
    }

    await this.caseloadUnsetCacheItems(response, idir, req, entityTypes);

    return response;
  }

  async getCaseload(
    idir: string,
    req: Request,
    filter?: CaseloadQueryParams,
  ): Promise<CaseloadEntity> {
    const entityTypes = this.createEntityTypeArray(filter);
    const filterObject = {
      [pageSizeParamName]: pageSizeMax,
    };
    if (filter && filter[excludeEmptyFieldsParamName] !== undefined) {
      filterObject[excludeEmptyFieldsParamName] =
        filter[excludeEmptyFieldsParamName];
    }
    const initialFilter = plainToInstance(FilterQueryParams, filterObject, {
      enableImplicitConversion: true,
    });
    const getRequestSpecs = this.caseloadUpstreamRequestPreparer(
      idir,
      initialFilter,
      entityTypes,
    );
    const response = await this.getMapAndFilterCaseload(
      getRequestSpecs,
      idir,
      req,
      entityTypes,
      filter,
    );
    return plainToInstance(CaseloadEntity, response, {
      enableImplicitConversion: true,
    });
  }

  async getOfficeCaseload(
    idir: string,
    req: Request,
    res: Response,
    officeNames: string,
    filter?: CaseloadQueryParams,
  ) {
    const entityTypes = this.createEntityTypeArray(filter);
    const getRequestSpecs = this.officeCaseloadUpstreamRequestPreparer(
      idir,
      filter,
      officeNames,
      entityTypes,
    );
    const response = await this.getMapAndFilterCaseload(
      getRequestSpecs,
      idir,
      req,
      entityTypes,
      filter,
      res,
    );
    response['officeNames'] = officeNames.split(officeNamesSeparator);
    return plainToInstance(OfficeCaseloadEntity, response, {
      enableImplicitConversion: true,
    });
  }
}
