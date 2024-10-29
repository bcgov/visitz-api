import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AxiosError, AxiosResponse, RawAxiosRequestHeaders } from 'axios';
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
        { provide: HttpService, useValue: { get: jest.fn() } },
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

    it(`Should return HttpException with status 404 on axios error`, async () => {
      const spy = jest.spyOn(httpService, 'get').mockImplementation(() => {
        throw new AxiosError('Axios Error');
      });

      await expect(
        service.getSingleSupportNetworkInformationRecord(RecordType.Case, {
          id: 'doesNotExist',
        } as IdPathParams),
      ).rejects.toHaveProperty('status', 404);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
