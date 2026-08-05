import { Test, TestingModule } from '@nestjs/testing';
import { ActivityPlanService } from './activity-plan.service';
import { getMockRes } from '@jest-mock/express';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService, ConfigModule } from '@nestjs/config';
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
  activityPlanIdName,
} from '../../common/constants/parameter-constants';
import { FilterQueryParams } from '../../dto/filter-query-params.dto';
import {
  IdPathParams,
  ActivityPlanIdPathParams,
} from '../../dto/id-path-params.dto';
import {
  ActivityPlanListResponseCaseExample,
  NestedActivityPlanEntity,
  ActivityPlanSingleResponseCaseExample,
  ActivityPlanEntity,
} from '../../entities/activity-plan.entity';

describe('ActivityPlanService', () => {
  let service: ActivityPlanService;
  let requestPreparerService: RequestPreparerService;
  const { res, mockClear } = getMockRes();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [configuration] })],
      providers: [
        ActivityPlanService,
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

    service = module.get<ActivityPlanService>(ActivityPlanService);
    requestPreparerService = module.get<RequestPreparerService>(
      RequestPreparerService,
    );

    mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getListActivityPlanRecord tests', () => {
    it.each([
      [
        ActivityPlanListResponseCaseExample,
        RecordType.Case,
        { [idName]: 'test' } as IdPathParams,
        undefined,
      ],
      [
        ActivityPlanListResponseCaseExample,
        RecordType.Case,
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

        const result = await service.getListActivityPlanRecord(
          recordType,
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(spy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(new NestedActivityPlanEntity(data));
      },
    );
  });

  describe('getSingleActivityPlanRecord tests', () => {
    it.each([
      [
        ActivityPlanSingleResponseCaseExample,
        RecordType.Case,
        {
          [idName]: 'test',
          [activityPlanIdName]: 'test2',
        } as ActivityPlanIdPathParams,
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

        const result = await service.getSingleActivityPlanRecord(
          recordType,
          idPathParams,
          res,
          'idir',
        );
        expect(spy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(new ActivityPlanEntity(data));
      },
    );
  });
});
