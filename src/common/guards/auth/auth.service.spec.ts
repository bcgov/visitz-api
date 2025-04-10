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
import { idirUsernameHeaderField } from '../../../common/constants/upstream-constants';
import { idName } from '../../../common/constants/parameter-constants';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let configService: ConfigService;
  let httpService: HttpService;
  let cache: Cache;

  const validId = 'id1234';
  const validRecordType = RecordType.Case;
  const notinEnumPath = `fjofijp`;
  const testIdir = 'IDIRTEST';

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
        .mockResolvedValueOnce('')
        .mockResolvedValueOnce('');
      const spy = jest
        .spyOn(httpService, 'get')
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
        )
        .mockReturnValueOnce(
          of({
            data: {
              items: [
                {
                  'Login Name': testIdir,
                  'Employment Status': 'Active',
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
      const mockRequest = getMockReq({
        header: jest.fn((key: string): string => {
          const headerVal: { [key: string]: string } = {
            [idirUsernameHeaderField]: testIdir,
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
      expect(cacheSpy).toHaveBeenCalledTimes(4);
      expect(isAuthed).toBe(true);
    });

    it.each([
      [{}, undefined, undefined, 0],
      [{ [idirUsernameHeaderField]: testIdir }, 403, true, 2],
      [{ [idirUsernameHeaderField]: testIdir }, 200, false, 2],
      [{ [idirUsernameHeaderField]: testIdir }, 403, false, 2],
    ])(
      'should return false with invalid record in cache',
      async (
        headers,
        cacheReturnRecord,
        cacheReturnEmpStatus,
        cacheSpyCallTimes,
      ) => {
        const cacheSpy = jest
          .spyOn(cache, 'get')
          .mockResolvedValueOnce(cacheReturnRecord)
          .mockResolvedValueOnce(cacheReturnEmpStatus);
        const mockRequest = getMockReq({
          header: jest.fn((key: string): string => {
            const headerVal: { [key: string]: string } = headers;
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
        .mockResolvedValueOnce('');
      const spy = jest.spyOn(httpService, 'get').mockImplementationOnce(() => {
        throw new AxiosError('not found', '404');
      });
      const mockRequest = getMockReq({
        header: jest.fn((key: string): string => {
          const headerVal: { [key: string]: string } = {
            [idirUsernameHeaderField]: testIdir,
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
      expect(cacheSpy).toHaveBeenCalledTimes(3);
      expect(isAuthed).toBe(false);
    });

    it('should return false with upstream invalid record for employee', async () => {
      const cacheSpy = jest
        .spyOn(cache, 'get')
        .mockResolvedValueOnce(200)
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
      const mockRequest = getMockReq({
        header: jest.fn((key: string): string => {
          const headerVal: { [key: string]: string } = {
            [idirUsernameHeaderField]: testIdir,
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
      expect(cacheSpy).toHaveBeenCalledTimes(3);
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
    it('should return 200 if given idir and upstream idir are equal', async () => {
      const cacheSpy = jest.spyOn(cache, 'set');
      const upstreamResult = await service.evaluateUpstreamResult(
        testIdir,
        testIdir,
        'cachetest1',
      );
      expect(cacheSpy).toHaveBeenCalledTimes(1);
      expect(upstreamResult).toBe(200);
    });

    it.each([
      [testIdir + 'abcd', 1],
      [undefined, 0],
    ])(
      'should return 403 if given idir and upstream idir are not equal',
      async (upstreamIdir, cacheSpyCallTimes) => {
        const cacheSpy = jest.spyOn(cache, 'set');
        const upstreamResult = await service.evaluateUpstreamResult(
          upstreamIdir,
          testIdir,
          'cachetest2' + cacheSpyCallTimes,
        );
        expect(cacheSpy).toHaveBeenCalledTimes(cacheSpyCallTimes);
        expect(upstreamResult).toBe(403);
      },
    );
  });

  describe('getAssignedIdirUpstream tests', () => {
    it.each([
      [validId, validRecordType],
      [validId, RecordType.Memo],
    ])('should return idir string given good input', async (id, recordType) => {
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
      const result = await service.getAssignedIdirUpstream(
        id,
        recordType,
        testIdir,
      );
      expect(spy).toHaveBeenCalledTimes(1);
      expect(cacheSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(testIdir);
    });

    it.each([[404], [500]])(
      `Should return undefined on axios error`,
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
        const idir = await service.getAssignedIdirUpstream(
          validId,
          RecordType.Case,
          'idir',
        );
        expect(spy).toHaveBeenCalledTimes(1);
        expect(cacheSpy).toHaveBeenCalledTimes(1);
        expect(idir).toBe(undefined);
      },
    );

    it('should return undefined on token refresh error', async () => {
      const cacheSpy = jest.spyOn(cache, 'get').mockResolvedValueOnce(null);
      const result = await service.getAssignedIdirUpstream(
        validId,
        validRecordType,
        'idir',
      );
      expect(cacheSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(undefined);
    });
  });

  describe('getEmployeeActiveUpstream test', () => {
    it.each([[testIdir], [testIdir + 'randomstring']])(
      'should return idir string given good input',
      async (idir) => {
        const cacheSpy = jest.spyOn(cache, 'get').mockResolvedValueOnce(' ');
        const spy = jest.spyOn(httpService, 'get').mockReturnValueOnce(
          of({
            data: {
              items: [
                {
                  'Login Name': idir,
                  'Employment Status': 'Active',
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
        expect(result).toEqual(true);
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
        expect(result).toEqual(false);
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
        expect(isActive).toBe(false);
      },
    );

    it('should return false on token refresh error', async () => {
      const cacheSpy = jest
        .spyOn(cache, 'get')
        .mockResolvedValueOnce(undefined);
      const result = await service.getEmployeeActiveUpstream(testIdir);
      expect(cacheSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(false);
    });
  });
});
