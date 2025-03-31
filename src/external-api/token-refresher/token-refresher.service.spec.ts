import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigModule } from '@nestjs/config';
import { TokenRefresherService } from './token-refresher.service';
import { of } from 'rxjs';
import {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
  RawAxiosRequestHeaders,
} from 'axios';
import configuration from '../../configuration/configuration';

describe('TokenRefresherService', () => {
  let service: TokenRefresherService;
  let httpService: HttpService;
  let cache: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [configuration] })],
      providers: [
        TokenRefresherService,
        { provide: HttpService, useValue: { get: jest.fn(), post: jest.fn() } },
        {
          provide: CACHE_MANAGER,
          useValue: {
            set: () => jest.fn(),
            get: () => 'Bearer token',
          },
        },
      ],
    }).compile();

    service = module.get<TokenRefresherService>(TokenRefresherService);
    httpService = module.get<HttpService>(HttpService);
    cache = module.get(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('refreshUpstreamBearerToken tests', () => {
    it('should return token on cache hit', async () => {
      const response = await service.refreshUpstreamBearerToken();
      expect(typeof response).toBe('string');
    });

    it('should return token on cache miss with upstream success', async () => {
      const cacheSpy = jest
        .spyOn(cache, 'get')
        .mockResolvedValueOnce(undefined);
      const spy = jest.spyOn(httpService, 'post').mockReturnValueOnce(
        of({
          data: {
            token_type: 'Bearer',
            id_token: 'token',
            expires_in: 100,
          },
          headers: {},
          config: {},
          status: 200,
          statusText: 'OK',
        } as AxiosResponse<any, any>),
      );
      const response = await service.refreshUpstreamBearerToken();
      expect(cacheSpy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(typeof response).toBe('string');
    });

    it('should return undefined on cache miss with upstream fail', async () => {
      const cacheSpy = jest
        .spyOn(cache, 'get')
        .mockResolvedValueOnce(undefined);
      const spy = jest.spyOn(httpService, 'post').mockImplementation(() => {
        throw new AxiosError(
          'Axios Error',
          '500',
          {} as InternalAxiosRequestConfig,
          {},
          {
            data: {},
            status: 500,
            statusText: '',
            headers: {} as RawAxiosRequestHeaders,
            config: {} as InternalAxiosRequestConfig,
          },
        );
      });
      const response = await service.refreshUpstreamBearerToken();
      expect(cacheSpy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(response).toBe(undefined);
    });
  });

  describe('authenticateUpstream tests', () => {
    it('should return access token and expiry on success', async () => {
      const spy = jest.spyOn(httpService, 'post').mockReturnValueOnce(
        of({
          data: {
            token_type: 'Bearer',
            id_token: 'token',
            expires_in: 100,
          },
          headers: {},
          config: {},
          status: 200,
          statusText: 'OK',
        } as AxiosResponse<any, any>),
      );
      const [token, ttlMs] = await service.authenticateUpstream();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(typeof token).toBe('string');
      expect(typeof ttlMs).toBe('number');
    });

    it('should return [null, undefined] on axios error', async () => {
      const spy = jest.spyOn(httpService, 'post').mockImplementation(() => {
        throw new AxiosError(
          'Axios Error',
          '500',
          {} as InternalAxiosRequestConfig,
          {},
          {
            data: {},
            status: 500,
            statusText: '',
            headers: {} as RawAxiosRequestHeaders,
            config: {} as InternalAxiosRequestConfig,
          },
        );
      });
      const [token, ttlMs] = await service.authenticateUpstream();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(token).toBe(null);
      expect(ttlMs).toBe(undefined);
    });

    it.each([[undefined], [{}]])(
      'should return [null, undefined] on generic error',
      async (data) => {
        const spy = jest.spyOn(httpService, 'post').mockReturnValueOnce(
          of({
            data,
            headers: {},
            config: {},
            status: 200,
            statusText: 'OK',
          } as AxiosResponse<any, any>),
        );
        const [token, ttlMs] = await service.authenticateUpstream();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(token).toBe(null);
        expect(ttlMs).toBe(undefined);
      },
    );
  });
});
