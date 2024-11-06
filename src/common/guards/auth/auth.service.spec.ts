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

describe('AuthService', () => {
  let service: AuthService;
  let configService: ConfigService;
  let httpService: HttpService;
  let cache: Cache;

  const validId = 'id1234';
  const validRecordType = RecordType.Case;
  const validPath = `/${validRecordType}/${validId}/testendpoint`;
  const notinEnumPath = `/fjofijp/${validId}/testendpoint`;
  const noIdPath = `/${validRecordType}`;
  const incorrectFormatPath = 'abcdefg';
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
              };
              return lookup[key];
            }),
          },
        },
        { provide: HttpService, useValue: { get: jest.fn() } },
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
            [configService.get(`upstreamAuth.${validRecordType}.idirField`)]:
              testIdir,
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
        path: validPath,
        header: jest.fn((key: string): string => {
          const headerVal: { [key: string]: string } = {
            'x-idir-username': testIdir,
          };
          return headerVal[key];
        }),
      });
      const isAuthed = await service.getRecordAndValidate(mockRequest);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(cacheSpy).toHaveBeenCalledTimes(2);
      expect(isAuthed).toBe(true);
    });

    it.each([
      [{}, undefined, 0],
      [{ 'x-idir-username': testIdir }, null, 1],
    ])(
      'should return false with invalid record',
      async (headers, cacheReturn, cacheSpyCallTimes) => {
        const cacheSpy = jest
          .spyOn(cache, 'get')
          .mockResolvedValueOnce(cacheReturn);
        const mockRequest = getMockReq({
          path: validPath,
          header: jest.fn((key: string): string => {
            const headerVal: { [key: string]: string } = headers;
            return headerVal[key];
          }),
        });
        const isAuthed = await service.getRecordAndValidate(mockRequest);
        expect(cacheSpy).toHaveBeenCalledTimes(cacheSpyCallTimes);
        expect(isAuthed).toBe(false);
      },
    );
  });

  describe('grabRecordInfoFromPath tests', () => {
    it('returns an array of [id, type] when the correct url format is passed', () => {
      const [id, recordType] = service.grabRecordInfoFromPath(validPath);
      expect(id).toEqual(validId);
      expect(recordType).toEqual(validRecordType);
    });

    it(`throws an error when the enum doesn't match the record type`, () => {
      expect(() => {
        service.grabRecordInfoFromPath(notinEnumPath);
      }).toThrow(EnumTypeError);
    });

    it(`throws an error when the url doesn't match the correct format`, () => {
      expect(() => {
        service.grabRecordInfoFromPath(incorrectFormatPath);
      }).toThrow(Error);
    });

    it(`throws an error when the url doen't have an id`, () => {
      expect(() => {
        service.grabRecordInfoFromPath(noIdPath);
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
            [configService.get(`upstreamAuth.${recordType}.idirField`)]:
              testIdir,
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
      const result = await service.getAssignedIdirUpstream(id, recordType);
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
      );
      expect(cacheSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(null);
    });
  });
});
