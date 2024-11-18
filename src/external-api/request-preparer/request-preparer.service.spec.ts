import { Test, TestingModule } from '@nestjs/testing';
import { RequestPreparerService } from './request-preparer.service';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';
import {
  CHILD_LINKS,
  CONTENT_TYPE,
  PAGE_SIZE,
  RECORD_COUNT_NEEDED,
  recordCountHeaderName,
  UNIFORM_RESPONSE,
  VIEW_MODE,
} from '../../common/constants/parameter-constants';
import { TokenRefresherService } from '../token-refresher/token-refresher.service';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
  RawAxiosRequestHeaders,
} from 'axios';
import { getMockRes } from '@jest-mock/express';
import { startRowNumParamName } from '../../common/constants/upstream-constants';

describe('RequestPreparerService', () => {
  let service: RequestPreparerService;
  let httpService: HttpService;
  let tokenRefresherService: TokenRefresherService;
  const { res, mockClear } = getMockRes();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        RequestPreparerService,
        UtilitiesService,
        TokenRefresherService,
        {
          provide: HttpService,
          useValue: { get: () => jest.fn(), post: () => jest.fn() },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            set: () => jest.fn(),
            get: () => 'Bearer token',
          },
        },
        ConfigService,
      ],
    }).compile();

    service = module.get<RequestPreparerService>(RequestPreparerService);
    httpService = module.get<HttpService>(HttpService);
    tokenRefresherService = module.get<TokenRefresherService>(
      TokenRefresherService,
    );
    mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('prepareHeadersAndParams tests', () => {
    it.each([
      ['spec', undefined],
      ['spec', 'workspace'],
    ])(
      'correctly prepares headers and params with no date or row number parameter',
      (baseSearchSpec, workspace) => {
        const [headers, params] = service.prepareHeadersAndParams(
          baseSearchSpec,
          workspace,
          '',
        );
        expect(headers).toEqual({ Accept: CONTENT_TYPE });
        expect(params).toEqual({
          ViewMode: VIEW_MODE,
          ChildLinks: CHILD_LINKS,
          searchspec: baseSearchSpec + ')',
          workspace: workspace,
          PageSize: PAGE_SIZE,
          recordcountneeded: RECORD_COUNT_NEEDED,
          uniformresponse: UNIFORM_RESPONSE,
        });
      },
    );

    it.each([
      ['spec', undefined, { [startRowNumParamName]: 2 }],
      ['spec', 'workspace', { [startRowNumParamName]: 4 }],
    ])(
      'correctly prepares headers and params with a row number parameter but no date',
      (baseSearchSpec, workspace, startRowNum) => {
        const [headers, params] = service.prepareHeadersAndParams(
          baseSearchSpec,
          workspace,
          '',
          undefined,
          startRowNum,
        );
        expect(headers).toEqual({ Accept: CONTENT_TYPE });
        expect(params).toEqual({
          ViewMode: VIEW_MODE,
          ChildLinks: CHILD_LINKS,
          searchspec: baseSearchSpec + ')',
          workspace: workspace,
          PageSize: PAGE_SIZE,
          recordcountneeded: RECORD_COUNT_NEEDED,
          uniformresponse: UNIFORM_RESPONSE,
          [startRowNumParamName]: startRowNum[startRowNumParamName],
        });
      },
    );

    it.each([
      ['spec', { since: '2024-02-20' }, undefined, '02/20/2024 00:00:00'],
      [
        'spec',
        { since: '2024-02-20' },
        { [startRowNumParamName]: 2 },
        '02/20/2024 00:00:00',
      ],
    ])(
      'correctly prepares headers and params with a date and optionally row parameter',
      (baseSearchSpec, since, startRowNum, expectedDate) => {
        const [headers, params] = service.prepareHeadersAndParams(
          baseSearchSpec,
          undefined,
          'Updated',
          since,
          startRowNum,
        );
        expect(headers).toEqual({ Accept: CONTENT_TYPE });
        expect(params).toEqual({
          ViewMode: VIEW_MODE,
          ChildLinks: CHILD_LINKS,
          searchspec: `${baseSearchSpec} AND [Updated] > "${expectedDate}")`,
          PageSize: PAGE_SIZE,
          recordcountneeded: RECORD_COUNT_NEEDED,
          uniformresponse: UNIFORM_RESPONSE,
          [startRowNumParamName]: startRowNum?.[startRowNumParamName]
            ? startRowNum?.[startRowNumParamName]
            : undefined,
        });
      },
    );
  });

  describe('sendGetRequest tests', () => {
    it('provides a response on sucessful http service call', async () => {
      const spy = jest.spyOn(httpService, 'get').mockReturnValueOnce(
        of({
          data: {},
          headers: { [recordCountHeaderName]: 2000 } as RawAxiosRequestHeaders,
          status: 200,
          statusText: 'OK',
        } as AxiosResponse<any, any>),
      );
      const headerSpy = jest.spyOn(res, 'setHeader');
      const result = await service.sendGetRequest('url', {}, res);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(result.data).toEqual({});
      expect(headerSpy).toHaveBeenCalledWith(recordCountHeaderName, 2000);
    });

    it.each([[500]])(
      `Should return HttpException with matching status on axios error`,
      async (status) => {
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

        await expect(
          service.sendGetRequest('url', {}, res, {}),
        ).rejects.toHaveProperty('status', status);
        expect(spy).toHaveBeenCalledTimes(1);
      },
    );

    it('Should return HttpException with status 204 on 404 from upstream', async () => {
      const spy = jest.spyOn(httpService, 'get').mockImplementation(() => {
        throw new AxiosError(
          'Axios Error',
          '404',
          {} as InternalAxiosRequestConfig,
          {},
          {
            data: {},
            status: 404,
            statusText: '',
            headers: {} as RawAxiosRequestHeaders,
            config: {} as InternalAxiosRequestConfig,
          },
        );
      });
      await expect(
        service.sendGetRequest('url', {}, res, {}),
      ).rejects.toHaveProperty('status', 204);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('Should return HttpException with status 500 on bearer token undefined', async () => {
      const spy = jest
        .spyOn(tokenRefresherService, 'refreshUpstreamBearerToken')
        .mockResolvedValueOnce(undefined);
      await expect(
        service.sendGetRequest('url', {}, res, {}),
      ).rejects.toHaveProperty('status', 500);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('sendPostRequest tests', () => {
    it('provides a response on sucessful http service call', async () => {
      const spy = jest.spyOn(httpService, 'post').mockReturnValueOnce(
        of({
          data: {},
          headers: {},
          status: 200,
          statusText: 'OK',
        } as AxiosResponse<any, any>),
      );
      const result = await service.sendPostRequest('url', {}, {});
      expect(spy).toHaveBeenCalledTimes(1);
      expect(result.data).toEqual({});
    });

    it.each([[500]])(
      `Should return HttpException with matching status on axios error`,
      async (status) => {
        const spy = jest.spyOn(httpService, 'post').mockImplementation(() => {
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

        await expect(
          service.sendPostRequest('url', {}, {}, {}),
        ).rejects.toHaveProperty('status', status);
        expect(spy).toHaveBeenCalledTimes(1);
      },
    );

    it('Should return HttpException with status 204 on 404 from upstream', async () => {
      const spy = jest.spyOn(httpService, 'post').mockImplementation(() => {
        throw new AxiosError(
          'Axios Error',
          '404',
          {} as InternalAxiosRequestConfig,
          {},
          {
            data: {},
            status: 404,
            statusText: '',
            headers: {} as RawAxiosRequestHeaders,
            config: {} as InternalAxiosRequestConfig,
          },
        );
      });
      await expect(
        service.sendPostRequest('url', {}, {}, {}),
      ).rejects.toHaveProperty('status', 204);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('Should return HttpException with status 500 on bearer token undefined', async () => {
      const spy = jest
        .spyOn(tokenRefresherService, 'refreshUpstreamBearerToken')
        .mockResolvedValueOnce(undefined);
      await expect(
        service.sendPostRequest('url', {}, {}),
      ).rejects.toHaveProperty('status', 500);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
