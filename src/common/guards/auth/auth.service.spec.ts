import { getMockReq } from '@jest-mock/express';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
  RawAxiosRequestHeaders,
} from 'axios';
import { Cache } from 'cache-manager';
import { of } from 'rxjs';
import { AuthService } from './auth.service';
import { RecordType } from '../../../common/constants/enumerations';
import { EnumTypeError } from '../../../common/errors/errors';
import { UtilitiesService } from '../../../helpers/utilities/utilities.service';
import { TokenRefresherService } from '../../../external-api/token-refresher/token-refresher.service';
import {
  idirJWTFieldName,
  idirUsernameHeaderField,
} from '../../../common/constants/upstream-constants';
import {
  idName,
  queryHierarchyEmployeeChildClassName,
} from '../../../common/constants/parameter-constants';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let configService: ConfigService;
  let httpService: HttpService;
  let cache: Cache;
  let jwtService: JwtService;

  const validId = 'id1234';
  const validRecordType = RecordType.Case;
  const notinEnumPath = `fjofijp`;
  const testIdir = 'IDIRTEST';
  const testOrg = 'testorg';
  const testOrgId = 'testorgid';
  const officeNames = '["office1","office2"]';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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

    service = module.get<AuthService>(AuthService);
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
      });
      const isAuthed = await service.getRecordAndValidate(
        mockRequest,
        validRecordType,
      );
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
        });
        const isAuthed = await service.getRecordAndValidate(
          mockRequest,
          validRecordType,
        );
        expect(cacheSpy).toHaveBeenCalledTimes(cacheSpyCallTimes);
        expect(isAuthed).toBe(false);
      },
    );

    it('should return false with upstream invalid record for record type', async () => {
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
      });
      const isAuthed = await service.getRecordAndValidate(
        mockRequest,
        validRecordType,
      );
      expect(spy).toHaveBeenCalledTimes(1);
      expect(cacheSpy).toHaveBeenCalledTimes(4);
      expect(isAuthed).toBe(false);
    });

    it('should return false with upstream invalid record for employee', async () => {
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
      });
      const isAuthed = await service.getRecordAndValidate(
        mockRequest,
        validRecordType,
      );
      expect(spy).toHaveBeenCalledTimes(1);
      expect(cacheSpy).toHaveBeenCalledTimes(4);
      expect(isAuthed).toBe(false);
    });
  });

  describe('grabRecordInfo tests', () => {
    it('returns an array of [id, type] when the correct url format is passed', () => {
      const mockRequest = getMockReq({
        params: { [idName]: validId },
      });
      const [id, recordType] = service.grabRecordInfo(
        mockRequest,
        validRecordType,
      );
      expect(id).toEqual(validId);
      expect(recordType).toEqual(validRecordType);
    });

    it(`throws an error when the enum doesn't match the record type`, () => {
      const mockRequest = getMockReq({
        params: { [idName]: validId },
      });
      expect(() => {
        service.grabRecordInfo(mockRequest, notinEnumPath);
      }).toThrow(EnumTypeError);
    });

    it(`throws an error when the parameter doesn't exist for id`, () => {
      const mockRequest = getMockReq({ params: {} });
      expect(() => {
        service.grabRecordInfo(mockRequest, validRecordType);
      }).toThrow(Error);
    });
  });

  describe('evaluateUpstreamResult tests', () => {
    it('should return 200 if is assigned to office', async () => {
      const cacheSpy = jest.spyOn(cache, 'set');
      const upstreamResult = await service.evaluateUpstreamResult(
        true,
        testIdir,
        'cachetest1',
        'searchspec',
      );
      expect(cacheSpy).toHaveBeenCalledTimes(1);
      expect(upstreamResult).toBe(200);
    });

    it.each([
      [testIdir + 'abcd', 0],
      [undefined, 0],
    ])(
      'should return 403 if not assigned to Office',
      async (upstreamIdir, cacheSpyCallTimes) => {
        const cacheSpy = jest.spyOn(cache, 'set');
        const upstreamResult = await service.evaluateUpstreamResult(
          false,
          testIdir,
          'cachetest2' + cacheSpyCallTimes,
          'searchspec',
        );
        expect(cacheSpy).toHaveBeenCalledTimes(cacheSpyCallTimes);
        expect(upstreamResult).toBe(403);
      },
    );
  });

  describe('positionCheck tests', () => {
    it('should return false on non-matching primary organization', async () => {
      const response = {
        data: {
          items: [
            {
              'Login Name': testIdir,
              'Employment Status': 'Active',
              'Primary Organization Id': testOrgId,
              [queryHierarchyEmployeeChildClassName]: [
                {
                  'Organization Id': testOrgId,
                  Organization: testOrg + 'abcd',
                },
              ],
            },
          ],
        },
      };
      const cacheSpy = jest
        .spyOn(cache, 'set')
        .mockResolvedValueOnce(undefined);
      const result = await service.positionCheck(testIdir, response);
      expect(cacheSpy).toHaveBeenCalledTimes(2);
      expect(result).toStrictEqual([false, null]);
    });

    it('should return false on primary organization not found', async () => {
      const response = {
        data: {
          items: [
            {
              'Login Name': testIdir,
              'Employment Status': 'Active',
              'Primary Organization Id': testOrgId,
              [queryHierarchyEmployeeChildClassName]: [
                {
                  'Organization Id': testOrgId + 'abcd',
                  Organization: testOrg,
                },
              ],
            },
          ],
        },
      };
      const cacheSpy = jest
        .spyOn(cache, 'set')
        .mockResolvedValueOnce(undefined);
      const result = await service.positionCheck(testIdir, response);
      expect(cacheSpy).toHaveBeenCalledTimes(2);
      expect(result).toStrictEqual([false, null]);
    });

    it('should return true if restrict to org is undefined', async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
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
                  [`upstreamAuth.employee.restrictToOrg`]: undefined,
                  'recordCache.cacheTtlMs': 1000000,
                  skipJWTCache: true,
                };
                return lookup[key];
              }),
            },
          },
          { provide: HttpService, useValue: { get: jest.fn() } },
          JwtService,
        ],
      }).compile();

      service = module.get<AuthService>(AuthService);
      configService = module.get<ConfigService>(ConfigService);
      httpService = module.get<HttpService>(HttpService);
      cache = module.get(CACHE_MANAGER);
      jwtService = module.get<JwtService>(JwtService);
      const response = {
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
      };
      const cacheSpy = jest
        .spyOn(cache, 'set')
        .mockResolvedValueOnce(undefined);
      const result = await service.positionCheck(testIdir, response);
      expect(cacheSpy).toHaveBeenCalledTimes(2);
      expect(result).toStrictEqual([true, ']']);
    });
  });

  describe('getIsAssignedToOfficeUpstream tests', () => {
    it.each([
      [
        validId,
        validRecordType,
        `([undefined]='office1' OR [undefined]='office2' OR EXISTS [undefined]='IDIRTEST')`,
      ],
      [
        validId,
        RecordType.Memo,
        `([undefined]='office1' OR [undefined]='office2' OR [undefined]='IDIRTEST')`,
      ],
    ])(
      'should return idir string given good input',
      async (id, recordType, searchspec) => {
        const cacheSpy = jest.spyOn(cache, 'get').mockResolvedValueOnce(' ');
        const spy = jest.spyOn(httpService, 'get').mockReturnValueOnce(
          of({
            data: {
              items: [
                {
                  [configService.get(`upstreamAuth.${recordType}.idirField`)]:
                    testIdir,
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
        const result = await service.getIsAssignedToOfficeUpstream(
          id,
          recordType,
          testIdir,
          officeNames,
        );
        expect(spy).toHaveBeenCalledTimes(1);
        expect(cacheSpy).toHaveBeenCalledTimes(1);
        expect(result).toEqual([true, searchspec]);
      },
    );

    it.each([[404], [500]])(
      `Should return false on axios error`,
      async (status) => {
        const cacheSpy = jest.spyOn(cache, 'get').mockResolvedValueOnce(' ');
        const spy = jest.spyOn(httpService, 'get').mockImplementation(() => {
          throw new AxiosError(
            'Axios Error',
            status.toString(),
            {} as InternalAxiosRequestConfig,
            {},
            {
              data: {},
              status: status,
              statusText: '',
              headers: {} as RawAxiosRequestHeaders,
              config: {} as InternalAxiosRequestConfig,
            },
          );
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [isSuccess, searchspec] =
          await service.getIsAssignedToOfficeUpstream(
            validId,
            RecordType.Case,
            'idir',
            officeNames,
          );
        expect(spy).toHaveBeenCalledTimes(1);
        expect(cacheSpy).toHaveBeenCalledTimes(1);
        expect(isSuccess).toBe(false);
      },
    );

    it('should return false on token refresh error', async () => {
      const cacheSpy = jest.spyOn(cache, 'get').mockResolvedValueOnce(null);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [result, searchspec] = await service.getIsAssignedToOfficeUpstream(
        validId,
        validRecordType,
        'idir',
        officeNames,
      );
      expect(cacheSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(false);
    });
  });

  describe('getEmployeeActiveUpstream test', () => {
    it.each([[testIdir], [testIdir + 'randomstring']])(
      'should return active offices given good input',
      async (idir) => {
        const cacheSpy = jest.spyOn(cache, 'get').mockResolvedValueOnce(' ');
        const spy = jest.spyOn(httpService, 'get').mockReturnValueOnce(
          of({
            data: {
              items: [
                {
                  'Login Name': idir,
                  'Employment Status': 'Active',
                  'Primary Organization Id': testOrgId,
                  [queryHierarchyEmployeeChildClassName]: [
                    {
                      'Organization Id': testOrgId,
                      Organization: testOrg,
                      Division: 'office1',
                    },
                    {
                      'Organization Id': testOrgId,
                      Organization: testOrg,
                      Division: 'office2',
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
        );
        const result = await service.getEmployeeActiveUpstream(testIdir);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(cacheSpy).toHaveBeenCalledTimes(1);
        expect(result).toEqual([true, officeNames]);
      },
    );

    it.each([[{}], [{ items: [{}] }]])(
      'should return false when employee status not in response',
      async (data) => {
        const cacheSpy = jest.spyOn(cache, 'get').mockResolvedValueOnce(' ');
        const spy = jest.spyOn(httpService, 'get').mockReturnValueOnce(
          of({
            data,
            headers: {},
            config: {
              url: 'exampleurl',
              headers: {} as RawAxiosRequestHeaders,
            },
            status: 200,
            statusText: 'OK',
          } as AxiosResponse<any, any>),
        );
        const result = await service.getEmployeeActiveUpstream(testIdir);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(cacheSpy).toHaveBeenCalledTimes(1);
        expect(result).toEqual([false, undefined]);
      },
    );

    it.each([[404], [500]])(
      `Should return false on axios error`,
      async (status) => {
        const cacheSpy = jest.spyOn(cache, 'get').mockResolvedValueOnce(' ');
        const spy = jest.spyOn(httpService, 'get').mockImplementation(() => {
          throw new AxiosError(
            'Axios Error',
            status.toString(),
            {} as InternalAxiosRequestConfig,
            {},
            {
              data: {},
              status: status,
              statusText: '',
              headers: {} as RawAxiosRequestHeaders,
              config: {} as InternalAxiosRequestConfig,
            },
          );
        });
        const isActive = await service.getEmployeeActiveUpstream(testIdir);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(cacheSpy).toHaveBeenCalledTimes(1);
        expect(isActive).toStrictEqual([false, undefined]);
      },
    );

    it('should return false on token refresh error', async () => {
      const cacheSpy = jest
        .spyOn(cache, 'get')
        .mockResolvedValueOnce(undefined);
      const result = await service.getEmployeeActiveUpstream(testIdir);
      expect(cacheSpy).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual([false, undefined]);
    });
  });
});
