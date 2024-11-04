import { Test, TestingModule } from '@nestjs/testing';
import { RequestPreparerService } from './request-preparer.service';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';
import {
  RecordEntityMap,
  RecordType,
} from '../../common/constants/enumerations';
import {
  CHILD_LINKS,
  CONTENT_TYPE,
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

describe('RequestPreparerService', () => {
  let service: RequestPreparerService;
  let httpService: HttpService;
  let tokenRefresherService: TokenRefresherService;
  const validId = '1234ab';

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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('prepareHeadersAndParams tests', () => {
    it.each([
      [RecordType.Case, { id: validId }],
      [RecordType.SR, { id: validId }],
    ])(
      'correctly prepares headers and params with no date parameter',
      (type, id) => {
        const [headers, params] = service.prepareHeadersAndParams(type, id);
        expect(headers).toEqual({ Accept: CONTENT_TYPE });
        expect(params).toEqual({
          ViewMode: VIEW_MODE,
          ChildLinks: CHILD_LINKS,
          searchspec: `([Entity Id]="${id.id}" AND [Entity Name]="${RecordEntityMap[type]}")`,
        });
      },
    );

    it.each([
      [
        RecordType.Case,
        { id: validId },
        { since: '2024-02-20' },
        '02/20/2024 00:00:00',
      ],
    ])(
      'correctly prepares headers and params with a date parameter',
      (type, id, since, expectedDate) => {
        const [headers, params] = service.prepareHeadersAndParams(
          type,
          id,
          since,
        );
        expect(headers).toEqual({ Accept: CONTENT_TYPE });
        expect(params).toEqual({
          ViewMode: VIEW_MODE,
          ChildLinks: CHILD_LINKS,
          searchspec: `([Entity Id]="${id.id}" AND [Entity Name]="${RecordEntityMap[type]}" AND [Updated] > "${expectedDate}")`,
        });
      },
    );
  });

  describe('sendGetRequest tests', () => {
    it('provides a response on sucessful http service call', async () => {
      const spy = jest.spyOn(httpService, 'get').mockReturnValueOnce(
        of({
          data: {},
          headers: {},
          status: 200,
          statusText: 'OK',
        } as AxiosResponse<any, any>),
      );
      const result = await service.sendGetRequest('url', {});
      expect(spy).toHaveBeenCalledTimes(1);
      expect(result.data).toEqual({});
    });

    it.each([[404], [500]])(
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
          service.sendGetRequest('url', {}, {}),
        ).rejects.toHaveProperty('status', status);
        expect(spy).toHaveBeenCalledTimes(1);
      },
    );

    it('Should return HttpException with status 500 on bearer token undefined', async () => {
      const spy = jest
        .spyOn(tokenRefresherService, 'refreshUpstreamBearerToken')
        .mockResolvedValueOnce(undefined);
      await expect(
        service.sendGetRequest('url', {}, {}),
      ).rejects.toHaveProperty('status', 500);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
