import { Test, TestingModule } from '@nestjs/testing';
import { CaseloadService } from './caseload.service';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import { TokenRefresherService } from '../../external-api/token-refresher/token-refresher.service';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../../configuration/configuration';
import { JwtService } from '@nestjs/jwt';
import {
  CaseloadQueryParams,
  FilterQueryParams,
} from '../../dto/filter-query-params.dto';
import {
  CHILD_LINKS,
  CONTENT_TYPE,
  afterParamName,
  UNIFORM_RESPONSE,
  uniformResponseParamName,
  VIEW_MODE,
  officeNamesSeparator,
  queryHierarchyCaseChildPositionClassName,
  queryHierarchyCaseParentClassName,
  queryHierarchyIncidentChildAdditionalClassName,
  queryHierarchyIncidentChildCallClassName,
  queryHierarchyIncidentChildConcernsClassName,
  queryHierarchyIncidentParentClassName,
  queryHierarchyCaseChildContactClassName,
  queryHierarchyIncidentChildContactClassName,
  queryHierarchySRChildAdditionalClassName,
  queryHierarchySRChildCallClassName,
  queryHierarchySRChildContactClassName,
  queryHierarchySRParentClassName,
  queryHierarchyMemoChildAdditionalClassName,
  queryHierarchyMemoChildCallClassName,
  queryHierarchyMemoChildContactClassName,
  queryHierarchyMemoParentClassName,
} from '../../common/constants/parameter-constants';
import { getMockReq, getMockRes } from '@jest-mock/express';
import {
  CaseloadCompleteResponseExample,
  CaseloadEntity,
  CaseloadLaterDateResponseExample,
  OfficeCaseloadCompleteResponseExample,
  OfficeCaseloadEntity,
} from '../../entities/caseload.entity';
import { Cache } from 'cache-manager';
import {
  BooleanStringEnum,
  CaseType,
  EntityStatus,
  IncidentType,
  RecordType,
  YNEnum,
} from '../../common/constants/enumerations';
import { plainToInstance } from 'class-transformer';
import {
  pageSizeParamName,
  pageSizeMax,
  trustedIdirHeaderName,
  idirJWTFieldName,
  queryHierarchyParamName,
  recordCountNeededParamName,
  fieldsParamName,
} from '../../common/constants/upstream-constants';
import { CaseExample, CasePositionExample } from '../../entities/case.entity';
import {
  IncidentConcernsExample,
  IncidentExample,
} from '../../entities/incident.entity';
import { MemoExample } from '../../entities/memo.entity';
import { SRExample } from '../../entities/sr.entity';
import { QueryHierarchyComponent } from '../../dto/query-hierarchy-component.dto';
import {
  IncidentCallInformationExample,
  MemoCallInformationExample,
  SRCallInformationExample,
} from '../../entities/call-information.entity';
import {
  IncidentAdditionalInformationExample,
  MemoAdditionalInformationExample,
  SRAdditionalInformationExample,
} from '../../entities/additional-information.entity';
import {
  ContactsSingleResponseCaseExample,
  ContactsSingleResponseIncidentExample,
  ContactsSingleResponseMemoExample,
  ContactsSingleResponseSRExample,
} from '../../entities/contacts.entity';

