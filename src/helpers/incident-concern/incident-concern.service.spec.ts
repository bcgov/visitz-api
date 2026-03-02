import { Test, TestingModule } from '@nestjs/testing';
import { IncidentConcernService } from './incident-concern.service';
import { getMockRes } from '@jest-mock/express';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import configuration from '../../configuration/configuration';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import { TokenRefresherService } from '../../external-api/token-refresher/token-refresher.service';
import { UtilitiesService } from '../utilities/utilities.service';
import { AxiosResponse } from 'axios';
import { RecordType } from '../../common/constants/enumerations';
import {
  idName,
  afterParamName,
  incidentConcernIdName,
} from '../../common/constants/parameter-constants';
import { FilterQueryParams } from '../../dto/filter-query-params.dto';
import {
  IdPathParams,
  IncidentConcernIdPathParams,
} from '../../dto/id-path-params.dto';
import {
  IncidentConcernListResponseExample,
  NestedIncidentConcernEntity,
  IncidentConcernSingleExample,
  IncidentConcernEntity,
} from '../../entities/incident-concern.entity';

describe('IncidentConcernService', () => {
  let service: IncidentConcernService;
  let requestPreparerService: RequestPreparerService;
  const { res, mockClear } = getMockRes();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [configuration] })],
      providers: [
        IncidentConcernService,
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

    service = module.get<IncidentConcernService>(IncidentConcernService);
    requestPreparerService = module.get<RequestPreparerService>(
      RequestPreparerService,
    );
    mockClear();

    service = module.get<IncidentConcernService>(IncidentConcernService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getListIncidentConcernRecord tests', () => {
    it.each([
      [
        IncidentConcernListResponseExample,
        RecordType.Incident,
        { [idName]: 'test' } as IdPathParams,
        undefined,
      ],
      [
        IncidentConcernListResponseExample,
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

        const result = await service.getListIncidentConcernRecord(
          recordType,
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(spy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(new NestedIncidentConcernEntity(data));
      },
    );
  });

  describe('getSingleIncidentConcernRecord tests', () => {
    it.each([
      [
        IncidentConcernSingleExample,
        RecordType.Incident,
        {
          [idName]: 'test',
          [incidentConcernIdName]: 'test2',
        } as IncidentConcernIdPathParams,
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

        const result = await service.getSingleIncidentConcernRecord(
          recordType,
          idPathParams,
          res,
          'idir',
        );
        expect(spy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(new IncidentConcernEntity(data));
      },
    );
  });
});
