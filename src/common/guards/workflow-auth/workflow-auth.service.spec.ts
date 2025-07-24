import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowAuthService } from './workflow-auth.service';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RecordType } from '../../../common/constants/enumerations';
import {
  idName,
  officeNamesSeparator,
  queryHierarchyEmployeeChildClassName,
} from '../../../common/constants/parameter-constants';
import { TokenRefresherService } from '../../../external-api/token-refresher/token-refresher.service';
import { UtilitiesService } from '../../../helpers/utilities/utilities.service';
import { AuthService } from '../auth/auth.service';
import { AxiosError, AxiosResponse, RawAxiosRequestHeaders } from 'axios';
import { Cache } from 'cache-manager';
import { of } from 'rxjs';
import {
  idirJWTFieldName,
  idirUsernameHeaderField,
} from '../../../common/constants/upstream-constants';
import { getMockReq } from '@jest-mock/express';
import { HttpException } from '@nestjs/common';

describe('WorkflowAuthService', () => {
  let service: WorkflowAuthService;
  let configService: ConfigService;
  let httpService: HttpService;
  let cache: Cache;
  let jwtService: JwtService;

  const validRecordType = RecordType.Case;
  const testIdir = 'IDIRTEST';
  const testOrg = 'testorg';
  const testOrgId = 'testorgid';
  const officeNames = `office1${officeNamesSeparator}office2`;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkflowAuthService,
        AuthService,
        TokenRefresherService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            set: () => jest.fn(),
            get: () => jest.fn(),
          },
        },
        UtilitiesService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const lookup = {
                [`upstreamAuth.${validRecordType}.idirField`]: 'testfield',
                [`upstreamAuth.${validRecordType}.workspace`]: 'testspace',
                [`upstreamAuth.employee.restrictToOrg`]: testOrg,
                'recordCache.cacheTtlMs': 1000000,
                skipJWTCache: true,
                restrictToOrg: testOrg,
              };
              return lookup[key];
            }),
          },
        },
        { provide: HttpService, useValue: { get: jest.fn() } },
        JwtService,
      ],
    }).compile();

    service = module.get<WorkflowAuthService>(WorkflowAuthService);
    configService = module.get<ConfigService>(ConfigService);
    httpService = module.get<HttpService>(HttpService);
    cache = module.get(CACHE_MANAGER);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRecordAndValidate tests', () => {
    it('should return true with valid record', async () => {
      const cacheSpy = jest
        .spyOn(cache, 'get')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce('')
        .mockResolvedValueOnce('');
      const spy = jest
        .spyOn(httpService, 'get')
        .mockReturnValueOnce(
          of({
            data: {
              items: [
                {
                  'Login Name': testIdir,
                  'Employment Status': 'Active',
                  'Primary Organization Id': testOrgId,
                  [queryHierarchyEmployeeChildClassName]: [
                    {
                      'Organization Id': testOrgId,
                      Organization: testOrg,
                    },
                  ],
                },
              ],
            },
            headers: {},
            config: {
              url: 'exampleurl',
              headers: {} as RawAxiosRequestHeaders,
            },
            status: 200,
            statusText: 'OK',
          } as AxiosResponse<any, any>),
        )
        .mockReturnValueOnce(
          of({
            data: {
              items: [
                {
                  [configService.get(
                    `upstreamAuth.${validRecordType}.idirField`,
                  )]: testIdir,
                },
              ],
            },
            headers: {},
            config: {
              url: 'exampleurl',
              headers: {} as RawAxiosRequestHeaders,
            },
            status: 200,
            statusText: 'OK',
          } as AxiosResponse<any, any>),
        );
      const jwt = jwtService.sign(
        `{"${idirJWTFieldName}":"${testIdir}", "jti":"local"}`,
        {
          secret: 'aTotalSecret',
        },
      );
      const mockRequest = getMockReq({
        header: jest.fn((key: string): string => {
          const headerVal: { [key: string]: string } = {
            [idirUsernameHeaderField]: `notTestIdir`,
            authorization: `Bearer ${jwt}`,
          };
          return headerVal[key];
        }),
        params: { [idName]: 'id' },
        body: {
          entityNumber: '123456',
          entityType: 'Case',
        },
      });
      const isAuthed = await service.getRecordAndValidate(mockRequest);
      expect(spy).toHaveBeenCalledTimes(2);
      expect(cacheSpy).toHaveBeenCalledTimes(5);
      expect(isAuthed).toBe(true);
    });

    it.each([
      [undefined, undefined, undefined, undefined, 0],
      [testIdir, 403, true, officeNames, 3],
      [testIdir, 200, false, undefined, 3],
      [testIdir, 403, false, undefined, 3],
    ])(
      'should return false with invalid record in cache',
      async (
        idir,
        cacheReturnRecord,
        cacheReturnEmpStatus,
        cacheReturnOfficeNames,
        cacheSpyCallTimes,
      ) => {
        const cacheSpy = jest
          .spyOn(cache, 'get')
          .mockResolvedValueOnce(cacheReturnRecord)
          .mockResolvedValueOnce(cacheReturnEmpStatus)
          .mockResolvedValueOnce(cacheReturnOfficeNames);
        let jwt = 'invalidJwt';
        if (idir !== undefined) {
          jwt = jwtService.sign(
            `{"${idirJWTFieldName}":"${idir}", "jti":"local"}`,
            {
              secret: 'aTotalSecret',
            },
          );
        }
        const mockRequest = getMockReq({
          header: jest.fn((key: string): string => {
            const headerVal: { [key: string]: string } = {
              [idirUsernameHeaderField]: `notTestIdir`,
              authorization: `Bearer ${jwt}`,
            };
            return headerVal[key];
          }),
          params: { [idName]: 'id' },
          body: {
            outer: {
              entityNumber: '123456',
              entityType: 'Case',
            },
          },
        });
        const isAuthed = await service.getRecordAndValidate(mockRequest);
        expect(cacheSpy).toHaveBeenCalledTimes(cacheSpyCallTimes);
        expect(isAuthed).toBe(false);
      },
    );

    it('should throw with upstream invalid record for record type', async () => {
      const cacheSpy = jest
        .spyOn(cache, 'get')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(officeNames)
        .mockResolvedValueOnce('');
      const spy = jest.spyOn(httpService, 'get').mockImplementationOnce(() => {
        throw new AxiosError('not found', '404');
      });
      const jwt = jwtService.sign(
        `{"${idirJWTFieldName}":"${testIdir}", "jti":"local"}`,
        {
          secret: 'aTotalSecret',
        },
      );
      const mockRequest = getMockReq({
        header: jest.fn((key: string): string => {
          const headerVal: { [key: string]: string } = {
            [idirUsernameHeaderField]: `notTestIdir`,
            authorization: `Bearer ${jwt}`,
          };
          return headerVal[key];
        }),
        params: { [idName]: 'id' },
        body: {
          entityNumber: '123456',
          entityType: 'Case',
        },
      });
      await expect(service.getRecordAndValidate(mockRequest)).rejects.toThrow(
        HttpException,
      );
      expect(spy).toHaveBeenCalledTimes(1);
      expect(cacheSpy).toHaveBeenCalledTimes(4);
    });

    it('should throw with upstream invalid record for employee', async () => {
      const cacheSpy = jest
        .spyOn(cache, 'get')
        .mockResolvedValueOnce(200)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce('');
      const spy = jest.spyOn(httpService, 'get').mockReturnValueOnce(
        of({
          data: {
            ERROR: 'There is no data for the requested resource.',
          },
          headers: {},
          config: {
            url: 'exampleurl',
            headers: {} as RawAxiosRequestHeaders,
          },
          status: 404,
          statusText: 'Not Found',
        } as AxiosResponse<any, any>),
      );
      const jwt = jwtService.sign(
        `{"${idirJWTFieldName}":"${testIdir}", "jti":"local"}`,
        {
          secret: 'aTotalSecret',
        },
      );
      const mockRequest = getMockReq({
        header: jest.fn((key: string): string => {
          const headerVal: { [key: string]: string } = {
            [idirUsernameHeaderField]: `notTestIdir`,
            authorization: `Bearer ${jwt}`,
          };
          return headerVal[key];
        }),
        params: { [idName]: 'id' },
        body: {
          entityNumber: '123456',
          entityType: 'Case',
        },
      });
      await expect(service.getRecordAndValidate(mockRequest)).rejects.toThrow(
        HttpException,
      );
      expect(spy).toHaveBeenCalledTimes(1);
      expect(cacheSpy).toHaveBeenCalledTimes(4);
    });
  });
});
