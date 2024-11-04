import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
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
import { TokenRefresherService } from '../../external-api/token-refresher/token-refresher.service';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';

describe('SupportNetworkService', () => {
  let service: SupportNetworkService;
  let requestPreparerService: RequestPreparerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        SupportNetworkService,
        UtilitiesService,
        ConfigService,
        TokenRefresherService,
        RequestPreparerService,
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
    requestPreparerService = module.get<RequestPreparerService>(
      RequestPreparerService,
    );
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
        const spy = jest
          .spyOn(requestPreparerService, 'sendGetRequest')
          .mockResolvedValueOnce({
            data: data,
            headers: {},
            status: 200,
            statusText: 'OK',
          } as AxiosResponse<any, any>);

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
        const spy = jest
          .spyOn(requestPreparerService, 'sendGetRequest')
          .mockResolvedValueOnce({
            data: data,
            headers: {},
            status: 200,
            statusText: 'OK',
          } as AxiosResponse<any, any>);

        const result = await service.getSingleSupportNetworkInformationRecord(
          recordType,
          idPathParams,
          sinceQueryParams,
        );
        expect(spy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(new NestedSupportNetworkEntity(data));
      },
    );
  });
});
