import { Test, TestingModule } from '@nestjs/testing';
import { SafetyAssessmentService } from './safety-assessment.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpService } from '@nestjs/axios';
import { UtilitiesService } from '../utilities/utilities.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenRefresherService } from '../../external-api/token-refresher/token-refresher.service';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import configuration from '../../configuration/configuration';
import {
  NestedSafetyAssessmentEntity,
  SafetyAssessmentEntity,
  SafetyAssessmentListResponseIncidentExample,
  SafetyAssessmentSingleResponseIncidentExample,
} from '../../entities/safety-assessment.entity';
import { RecordType } from '../../common/constants/enumerations';
import {
  idName,
  safetyAssessmentIdName,
  afterParamName,
} from '../../common/constants/parameter-constants';
import {
  IdPathParams,
  SafetyAssessmentIdPathParams,
} from '../../dto/id-path-params.dto';
import { FilterQueryParams } from '../../dto/filter-query-params.dto';
import { AxiosResponse } from 'axios';
import { getMockRes } from '@jest-mock/express';

describe('SafetyAssessmentService', () => {
  let service: SafetyAssessmentService;
  let requestPreparerService: RequestPreparerService;
  const { res, mockClear } = getMockRes();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [configuration] })],
      providers: [
        SafetyAssessmentService,
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

    service = module.get<SafetyAssessmentService>(SafetyAssessmentService);
    requestPreparerService = module.get<RequestPreparerService>(
      RequestPreparerService,
    );
    mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getListSafetyAssessmentRecord tests', () => {
    it.each([
      [
        SafetyAssessmentListResponseIncidentExample,
        RecordType.Incident,
        { [idName]: 'test' } as IdPathParams,
        undefined,
      ],
      [
        SafetyAssessmentListResponseIncidentExample,
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

        const result = await service.getListSafetyAssessmentRecord(
          recordType,
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(spy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(new NestedSafetyAssessmentEntity(data));
      },
    );
  });

  describe('getSingleContactRecord tests', () => {
    it.each([
      [
        SafetyAssessmentSingleResponseIncidentExample,
        RecordType.Incident,
        {
          [idName]: 'test',
          [safetyAssessmentIdName]: 'test2',
        } as SafetyAssessmentIdPathParams,
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

        const result = await service.getSingleSafetyAssessmentRecord(
          recordType,
          idPathParams,
          res,
          'idir',
        );
        expect(spy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(new SafetyAssessmentEntity(data));
      },
    );
  });
});