describe('CaseloadService', () => {
  let service: CaseloadService;
  let configService: ConfigService;
  let cacheManager: Cache;
  let requestPreparerService: RequestPreparerService;
  let jwtService: JwtService;
  let utilitiesService: UtilitiesService;
  const { res, mockClear } = getMockRes();
  const officeNames = `Office Name 1${officeNamesSeparator}Office Name 2`;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        ConfigModule.forRoot({ load: [configuration] }),
        CacheModule.register({ isGlobal: true }),
      ],
      providers: [
        CaseloadService,
        UtilitiesService,
        JwtService,
        TokenRefresherService,
        RequestPreparerService,
      ],
    }).compile();

    service = module.get<CaseloadService>(CaseloadService);
    configService = module.get<ConfigService>(ConfigService);
    cacheManager = module.get(CACHE_MANAGER);
    requestPreparerService = module.get<RequestPreparerService>(
      RequestPreparerService,
    );
    jwtService = module.get<JwtService>(JwtService);
    utilitiesService = module.get<UtilitiesService>(UtilitiesService);

    configService.set('afterFieldName.cases', 'Last Updated Date');
    configService.set('afterFieldName.incidents', 'Updated Date');
    configService.set('afterFieldName.srs', 'Updated Date');
    configService.set('afterFieldName.memos', 'Updated Date');
    configService.set('upstreamAuth.case.restrictedField', 'Restricted Flag');
    configService.set(
      'upstreamAuth.incident.restrictedField',
      'Restricted Flag',
    );
    configService.set('upstreamAuth.sr.restrictedField', 'Restricted Flag');
    configService.set('upstreamAuth.memo.restrictedField', 'ICMCPU Restricted');
    mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('caseloadUpstreamRequestPreparer tests', () => {
    it.each([[BooleanStringEnum.False], [BooleanStringEnum.True]])(
      `prepares a request for upstream`,
      (recordCountNeeded) => {
        const idir = 'testIdir';
        const inputFilter = {
          [pageSizeParamName]: pageSizeMax,
        };
        if (recordCountNeeded === BooleanStringEnum.True) {
          inputFilter[recordCountNeededParamName] = recordCountNeeded;
        }
        const filter = plainToInstance(FilterQueryParams, inputFilter, {
          enableImplicitConversion: true,
        });
        const getRequestSpecs = service.caseloadUpstreamRequestPreparer(
          idir,
          filter,
          service.recordTypes,
        );
        const baseUrl = configService.get<string>(`endpointUrls.baseUrl`);
        const caseEndpoint = configService.get<string>(
          `upstreamAuth.case.endpoint`,
        );
        const incidentEndpoint = configService.get<string>(
          `upstreamAuth.incident.endpoint`,
        );
        const srEndpoint = configService.get<string>(
          `upstreamAuth.sr.endpoint`,
        );
        const memoEndpoint = configService.get<string>(
          `upstreamAuth.memo.endpoint`,
        );
        const caseIdirFieldName = configService.get<string>(
          `upstreamAuth.case.searchspecIdirField`,
        );
        const incidentIdirFieldName = configService.get<string>(
          `upstreamAuth.incident.searchspecIdirField`,
        );
        const srIdirFieldName = configService.get<string>(
          `upstreamAuth.sr.searchspecIdirField`,
        );
        const memoIdirFieldName = configService.get<string>(
          `upstreamAuth.memo.searchspecIdirField`,
        );
        const caseTypeFieldName = configService.get<string>(
          `upstreamAuth.case.typeField`,
        );
        const incidentTypeFieldName = configService.get<string>(
          `upstreamAuth.incident.typeField`,
        );
        const caseStatusFieldName = configService.get<string>(
          `upstreamAuth.case.statusField`,
        );
        const incidentStatusFieldName = configService.get<string>(
          `upstreamAuth.incident.statusField`,
        );
        const srStatusFieldName = configService.get<string>(
          `upstreamAuth.sr.statusField`,
        );
        const memoStatusFieldName = configService.get<string>(
          `upstreamAuth.memo.statusField`,
        );
        const caseRestrictedFieldName = configService.get<string>(
          `upstreamAuth.case.restrictedField`,
        );
        const incidentRestrictedFieldName = configService.get<string>(
          `upstreamAuth.incident.restrictedField`,
        );
        const srRestrictedFieldName = configService.get<string>(
          `upstreamAuth.sr.restrictedField`,
        );
        const memoRestrictedFieldName = configService.get<string>(
          `upstreamAuth.memo.restrictedField`,
        );
        const headers = {
          Accept: CONTENT_TYPE,
          'Accept-Encoding': '*',
          [trustedIdirHeaderName]: idir,
        };
        const params = {
          ViewMode: VIEW_MODE,
          ChildLinks: CHILD_LINKS,
          [uniformResponseParamName]: UNIFORM_RESPONSE,
          [pageSizeParamName]: pageSizeMax,
        };
        const caseSearchSpec = `(EXISTS ([${caseIdirFieldName}]="${idir}")) AND ([${caseStatusFieldName}]="${EntityStatus.Open}") AND ([${caseRestrictedFieldName}]="${YNEnum.False}") AND ([${caseTypeFieldName}]="${CaseType.ChildServices}" OR [${caseTypeFieldName}]="${CaseType.FamilyServices}" OR [${caseTypeFieldName}]="${CaseType.CYSNFamilyServices}")`;
        const incidentSearchSpec = `(EXISTS ([${incidentIdirFieldName}]="${idir}")) AND ([${incidentStatusFieldName}]="${EntityStatus.Open}") AND ([${incidentRestrictedFieldName}]="${YNEnum.False}") AND ([${incidentTypeFieldName}]="${IncidentType.ChildProtection}")`;
        const srSearchSpec = `(([${srIdirFieldName}]="${idir}")) AND ([${srStatusFieldName}]="${EntityStatus.Open}") AND ([${srRestrictedFieldName}]="${YNEnum.False}")`;
        const memoSearchSpec = `(([${memoIdirFieldName}]="${idir}")) AND ([${memoStatusFieldName}]="${EntityStatus.Open}") AND ([${memoRestrictedFieldName}]="${YNEnum.False}")`;
        const caseParams = {
          ...params,
          [queryHierarchyParamName]: utilitiesService.constructQueryHierarchy(
            new QueryHierarchyComponent({
              classExample: CaseExample,
              name: queryHierarchyCaseParentClassName,
              searchspec: caseSearchSpec,
              exclude: [
                queryHierarchyCaseChildPositionClassName,
                queryHierarchyCaseChildContactClassName,
              ],
              childComponents: [
                new QueryHierarchyComponent({
                  classExample: CasePositionExample,
                  name: queryHierarchyCaseChildPositionClassName,
                }),
                new QueryHierarchyComponent({
                  classExample: ContactsSingleResponseCaseExample,
                  name: queryHierarchyCaseChildContactClassName,
                }),
              ],
            }),
          ),
        };
        const incidentParams = {
          ...params,
          [queryHierarchyParamName]: utilitiesService.constructQueryHierarchy(
            new QueryHierarchyComponent({
              classExample: IncidentExample,
              name: queryHierarchyIncidentParentClassName,
              searchspec: incidentSearchSpec,
              exclude: [
                queryHierarchyIncidentChildAdditionalClassName,
                queryHierarchyIncidentChildCallClassName,
                queryHierarchyIncidentChildConcernsClassName,
                queryHierarchyIncidentChildContactClassName,
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
                new QueryHierarchyComponent({
                  classExample: ContactsSingleResponseIncidentExample,
                  name: queryHierarchyIncidentChildContactClassName,
                }),
              ],
            }),
          ),
        };
        const srParams = {
          ...params,
          [queryHierarchyParamName]: utilitiesService.constructQueryHierarchy(
            new QueryHierarchyComponent({
              classExample: SRExample,
              name: queryHierarchySRParentClassName,
              searchspec: srSearchSpec,
              exclude: [
                queryHierarchySRChildAdditionalClassName,
                queryHierarchySRChildCallClassName,
                queryHierarchySRChildContactClassName,
              ],
              childComponents: [
                new QueryHierarchyComponent({
                  classExample: SRAdditionalInformationExample,
                  name: queryHierarchySRChildAdditionalClassName,
                }),
                new QueryHierarchyComponent({
                  classExample: SRCallInformationExample,
                  name: queryHierarchySRChildCallClassName,
                }),
                new QueryHierarchyComponent({
                  classExample: ContactsSingleResponseSRExample,
                  name: queryHierarchySRChildContactClassName,
                }),
              ],
            }),
          ),
        };
        const memoParams = {
          ...params,
          [queryHierarchyParamName]: utilitiesService.constructQueryHierarchy(
            new QueryHierarchyComponent({
              classExample: MemoExample,
              name: queryHierarchyMemoParentClassName,
              searchspec: memoSearchSpec,
              exclude: [
                queryHierarchyMemoChildAdditionalClassName,
                queryHierarchyMemoChildCallClassName,
                queryHierarchyMemoChildContactClassName,
              ],
              childComponents: [
                new QueryHierarchyComponent({
                  classExample: MemoAdditionalInformationExample,
                  name: queryHierarchyMemoChildAdditionalClassName,
                }),
                new QueryHierarchyComponent({
                  classExample: MemoCallInformationExample,
                  name: queryHierarchyMemoChildCallClassName,
                }),
                new QueryHierarchyComponent({
                  classExample: ContactsSingleResponseMemoExample,
                  name: queryHierarchyMemoChildContactClassName,
                }),
              ],
            }),
          ),
        };
        if (recordCountNeeded === BooleanStringEnum.False) {
          expect(getRequestSpecs.length).toBe(4);
        }
        expect(getRequestSpecs[0].url).toBe(baseUrl + caseEndpoint);
        expect(getRequestSpecs[0].headers).toMatchObject(headers);
        expect(getRequestSpecs[0].params).toMatchObject(caseParams);
        expect(getRequestSpecs[1].url).toBe(baseUrl + incidentEndpoint);
        expect(getRequestSpecs[1].headers).toMatchObject(headers);
        expect(getRequestSpecs[1].params).toMatchObject(incidentParams);
        expect(getRequestSpecs[2].url).toBe(baseUrl + srEndpoint);
        expect(getRequestSpecs[2].headers).toMatchObject(headers);
        expect(getRequestSpecs[2].params).toMatchObject(srParams);
        expect(getRequestSpecs[3].url).toBe(baseUrl + memoEndpoint);
        expect(getRequestSpecs[3].headers).toMatchObject(headers);
        expect(getRequestSpecs[3].params).toMatchObject(memoParams);

        if (recordCountNeeded === BooleanStringEnum.True) {
          const countParams = {
            ...params,
            [recordCountNeededParamName]: BooleanStringEnum.True,
            [fieldsParamName]: 'Id',
          };
          const caseCountParams = {
            ...countParams,
            searchspec: caseSearchSpec,
          };
          const incidentCountParams = {
            ...countParams,
            searchspec: incidentSearchSpec,
          };
          const srCountParams = {
            ...countParams,
            searchspec: srSearchSpec,
          };
          const memoCountParams = {
            ...countParams,
            searchspec: memoSearchSpec,
          };

          expect(getRequestSpecs.length).toBe(8);
          expect(getRequestSpecs[4].url).toBe(baseUrl + caseEndpoint);
          expect(getRequestSpecs[4].headers).toMatchObject(headers);
          expect(getRequestSpecs[4].params).toMatchObject(caseCountParams);
          expect(getRequestSpecs[5].url).toBe(baseUrl + incidentEndpoint);
          expect(getRequestSpecs[5].headers).toMatchObject(headers);
          expect(getRequestSpecs[5].params).toMatchObject(incidentCountParams);
          expect(getRequestSpecs[6].url).toBe(baseUrl + srEndpoint);
          expect(getRequestSpecs[6].headers).toMatchObject(headers);
          expect(getRequestSpecs[6].params).toMatchObject(srCountParams);
          expect(getRequestSpecs[7].url).toBe(baseUrl + memoEndpoint);
          expect(getRequestSpecs[7].headers).toMatchObject(headers);
          expect(getRequestSpecs[7].params).toMatchObject(memoCountParams);
        }
      },
    );
  });

  describe('officeCaseloadUpstreamRequestPreparer tests', () => {
    it.each([[BooleanStringEnum.False], [BooleanStringEnum.True]])(
      `prepares a request for upstream`,
      (recordCountNeeded) => {
        const idir = 'testIdir';
        const inputFilter = {
          [pageSizeParamName]: pageSizeMax,
        };
        if (recordCountNeeded === BooleanStringEnum.True) {
          inputFilter[recordCountNeededParamName] = recordCountNeeded;
        }
        const filter = plainToInstance(FilterQueryParams, inputFilter, {
          enableImplicitConversion: true,
        });
        const getRequestSpecs = service.officeCaseloadUpstreamRequestPreparer(
          idir,
          filter,
          officeNames,
          service.recordTypes,
        );
        const baseUrl = configService.get<string>(`endpointUrls.baseUrl`);
        const caseEndpoint = configService.get<string>(
          `upstreamAuth.case.endpoint`,
        );
        const incidentEndpoint = configService.get<string>(
          `upstreamAuth.incident.endpoint`,
        );
        const srEndpoint = configService.get<string>(
          `upstreamAuth.sr.endpoint`,
        );
        const memoEndpoint = configService.get<string>(
          `upstreamAuth.memo.endpoint`,
        );
        const caseIdirFieldName = configService.get<string>(
          `upstreamAuth.case.searchspecIdirField`,
        );
        const incidentIdirFieldName = configService.get<string>(
          `upstreamAuth.incident.searchspecIdirField`,
        );
        const srIdirFieldName = configService.get<string>(
          `upstreamAuth.sr.searchspecIdirField`,
        );
        const memoIdirFieldName = configService.get<string>(
          `upstreamAuth.memo.searchspecIdirField`,
        );
        const caseTypeFieldName = configService.get<string>(
          `upstreamAuth.case.typeField`,
        );
        const incidentTypeFieldName = configService.get<string>(
          `upstreamAuth.incident.typeField`,
        );
        const caseStatusFieldName = configService.get<string>(
          `upstreamAuth.case.statusField`,
        );
        const incidentStatusFieldName = configService.get<string>(
          `upstreamAuth.incident.statusField`,
        );
        const srStatusFieldName = configService.get<string>(
          `upstreamAuth.sr.statusField`,
        );
        const memoStatusFieldName = configService.get<string>(
          `upstreamAuth.memo.statusField`,
        );
        const caseOfficeFieldName = configService.get<string>(
          `upstreamAuth.case.officeField`,
        );
        const incidentOfficeFieldName = configService.get<string>(
          `upstreamAuth.incident.officeField`,
        );
        const srOfficeFieldName = configService.get<string>(
          `upstreamAuth.sr.officeField`,
        );
        const memoOfficeFieldName = configService.get<string>(
          `upstreamAuth.memo.officeField`,
        );
        const caseRestrictedFieldName = configService.get<string>(
          `upstreamAuth.case.restrictedField`,
        );
        const incidentRestrictedFieldName = configService.get<string>(
          `upstreamAuth.incident.restrictedField`,
        );
        const srRestrictedFieldName = configService.get<string>(
          `upstreamAuth.sr.restrictedField`,
        );
        const memoRestrictedFieldName = configService.get<string>(
          `upstreamAuth.memo.restrictedField`,
        );
        const headers = {
          Accept: CONTENT_TYPE,
          'Accept-Encoding': '*',
          [trustedIdirHeaderName]: idir,
        };
        const params = {
          ViewMode: VIEW_MODE,
          ChildLinks: CHILD_LINKS,
          [uniformResponseParamName]: UNIFORM_RESPONSE,
          [pageSizeParamName]: pageSizeMax,
        };
        const caseSearchSpec = `(([${caseOfficeFieldName}]='Office Name 1' OR [${caseOfficeFieldName}]='Office Name 2') OR EXISTS ([${caseIdirFieldName}]="${idir}")) AND ([${caseStatusFieldName}]="${EntityStatus.Open}") AND ([${caseRestrictedFieldName}]="${YNEnum.False}") AND ([${caseTypeFieldName}]="${CaseType.ChildServices}" OR [${caseTypeFieldName}]="${CaseType.FamilyServices}" OR [${caseTypeFieldName}]="${CaseType.CYSNFamilyServices}")`;
        const incidentSearchSpec = `(([${incidentOfficeFieldName}]='Office Name 1' OR [${incidentOfficeFieldName}]='Office Name 2') OR EXISTS ([${incidentIdirFieldName}]="${idir}")) AND ([${incidentStatusFieldName}]="${EntityStatus.Open}") AND ([${incidentRestrictedFieldName}]="${YNEnum.False}") AND ([${incidentTypeFieldName}]="${IncidentType.ChildProtection}")`;
        const srSearchSpec = `(([${srOfficeFieldName}]='Office Name 1' OR [${srOfficeFieldName}]='Office Name 2') OR ([${srIdirFieldName}]="${idir}")) AND ([${srStatusFieldName}]="${EntityStatus.Open}") AND ([${srRestrictedFieldName}]="${YNEnum.False}")`;
        const memoSearchSpec = `(([${memoOfficeFieldName}]='Office Name 1' OR [${memoOfficeFieldName}]='Office Name 2') OR ([${memoIdirFieldName}]="${idir}")) AND ([${memoStatusFieldName}]="${EntityStatus.Open}") AND ([${memoRestrictedFieldName}]="${YNEnum.False}")`;
        const caseParams = {
          ...params,
          [queryHierarchyParamName]: utilitiesService.constructQueryHierarchy(
            new QueryHierarchyComponent({
              classExample: CaseExample,
              name: queryHierarchyCaseParentClassName,
              searchspec: caseSearchSpec,
              exclude: [
                queryHierarchyCaseChildPositionClassName,
                queryHierarchyCaseChildContactClassName,
              ],
              childComponents: [
                new QueryHierarchyComponent({
                  classExample: CasePositionExample,
                  name: queryHierarchyCaseChildPositionClassName,
                }),
                new QueryHierarchyComponent({
                  classExample: ContactsSingleResponseCaseExample,
                  name: queryHierarchyCaseChildContactClassName,
                }),
              ],
            }),
          ),
        };
        const incidentParams = {
          ...params,
          [queryHierarchyParamName]: utilitiesService.constructQueryHierarchy(
            new QueryHierarchyComponent({
              classExample: IncidentExample,
              name: queryHierarchyIncidentParentClassName,
              searchspec: incidentSearchSpec,
              exclude: [
                queryHierarchyIncidentChildAdditionalClassName,
                queryHierarchyIncidentChildCallClassName,
                queryHierarchyIncidentChildConcernsClassName,
                queryHierarchyIncidentChildContactClassName,
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
                new QueryHierarchyComponent({
                  classExample: ContactsSingleResponseIncidentExample,
                  name: queryHierarchyIncidentChildContactClassName,
                }),
              ],
            }),
          ),
        };
        const srParams = {
          ...params,
          [queryHierarchyParamName]: utilitiesService.constructQueryHierarchy(
            new QueryHierarchyComponent({
              classExample: SRExample,
              name: queryHierarchySRParentClassName,
              searchspec: srSearchSpec,
              exclude: [
                queryHierarchySRChildAdditionalClassName,
                queryHierarchySRChildCallClassName,
                queryHierarchySRChildContactClassName,
              ],
              childComponents: [
                new QueryHierarchyComponent({
                  classExample: SRAdditionalInformationExample,
                  name: queryHierarchySRChildAdditionalClassName,
                }),
                new QueryHierarchyComponent({
                  classExample: SRCallInformationExample,
                  name: queryHierarchySRChildCallClassName,
                }),
                new QueryHierarchyComponent({
                  classExample: ContactsSingleResponseSRExample,
                  name: queryHierarchySRChildContactClassName,
                }),
              ],
            }),
          ),
        };
        const memoParams = {
          ...params,
          [queryHierarchyParamName]: utilitiesService.constructQueryHierarchy(
            new QueryHierarchyComponent({
              classExample: MemoExample,
              name: queryHierarchyMemoParentClassName,
              searchspec: memoSearchSpec,
              exclude: [
                queryHierarchyMemoChildAdditionalClassName,
                queryHierarchyMemoChildCallClassName,
                queryHierarchyMemoChildContactClassName,
              ],
              childComponents: [
                new QueryHierarchyComponent({
                  classExample: MemoAdditionalInformationExample,
                  name: queryHierarchyMemoChildAdditionalClassName,
                }),
                new QueryHierarchyComponent({
                  classExample: MemoCallInformationExample,
                  name: queryHierarchyMemoChildCallClassName,
                }),
                new QueryHierarchyComponent({
                  classExample: ContactsSingleResponseMemoExample,
                  name: queryHierarchyMemoChildContactClassName,
                }),
              ],
            }),
          ),
        };

        if (recordCountNeeded === BooleanStringEnum.False) {
          expect(getRequestSpecs.length).toBe(4);
        }
        expect(getRequestSpecs[0].url).toBe(baseUrl + caseEndpoint);
        expect(getRequestSpecs[0].headers).toMatchObject(headers);
        expect(getRequestSpecs[0].params).toMatchObject(caseParams);
        expect(getRequestSpecs[1].url).toBe(baseUrl + incidentEndpoint);
        expect(getRequestSpecs[1].headers).toMatchObject(headers);
        expect(getRequestSpecs[1].params).toMatchObject(incidentParams);
        expect(getRequestSpecs[2].url).toBe(baseUrl + srEndpoint);
        expect(getRequestSpecs[2].headers).toMatchObject(headers);
        expect(getRequestSpecs[2].params).toMatchObject(srParams);
        expect(getRequestSpecs[3].url).toBe(baseUrl + memoEndpoint);
        expect(getRequestSpecs[3].headers).toMatchObject(headers);
        expect(getRequestSpecs[3].params).toMatchObject(memoParams);

        if (recordCountNeeded === BooleanStringEnum.True) {
          const countParams = {
            ...params,
            [recordCountNeededParamName]: BooleanStringEnum.True,
            [fieldsParamName]: 'Id',
          };
          const caseCountParams = {
            ...countParams,
            searchspec: caseSearchSpec,
          };
          const incidentCountParams = {
            ...countParams,
            searchspec: incidentSearchSpec,
          };
          const srCountParams = {
            ...countParams,
            searchspec: srSearchSpec,
          };
          const memoCountParams = {
            ...countParams,
            searchspec: memoSearchSpec,
          };

          expect(getRequestSpecs.length).toBe(8);
          expect(getRequestSpecs[4].url).toBe(baseUrl + caseEndpoint);
          expect(getRequestSpecs[4].headers).toMatchObject(headers);
          expect(getRequestSpecs[4].params).toMatchObject(caseCountParams);
          expect(getRequestSpecs[5].url).toBe(baseUrl + incidentEndpoint);
          expect(getRequestSpecs[5].headers).toMatchObject(headers);
          expect(getRequestSpecs[5].params).toMatchObject(incidentCountParams);
          expect(getRequestSpecs[6].url).toBe(baseUrl + srEndpoint);
          expect(getRequestSpecs[6].headers).toMatchObject(headers);
          expect(getRequestSpecs[6].params).toMatchObject(srCountParams);
          expect(getRequestSpecs[7].url).toBe(baseUrl + memoEndpoint);
          expect(getRequestSpecs[7].headers).toMatchObject(headers);
          expect(getRequestSpecs[7].params).toMatchObject(memoCountParams);
        }
      },
    );
  });

  describe('caseloadMapResponse tests', () => {
    it.each([
      [
        {
          responses: [
            {
              status: 404,
              response: {
                data: {
                  message: 'There is no data for the requested resource',
                },
              },
            },
            {
              status: 404,
              response: {
                data: {
                  message: 'There is no data for the requested resource',
                },
              },
            },
            {
              status: 404,
              response: {
                data: {
                  message: 'There is no data for the requested resource',
                },
              },
            },
            {
              status: 404,
              response: {
                data: {
                  message: 'There is no data for the requested resource',
                },
              },
            },
          ],
          orderedTypes: [
            RecordType.Case,
            RecordType.Incident,
            RecordType.SR,
            RecordType.Memo,
          ],
        },
        {
          cases: {
            assignedIds: [],
            status: 204,
            message: {
              message: 'There is no data for the requested resource',
            },
            items: undefined,
          },
          incidents: {
            assignedIds: [],
            status: 204,
            message: {
              message: 'There is no data for the requested resource',
            },
            items: undefined,
          },
          srs: {
            assignedIds: [],
            status: 204,
            message: {
              message: 'There is no data for the requested resource',
            },
            items: undefined,
          },
          memos: {
            assignedIds: [],
            status: 204,
            message: {
              message: 'There is no data for the requested resource',
            },
            items: undefined,
          },
        },
      ],
      [
        {
          responses: [
            {
              status: 200,
              data: {
                items: [{ ...CaseExample }],
              },
            },
            {
              status: 200,
              data: {
                items: [{ ...IncidentExample }],
              },
            },
            {
              status: 200,
              data: {
                items: [{ ...SRExample }],
              },
            },
            {
              status: 200,
              data: {
                items: [{ ...MemoExample }],
              },
            },
          ],
          orderedTypes: [
            RecordType.Case,
            RecordType.Incident,
            RecordType.SR,
            RecordType.Memo,
          ],
        },
        { ...CaseloadCompleteResponseExample },
      ],
      [
        {
          responses: [
            {
              status: 200,
              data: {
                items: [{ ...CaseExample }],
              },
            },
          ],
          orderedTypes: [RecordType.Case],
        },
        { cases: { ...CaseloadCompleteResponseExample['cases'] } },
      ],
      [
        {
          responses: [
            {
              status: 200,
              data: {
                items: [{ ...IncidentExample }],
              },
            },
            {
              status: 200,
              data: {
                items: [{ ...SRExample }],
              },
            },
            {
              status: 200,
              data: {
                items: [{ ...MemoExample }],
              },
            },
          ],
          orderedTypes: [RecordType.Incident, RecordType.SR, RecordType.Memo],
        },
        {
          incidents: { ...CaseloadCompleteResponseExample['incidents'] },
          srs: { ...CaseloadCompleteResponseExample['srs'] },
          memos: { ...CaseloadCompleteResponseExample['memos'] },
        },
      ],
    ])(
      'returns response with and without errors included',
      (input, expected) => {
        expect(service.caseloadMapResponse(input)).toMatchObject(expected);
      },
    );
  });

  describe('caseloadFilterItemsAfter tests', () => {
    it.each([
      [{ ...CaseloadCompleteResponseExample }, '2011-10-05T14:48:00', [], []],
      [
        { ...CaseloadLaterDateResponseExample },
        '2011-10-05T14:48:00',
        [CaseloadLaterDateResponseExample.cases.items[0]],
        [],
      ],
    ])(
      `filters out items past the given after date`,
      (response, afterString, expectedCase, expectedIncident) => {
        const deepCopyResponse = JSON.parse(JSON.stringify(response));
        const result = service.caseloadFilterItemsAfter(
          deepCopyResponse,
          afterString,
          service.recordTypes,
        );
        expect(result.cases.items).toEqual(expectedCase);
        expect(result.incidents.items).toEqual(expectedIncident);
      },
    );
  });

  // TODO: Test for filtering by Restricted Flag

  describe('caseloadUnsetCacheItems tests', () => {
    it(`should unset items if they exist in the cache`, async () => {
      const idir = 'idir';
      const jti = 'local';
      const response = {
        cases: { assignedIds: ['c', 'a'] },
        incidents: { assignedIds: ['b'] },
        srs: { assignedIds: ['d'] },
        memos: { assignedIds: ['e'] },
      };
      const jwt = jwtService.sign(
        `{"${idirJWTFieldName}":"${idir}", "jti":"${jti}"}`,
        {
          secret: 'aTotalSecret',
        },
      );
      const req = getMockReq({
        header: jest.fn((headerName) => {
          const lookup = { authorization: `Bearer ${jwt}` };
          return lookup[headerName];
        }),
      });
      const caseKey = `${idir}|${RecordType.Case}|a|${jti}`;
      const incidentKey = `${idir}|${RecordType.Incident}|b|${jti}`;
      const srKey = `${idir}|${RecordType.SR}|d|${jti}`;
      const memoKey = `${idir}|${RecordType.Memo}|e|${jti}`;
      await cacheManager.set(caseKey, 500);
      await cacheManager.set(incidentKey, 200);
      await cacheManager.set(srKey, 200);
      await cacheManager.set(memoKey, 200);
      await expect(cacheManager.get(caseKey)).resolves.toBe(500);
      await expect(cacheManager.get(incidentKey)).resolves.toBe(200);
      await expect(cacheManager.get(srKey)).resolves.toBe(200);
      await expect(cacheManager.get(memoKey)).resolves.toBe(200);

      const cacheSpy = jest
        .spyOn(cacheManager, 'del')
        .mockImplementationOnce(() => {
          throw new Error('delete error');
        });

      await service.caseloadUnsetCacheItems(
        response,
        idir,
        req,
        service.recordTypes,
      );
      expect(cacheSpy).toHaveBeenCalledTimes(5);

      await expect(cacheManager.get(caseKey)).resolves.toBe(null);
      await expect(cacheManager.get(incidentKey)).resolves.toBe(null);
      await expect(cacheManager.get(srKey)).resolves.toBe(null);
      await expect(cacheManager.get(memoKey)).resolves.toBe(null);
    });
  });

  describe('getCaseload tests', () => {
    it.each([
      [
        'idir',
        { [afterParamName]: '1900-01-01' } as CaseloadQueryParams,
        { ...CaseloadCompleteResponseExample },
      ],
      ['idir', undefined, { ...CaseloadCompleteResponseExample }],
    ])(
      'should return nested values given good input',
      async (idir, filterQueryParams, data) => {
        const requestSpy = jest
          .spyOn(requestPreparerService, 'parallelGetRequest')
          .mockResolvedValueOnce({
            responses: [
              {
                status: 200,
                data: {
                  items: [CaseExample],
                },
              },
              {
                status: 200,
                data: {
                  items: [IncidentExample],
                },
              },
              {
                status: 200,
                data: {
                  items: [SRExample],
                },
              },
              {
                status: 200,
                data: {
                  items: [MemoExample],
                },
              },
            ],
            orderedTypes: [
              RecordType.Case,
              RecordType.Incident,
              RecordType.SR,
              RecordType.Memo,
            ],
          });
        const jwt = jwtService.sign(
          `{"${idirJWTFieldName}":"${idir}", "jti":"local"}`,
          {
            secret: 'aTotalSecret',
          },
        );
        const req = getMockReq({
          header: jest.fn((headerName) => {
            const lookup = { authorization: `Bearer ${jwt}` };
            return lookup[headerName];
          }),
        });
        const result = await service.getCaseload(idir, req, filterQueryParams);
        const expectedObject = plainToInstance(CaseloadEntity, data, {
          enableImplicitConversion: true,
        });
        expect(requestSpy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(expectedObject);
      },
    );

    it.each([['idir', undefined]])(
      'should throw an error on overall error',
      async (idir, filterQueryParams) => {
        const error = new Error('This is an error.');
        jest
          .spyOn(requestPreparerService, 'parallelGetRequest')
          .mockResolvedValueOnce({
            overallError: error,
          });
        const req = getMockReq();
        await expect(
          service.getCaseload(idir, req, filterQueryParams),
        ).rejects.toThrow(error);
      },
    );
  });

  describe('getOfficeCaseload tests', () => {
    it.each([
      [
        'idir',
        { [afterParamName]: '1900-01-01' } as CaseloadQueryParams,
        { ...OfficeCaseloadCompleteResponseExample },
      ],
      ['idir', undefined, { ...OfficeCaseloadCompleteResponseExample }],
    ])(
      'should return nested values given good input',
      async (idir, filterQueryParams, data) => {
        const requestSpy = jest
          .spyOn(requestPreparerService, 'parallelGetRequest')
          .mockResolvedValueOnce({
            responses: [
              {
                status: 200,
                data: {
                  items: [CaseExample],
                },
              },
              {
                status: 200,
                data: {
                  items: [IncidentExample],
                },
              },
              {
                status: 200,
                data: {
                  items: [SRExample],
                },
              },
              {
                status: 200,
                data: {
                  items: [MemoExample],
                },
              },
            ],
            orderedTypes: [
              RecordType.Case,
              RecordType.Incident,
              RecordType.SR,
              RecordType.Memo,
            ],
          });
        const jwt = jwtService.sign(
          `{"${idirJWTFieldName}":"${idir}", "jti":"local"}`,
          {
            secret: 'aTotalSecret',
          },
        );
        const req = getMockReq({
          header: jest.fn((headerName) => {
            const lookup = { authorization: `Bearer ${jwt}` };
            return lookup[headerName];
          }),
        });
        const result = await service.getOfficeCaseload(
          idir,
          req,
          res,
          officeNames,
          filterQueryParams,
        );
        const expectedObject = plainToInstance(OfficeCaseloadEntity, data, {
          enableImplicitConversion: true,
        });
        expect(requestSpy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(expectedObject);
      },
    );

    it.each([['idir', undefined]])(
      'should throw an error on overall error',
      async (idir, filterQueryParams) => {
        const error = new Error('This is an error.');
        jest
          .spyOn(requestPreparerService, 'parallelGetRequest')
          .mockResolvedValueOnce({
            overallError: error,
          });
        const req = getMockReq();
        await expect(
          service.getOfficeCaseload(
            idir,
            req,
            res,
            officeNames,
            filterQueryParams,
          ),
        ).rejects.toThrow(error);
      },
    );
  });
});
