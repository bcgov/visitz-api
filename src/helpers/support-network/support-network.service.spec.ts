import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
  RawAxiosRequestHeaders,
} from 'axios';
import { of } from 'rxjs';
import { UtilitiesService } from '../utilities/utilities.service';
import { RecordType } from '../../common/constants/enumerations';
import { SupportNetworkService } from './support-network.service';
import {
  NestedSupportNetworkEntity,
  SupportNetworkEntity,
  SupportNetworkListResponseIncidentExample,
  SupportNetworkListResponseSRExample,
  SupportNetworkSingleResponseCaseExample,
} from '../../entities/support-network.entity';
import { IdPathParams } from '../../dto/id-path-params.dto';
import { SinceQueryParams } from '../../dto/since-query-params.dto';
import { TokenRefresherService } from '../token-refresher/token-refresher.service';

describe('SupportNetworkService', () => {
  let service: SupportNetworkService;
  let configService: ConfigService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        SupportNetworkService,
        UtilitiesService,
        ConfigService,
        TokenRefresherService,
        { provide: HttpService, useValue: { get: jest.fn() } },
        {
          provide: CACHE_MANAGER,
          useValue: {
            set: () => jest.fn(),
            get: () => 'Bearer token',
          },
        },
      ],
    }).compile();

    service = module.get<SupportNetworkService>(SupportNetworkService);
    configService = module.get<ConfigService>(ConfigService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSingleSupportNetworkInformationRecord tests', () => {
    it.each([
      [
        SupportNetworkSingleResponseCaseExample,
        RecordType.Case,
        { id: 'test' } as IdPathParams,
        undefined,
      ],
      [
        SupportNetworkListResponseSRExample.items[0],
        RecordType.SR,
        { id: 'test' } as IdPathParams,
        { since: '2024-12-24' } as SinceQueryParams,
      ],
    ])(
      'should return single values given good input',
      async (data, recordType, idPathParams, sinceQueryParams) => {
        const spy = jest.spyOn(httpService, 'get').mockReturnValueOnce(
          of({
            data: data,
            headers: {},
            config: {
              url:
                configService.get<string>('UPSTREAM_BASE_URL') +
                configService
                  .get<string>('SUPPORT_NETWORK_ENDPOINT')
                  .replace(/\s/g, '%20'),
              headers: {} as RawAxiosRequestHeaders,
            },
            status: 200,
            statusText: 'OK',
          } as AxiosResponse<any, any>),
        );

        const result = await service.getSingleSupportNetworkInformationRecord(
          recordType,
          idPathParams,
          sinceQueryParams,
        );
        expect(spy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(new SupportNetworkEntity(data));
      },
    );

    it.each([
      [
        SupportNetworkListResponseIncidentExample,
        RecordType.Incident,
        { id: 'test' } as IdPathParams,
        undefined,
      ],
    ])(
      'should return list values given good input',
      async (data, recordType, idPathParams, sinceQueryParams) => {
        const spy = jest.spyOn(httpService, 'get').mockReturnValueOnce(
          of({
            data: data,
            headers: {},
            config: {
              url:
                configService.get<string>('UPSTREAM_BASE_URL') +
                configService
                  .get<string>('SUPPORT_NETWORK_ENDPOINT')
                  .replace(/\s/g, '%20'),
              headers: {} as RawAxiosRequestHeaders,
            },
            status: 200,
            statusText: 'OK',
          } as AxiosResponse<any, any>),
        );

        const result = await service.getSingleSupportNetworkInformationRecord(
          recordType,
          idPathParams,
          sinceQueryParams,
        );
        expect(spy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(new NestedSupportNetworkEntity(data));
      },
    );

    it.each([[404], [500]])(
      `Should return HttpException with status 404 on axios error`,
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
          service.getSingleSupportNetworkInformationRecord(RecordType.Case, {
            id: 'doesNotExist',
          } as IdPathParams),
        ).rejects.toHaveProperty('status', 404);
        expect(spy).toHaveBeenCalledTimes(1);
      },
    );
  });
});
