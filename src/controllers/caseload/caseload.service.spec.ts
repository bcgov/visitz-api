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
  FilterQueryParams,
  SinceQueryParams,
} from '../../dto/filter-query-params.dto';
import {
  CHILD_LINKS,
  CONTENT_TYPE,
  sinceParamName,
  UNIFORM_RESPONSE,
  uniformResponseParamName,
  VIEW_MODE,
} from '../../common/constants/parameter-constants';
import { getMockReq } from '@jest-mock/express';
import {
  CaseExample,
  CaseloadCompleteResponseExample,
  CaseloadEntity,
  CaseloadLaterDateResponseExample,
  IncidentExample,
} from '../../entities/caseload.entity';
import { Cache } from 'cache-manager';
import {
  RecordType,
  RestrictedRecordEnum,
} from '../../common/constants/enumerations';
import { plainToInstance } from 'class-transformer';
import {
  pageSizeParamName,
  pageSizeMax,
  trustedIdirHeaderName,
} from '../../common/constants/upstream-constants';

describe('CaseloadService', () => {
  let service: CaseloadService;
  let configService: ConfigService;
  let cacheManager: Cache;
  let requestPreparerService: RequestPreparerService;

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

    configService.set('skipJWTCache', true);
    configService.set('sinceFieldName.cases', 'Last Updated Date');
    configService.set('sinceFieldName.incidents', 'Last Updated');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('caseloadUpstreamRequestPreparer tests', () => {
    it(`prepares a request for upstream`, () => {
      const idir = 'testIdir';
      const filter = plainToInstance(
        FilterQueryParams,
        {
          [pageSizeParamName]: pageSizeMax,
        },
        { enableImplicitConversion: true },
      );
      const getRequestSpecs = service.caseloadUpstreamRequestPreparer(
        idir,
        filter,
      );
      const baseUrl = configService.get<string>(`endpointUrls.baseUrl`);
      const caseEndpoint = configService.get<string>(
        `upstreamAuth.case.endpoint`,
      );
      const incidentEndpoint = configService.get<string>(
        `upstreamAuth.incident.endpoint`,
      );
      const caseIdirFieldName = configService.get<string>(
        `upstreamAuth.case.searchspecIdirField`,
      );
      const incidentIdirFieldName = configService.get<string>(
        `upstreamAuth.incident.searchspecIdirField`,
      );
      const caseRestrictedFieldName = configService.get<string>(
        `upstreamAuth.case.restrictedField`,
      );
      const incidentRestrictedFieldName = configService.get<string>(
        `upstreamAuth.incident.restrictedField`,
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
      const caseParams = {
        ...params,
        searchspec:
          `([${caseIdirFieldName}]="${idir}" AND ` +
          `[${caseRestrictedFieldName}]="${RestrictedRecordEnum.False}")`,
      };
      const incidentParams = {
        ...params,
        searchspec:
          `([${incidentIdirFieldName}]="${idir}" AND ` +
          `[${incidentRestrictedFieldName}]="${RestrictedRecordEnum.False}")`,
      };

      expect(getRequestSpecs.length).toBe(2);
      expect(getRequestSpecs[0].url).toBe(baseUrl + caseEndpoint);
      expect(getRequestSpecs[0].headers).toMatchObject(headers);
      expect(getRequestSpecs[0].params).toMatchObject(caseParams);
      expect(getRequestSpecs[1].url).toBe(baseUrl + incidentEndpoint);
      expect(getRequestSpecs[1].headers).toMatchObject(headers);
      expect(getRequestSpecs[1].params).toMatchObject(incidentParams);
    });
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
          ],
        },
        { ...CaseloadCompleteResponseExample },
      ],
    ])(
      'returns response with and without errors included',
      (input, expected) => {
        expect(service.caseloadMapResponse(input)).toMatchObject(expected);
      },
    );
  });

  describe('caseloadFilterItems tests', () => {
    it.each([
      [{ ...CaseloadCompleteResponseExample }, '2011-10-05T14:48:00', [], []],
      [
        { ...CaseloadLaterDateResponseExample },
        '2011-10-05T14:48:00',
        [CaseloadLaterDateResponseExample.cases.items[0]],
        [],
      ],
    ])(
      `filters out items past the given since date`,
      (response, sinceString, expectedCase, expectedIncident) => {
        const deepCopyResponse = JSON.parse(JSON.stringify(response));
        const result = service.caseloadFilterItems(
          deepCopyResponse,
          sinceString,
        );
        expect(result.cases.items).toEqual(expectedCase);
        expect(result.incidents.items).toEqual(expectedIncident);
      },
    );
  });

  describe('caseloadUnsetCacheItems tests', () => {
    it(`should unset items if they exist in the cache`, async () => {
      const idir = 'idir';
      const jti = 'local';
      const response = {
        cases: { assignedIds: ['c', 'a'] },
        incidents: { assignedIds: ['b'] },
      };
      const req = getMockReq();
      const caseKey = `${idir}|${RecordType.Case}|a|${jti}`;
      const incidentKey = `${idir}|${RecordType.Incident}|b|${jti}`;
      await cacheManager.set(caseKey, 500);
      await cacheManager.set(incidentKey, 200);
      await expect(cacheManager.get(caseKey)).resolves.toBe(500);
      await expect(cacheManager.get(incidentKey)).resolves.toBe(200);

      const cacheSpy = jest
        .spyOn(cacheManager, 'del')
        .mockImplementationOnce(() => {
          throw new Error('delete error');
        });

      await service.caseloadUnsetCacheItems(response, idir, req);
      expect(cacheSpy).toHaveBeenCalledTimes(3);

      await expect(cacheManager.get(caseKey)).resolves.toBe(undefined);
      await expect(cacheManager.get(incidentKey)).resolves.toBe(undefined);
    });
  });

  describe('getCaseload tests', () => {
    it.each([
      [
        'idir',
        { [sinceParamName]: '1900-01-01' } as SinceQueryParams,
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
            ],
          });
        const req = getMockReq();
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
});
