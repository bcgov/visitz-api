import { Test, TestingModule } from '@nestjs/testing';
import { ResponseNarrativeService } from './response-narrative.service';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import configuration from '../../configuration/configuration';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import { TokenRefresherService } from '../../external-api/token-refresher/token-refresher.service';
import { UtilitiesService } from '../utilities/utilities.service';
import { getMockRes } from '@jest-mock/express';
import { AxiosResponse } from 'axios';
import { RecordType } from '../../common/constants/enumerations';
import {
  idName,
  afterParamName,
  responseNarrativeIdName,
} from '../../common/constants/parameter-constants';
import { FilterQueryParams } from '../../dto/filter-query-params.dto';
import {
  IdPathParams,
  ResponseNarrativeIdPathParams,
} from '../../dto/id-path-params.dto';
import {
  ResponseNarrativeListResponseIncidentExample,
  NestedResponseNarrativeEntity,
  ResponseNarrativeSingleResponseIncidentExample,
  ResponseNarrativeEntity,
} from '../../entities/response-narrative.entity';

describe('ResponseNarrativeService', () => {
  let service: ResponseNarrativeService;
  let requestPreparerService: RequestPreparerService;
  const { res, mockClear } = getMockRes();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [configuration] })],
      providers: [
        ResponseNarrativeService,
        UtilitiesService,
        ConfigService,
        JwtService,
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

    service = module.get<ResponseNarrativeService>(ResponseNarrativeService);
    requestPreparerService = module.get<RequestPreparerService>(
      RequestPreparerService,
    );
    mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getListResponseNarrativeRecord tests', () => {
    it.each([
      [
        ResponseNarrativeListResponseIncidentExample,
        RecordType.Incident,
        { [idName]: 'test' } as IdPathParams,
        undefined,
      ],
      [
        ResponseNarrativeListResponseIncidentExample,
        RecordType.Incident,
        { [idName]: 'test' } as IdPathParams,
        { [afterParamName]: '2020-12-24' } as FilterQueryParams,
      ],
    ])(
      'should return list values given good input',
      async (data, recordType, idPathParams, filterQueryParams) => {
        const spy = jest
          .spyOn(requestPreparerService, 'sendGetRequest')
          .mockResolvedValueOnce({
            data: data,
            headers: {},
            status: 200,
            statusText: 'OK',
          } as AxiosResponse<any, any>);

        const result = await service.getListResponseNarrativeRecord(
          recordType,
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(spy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(new NestedResponseNarrativeEntity(data));
      },
    );
  });

  describe('getSingleResponseNarrativeRecord tests', () => {
    it.each([
      [
        ResponseNarrativeSingleResponseIncidentExample,
        RecordType.Incident,
        {
          [idName]: 'test',
          [responseNarrativeIdName]: 'test2',
        } as ResponseNarrativeIdPathParams,
      ],
    ])(
      'should return single values given good input',
      async (data, recordType, idPathParams) => {
        const spy = jest
          .spyOn(requestPreparerService, 'sendGetRequest')
          .mockResolvedValueOnce({
            data: data,
            headers: {},
            status: 200,
            statusText: 'OK',
          } as AxiosResponse<any, any>);

        const result = await service.getSingleResponseNarrativeRecord(
          recordType,
          idPathParams,
          res,
          'idir',
        );
        expect(spy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(new ResponseNarrativeEntity(data));
      },
    );
  });
});
