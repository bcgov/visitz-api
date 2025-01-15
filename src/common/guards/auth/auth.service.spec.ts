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
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce('');
      const spy = jest.spyOn(httpService, 'get').mockReturnValueOnce(
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
      expect(cacheSpy).toHaveBeenCalledTimes(2);
      expect(isAuthed).toBe(true);
    });

    it.each([
      [{}, undefined, 0],
      [{ [idirUsernameHeaderField]: testIdir }, 403, 1],
    ])(
      'should return false with invalid record',
      async (headers, cacheReturn, cacheSpyCallTimes) => {
        const cacheSpy = jest
          .spyOn(cache, 'get')
          .mockResolvedValueOnce(cacheReturn);
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
        'idir',
      );
      expect(spy).toHaveBeenCalledTimes(1);
      expect(cacheSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(testIdir);
    });

    it.each([[{}], [undefined]])(
      'should return null when idir not in response',
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
        const result = await service.getAssignedIdirUpstream(
          validId,
          validRecordType,
          'idir',
        );
        expect(spy).toHaveBeenCalledTimes(1);
        expect(cacheSpy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(null);
      },
    );

    it.each([[404], [500]])(
      `Should return null on axios error`,
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
        expect(idir).toBe(null);
      },
    );

    it('should return null on token refresh error', async () => {
      const cacheSpy = jest
        .spyOn(cache, 'get')
        .mockResolvedValueOnce(undefined);
      const result = await service.getAssignedIdirUpstream(
        validId,
        validRecordType,
        'idir',
      );
      expect(cacheSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(null);
    });
  });
});
