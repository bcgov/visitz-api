import { Test, TestingModule } from '@nestjs/testing';
import { ActivitiesService } from './activities.service';
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
import { EntityType, RecordType } from '../../common/constants/enumerations';
import {
  idName,
  afterParamName,
  activityIdName,
} from '../../common/constants/parameter-constants';
import { FilterQueryParams } from '../../dto/filter-query-params.dto';
import {
  IdPathParams,
  ActivityIdPathParams,
} from '../../dto/id-path-params.dto';
import {
  ActivitiesListResponseCaseExample,
  NestedActivitiesEntity,
  ActivitiesSingleResponseCaseExample,
  ActivitiesEntity,
} from '../../entities/activities.entity';
import { stringNull } from '../../common/constants/upstream-constants';
import { PostActivityDtoUpstream } from '../../dto/post-activity.dto';

describe('ActivitiesService', () => {
  let service: ActivitiesService;
  let requestPreparerService: RequestPreparerService;
  const { res, mockClear } = getMockRes();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [configuration] })],
      providers: [
        ActivitiesService,
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

    service = module.get<ActivitiesService>(ActivitiesService);
    requestPreparerService = module.get<RequestPreparerService>(
      RequestPreparerService,
    );

    mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getListActivityRecord tests', () => {
    it.each([
      [
        ActivitiesListResponseCaseExample,
        RecordType.Case,
        { [idName]: 'test' } as IdPathParams,
        undefined,
      ],
      [
        ActivitiesListResponseCaseExample,
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

        const result = await service.getListActivityRecord(
          recordType,
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(spy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(new NestedActivitiesEntity(data));
      },
    );
  });

  describe('getSingleActivityRecord tests', () => {
    it.each([
      [
        ActivitiesSingleResponseCaseExample,
        RecordType.Case,
        { [idName]: 'test', [activityIdName]: 'test2' } as ActivityIdPathParams,
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

        const result = await service.getSingleActivityRecord(
          recordType,
          idPathParams,
          res,
          'idir',
        );
        expect(spy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(new ActivitiesEntity(data));
      },
    );
  });

  describe('postSingleActivityRecord tests', () => {
    it.each([
      [
        { items: [{ Activities: [{ Id: 'Id Here' }] }] },
        RecordType.Case,
        new PostActivityDtoUpstream({
          Id: stringNull,
          'ICM Type': EntityType.Case,
          'Case Id': 'caseid',
          'Primary Owned By': 'idir',
          Status: 'Open',
          Type: 'type',
          Description: 'description here',
          'Action By': 'Staff',
          Due: '2090-10-05T17:34:57',
          'Duration Minutes': '60',
          'Ministry Id': '0-R9NH',
          Planned: '2090-10-02T17:34:57',
          Priority: '3-Standard',
        }),
        { [idName]: 'test' } as IdPathParams,
      ],
    ])(
      'should return post values given good input',
      async (data, recordType, body, id) => {
        const spy = jest
          .spyOn(requestPreparerService, 'sendPutRequest')
          .mockResolvedValueOnce({
            data: data,
            headers: {},
            status: 200,
            statusText: 'OK',
          } as AxiosResponse<any, any>);
        const result = await service.postSingleActivityRecord(
          recordType,
          id,
          body,
          'idir',
        );
        expect(spy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(
          new ActivitiesEntity(data.items[0].Activities[0]),
        );
      },
    );
  });
});
