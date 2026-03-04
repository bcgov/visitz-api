import { Test, TestingModule } from '@nestjs/testing';
import { CallInformationService } from './call-information.service';
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
  callInformationIdName,
} from '../../common/constants/parameter-constants';
import { FilterQueryParams } from '../../dto/filter-query-params.dto';
import {
  IdPathParams,
  CallInformationIdPathParams,
} from '../../dto/id-path-params.dto';
import {
  CallInformationListResponseIncidentExample,
  NestedCallInformationEntity,
  CallInformationSingleResponseIncidentExample,
  CallInformationEntity,
} from '../../entities/call-information.entity';

describe('CallInformationService', () => {
  let service: CallInformationService;

  let requestPreparerService: RequestPreparerService;
  const { res, mockClear } = getMockRes();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [configuration] })],
      providers: [
        CallInformationService,
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

    service = module.get<CallInformationService>(CallInformationService);
    requestPreparerService = module.get<RequestPreparerService>(
      RequestPreparerService,
    );
    mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getListCallInformationRecord tests', () => {
    it.each([
      [
        CallInformationListResponseIncidentExample,
        RecordType.Incident,
        { [idName]: 'test' } as IdPathParams,
        undefined,
      ],
      [
        CallInformationListResponseIncidentExample,
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

        const result = await service.getListCallInformationRecord(
          recordType,
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(spy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(new NestedCallInformationEntity(data));
      },
    );
  });

  describe('getSingleCallInformationRecord tests', () => {
    it.each([
      [
        CallInformationSingleResponseIncidentExample,
        RecordType.Incident,
        {
          [idName]: 'test',
          [callInformationIdName]: 'test2',
        } as CallInformationIdPathParams,
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

        const result = await service.getSingleCallInformationRecord(
          recordType,
          idPathParams,
          res,
          'idir',
        );
        expect(spy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(new CallInformationEntity(data));
      },
    );
  });
});
