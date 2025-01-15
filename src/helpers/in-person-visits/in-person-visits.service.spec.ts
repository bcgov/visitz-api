import { Test, TestingModule } from '@nestjs/testing';
import { InPersonVisitsService } from './in-person-visits.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import { UtilitiesService } from '../utilities/utilities.service';
import { TokenRefresherService } from '../../external-api/token-refresher/token-refresher.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { IdPathParams, VisitIdPathParams } from '../../dto/id-path-params.dto';
import { RecordType, VisitDetails } from '../../common/constants/enumerations';
import { FilterQueryParams } from '../../dto/filter-query-params.dto';
import {
  InPersonVisitsEntity,
  InPersonVisitsListResponseCaseExample,
  InPersonVisitsSingleResponseCaseExample,
  NestedInPersonVisitsEntity,
  PostInPersonVisitResponseExample,
} from '../../entities/in-person-visits.entity';
import {
  idName,
  sinceParamName,
  visitIdName,
} from '../../common/constants/parameter-constants';
import { PostInPersonVisitDtoUpstream } from '../../dto/post-in-person-visit.dto';
import { getMockRes } from '@jest-mock/express';
import configuration from '../../configuration/configuration';

describe('InPersonVisitsService', () => {
  let service: InPersonVisitsService;
  let requestPreparerService: RequestPreparerService;
  const { res, mockClear } = getMockRes();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [configuration] })],
      providers: [
        InPersonVisitsService,
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

    service = module.get<InPersonVisitsService>(InPersonVisitsService);
    requestPreparerService = module.get<RequestPreparerService>(
      RequestPreparerService,
    );
    mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getListInPersonVisitRecord tests', () => {
    it.each([
      [
        InPersonVisitsListResponseCaseExample,
        RecordType.Case,
        { [idName]: 'test' } as IdPathParams,
        undefined,
      ],
      [
        InPersonVisitsListResponseCaseExample,
        RecordType.Case,
        { [idName]: 'test' } as IdPathParams,
        { [sinceParamName]: '2020-12-24' } as FilterQueryParams,
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

        const result = await service.getListInPersonVisitRecord(
          recordType,
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(spy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(new NestedInPersonVisitsEntity(data));
      },
    );
  });

  describe('getSingleInPersonVisitRecord tests', () => {
    it.each([
      [
        InPersonVisitsSingleResponseCaseExample,
        RecordType.Case,
        { [idName]: 'test', [visitIdName]: 'test2' } as VisitIdPathParams,
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

        const result = await service.getSingleInPersonVisitRecord(
          recordType,
          idPathParams,
          res,
          'idir',
        );
        expect(spy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(new InPersonVisitsEntity(data));
      },
    );
  });

  describe('postSingleInPersonVisitRecord tests', () => {
    it.each([
      [
        PostInPersonVisitResponseExample,
        RecordType.Case,
        new PostInPersonVisitDtoUpstream({
          'Date of visit': '11/08/2024 08:24:11',
          'Visit Details Value': VisitDetails.NotPrivateInHome,
          'Visit Description': 'comment',
        }),
      ],
    ])(
      'should return post values given good input',
      async (data, recordType, body) => {
        const spy = jest
          .spyOn(requestPreparerService, 'sendPostRequest')
          .mockResolvedValueOnce({
            data: data,
            headers: {},
            status: 200,
            statusText: 'OK',
          } as AxiosResponse<any, any>);

        const result = await service.postSingleInPersonVisitRecord(
          recordType,
          body,
          'idir',
        );
        expect(spy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(new NestedInPersonVisitsEntity(data));
      },
    );
  });
});
