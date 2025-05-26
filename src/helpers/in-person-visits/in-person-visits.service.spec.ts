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
import {
  FilterQueryParams,
  VisitDetailsQueryParams,
} from '../../dto/filter-query-params.dto';
import {
  InPersonVisitsEntityMultiValue,
  InPersonVisitsEntityNoMultiValue,
  InPersonVisitsListResponseCaseExample,
  InPersonVisitsSingleResponseCaseExample,
  InPersonVisitsSingleResponseCaseExampleNoMultiValue,
  NestedInPersonVisitsMultiValueEntity,
  NestedInPersonVisitsNoMultiValueEntity,
  PostInPersonVisitResponseExample,
} from '../../entities/in-person-visits.entity';
import {
  idName,
  afterParamName,
  visitIdName,
} from '../../common/constants/parameter-constants';
import { PostInPersonVisitDtoUpstream } from '../../dto/post-in-person-visit.dto';
import { getMockRes } from '@jest-mock/express';
import configuration from '../../configuration/configuration';
import { JwtService } from '@nestjs/jwt';
import { caseChildServices } from '../../common/constants/upstream-constants';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';

describe('InPersonVisitsService', () => {
  let service: InPersonVisitsService;
  let requestPreparerService: RequestPreparerService;
  let configService: ConfigService;
  let typeFieldName: string | undefined;
  const { res, mockClear } = getMockRes();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [configuration] })],
      providers: [
        InPersonVisitsService,
        UtilitiesService,
        JwtService,
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
    configService = module.get<ConfigService>(ConfigService);
    typeFieldName = configService.get('upstreamAuth.case.typeField');
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
        {
          [afterParamName]: '2020-12-24',
          multivalue: 'true',
        } as VisitDetailsQueryParams,
      ],
    ])(
      'should return list values given good input',
      async (data, recordType, idPathParams, filterQueryParams) => {
        const spy = jest
          .spyOn(requestPreparerService, 'sendGetRequest')
          .mockResolvedValueOnce({
            data: { items: [{ [`${typeFieldName}`]: caseChildServices }] },
            headers: {},
            status: 200,
            statusText: 'OK',
          } as AxiosResponse<any, any>)
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
        expect(spy).toHaveBeenCalledTimes(2);
        if (filterQueryParams && filterQueryParams.multivalue === 'true') {
          expect(result).toEqual(
            new NestedInPersonVisitsMultiValueEntity(data),
          );
        } else {
          expect(result).toEqual(
            new NestedInPersonVisitsNoMultiValueEntity(data),
          );
        }
      },
    );

    it.each([
      [
        RecordType.Case,
        { [idName]: 'test' } as IdPathParams,
        { [afterParamName]: '2020-12-24' } as FilterQueryParams,
      ],
    ])(
      'should return bad request exception on non-child services case',
      async (recordType, idPathParams, filterQueryParams) => {
        const caseTypeSpy = jest
          .spyOn(requestPreparerService, 'sendGetRequest')
          .mockResolvedValueOnce({
            data: { items: [{ [`${typeFieldName}`]: 'randomCaseType' }] },
            headers: {},
            status: 200,
            statusText: 'OK',
          } as AxiosResponse<any, any>);

        await expect(
          service.getListInPersonVisitRecord(
            recordType,
            idPathParams,
            res,
            'idir',
            filterQueryParams,
          ),
        ).rejects.toThrow(BadRequestException);
        expect(caseTypeSpy).toHaveBeenCalledTimes(1);
      },
    );
  });

  describe('getSingleInPersonVisitRecord tests', () => {
    it.each([
      [
        InPersonVisitsSingleResponseCaseExampleNoMultiValue,
        RecordType.Case,
        { [idName]: 'test', [visitIdName]: 'test2' } as VisitIdPathParams,
        undefined,
      ],
      [
        InPersonVisitsSingleResponseCaseExample,
        RecordType.Case,
        { [idName]: 'test', [visitIdName]: 'test2' } as VisitIdPathParams,
        {
          multivalue: 'true',
        } as VisitDetailsQueryParams,
      ],
    ])(
      'should return single values given good input',
      async (data, recordType, idPathParams, filterQueryParams) => {
        const spy = jest
          .spyOn(requestPreparerService, 'sendGetRequest')
          .mockResolvedValueOnce({
            data: { items: [{ [`${typeFieldName}`]: caseChildServices }] },
            headers: {},
            status: 200,
            statusText: 'OK',
          } as AxiosResponse<any, any>)
          .mockResolvedValueOnce({
            data: { items: { ...data } },
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
        expect(spy).toHaveBeenCalledTimes(2);
        if (filterQueryParams && filterQueryParams.multivalue === 'true') {
          expect(result).toEqual(new InPersonVisitsEntityMultiValue(data));
        } else {
          expect(result).toEqual(new InPersonVisitsEntityNoMultiValue(data));
        }
      },
    );

    it.each([
      [
        RecordType.Case,
        { [idName]: 'test', [visitIdName]: 'test2' } as VisitIdPathParams,
      ],
    ])(
      'should return bad request exception on non-child services case',
      async (recordType, idPathParams) => {
        const caseTypeSpy = jest
          .spyOn(requestPreparerService, 'sendGetRequest')
          .mockResolvedValueOnce({
            data: { items: [{ [`${typeFieldName}`]: 'randomCaseType' }] },
            headers: {},
            status: 200,
            statusText: 'OK',
          } as AxiosResponse<any, any>);

        await expect(
          service.getSingleInPersonVisitRecord(
            recordType,
            idPathParams,
            res,
            'idir',
          ),
        ).rejects.toThrow(BadRequestException);
        expect(caseTypeSpy).toHaveBeenCalledTimes(1);
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
          .spyOn(requestPreparerService, 'sendPutRequest')
          .mockResolvedValueOnce({
            data: data,
            headers: {},
            status: 200,
            statusText: 'OK',
          } as AxiosResponse<any, any>);
        const caseTypeSpy = jest
          .spyOn(requestPreparerService, 'sendGetRequest')
          .mockResolvedValueOnce({
            data: { items: [{ [`${typeFieldName}`]: caseChildServices }] },
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
        expect(caseTypeSpy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(new NestedInPersonVisitsMultiValueEntity(data));
      },
    );

    it.each([
      [
        RecordType.Case,
        new PostInPersonVisitDtoUpstream({
          'Date of visit': '11/08/2024 08:24:11',
          'Visit Details Value': VisitDetails.NotPrivateInHome,
          'Visit Description': 'comment',
        }),
      ],
    ])(
      'should return bad request exception on non-child services case',
      async (recordType, body) => {
        const caseTypeSpy = jest
          .spyOn(requestPreparerService, 'sendGetRequest')
          .mockResolvedValueOnce({
            data: { items: [{ [`${typeFieldName}`]: 'randomCaseType' }] },
            headers: {},
            status: 200,
            statusText: 'OK',
          } as AxiosResponse<any, any>);

        await expect(
          service.postSingleInPersonVisitRecord(recordType, body, 'idir'),
        ).rejects.toThrow(BadRequestException);
        expect(caseTypeSpy).toHaveBeenCalledTimes(1);
      },
    );
  });

  describe('isChildCaseType tests', () => {
    it('should return true when type field is a child services case', async () => {
      const spy = jest
        .spyOn(requestPreparerService, 'sendGetRequest')
        .mockResolvedValueOnce({
          data: { items: [{ [`${typeFieldName}`]: caseChildServices }] },
          headers: {},
          status: 200,
          statusText: 'OK',
        } as AxiosResponse<any, any>);

      const isChildCase = await service.isChildCaseType('parentId', 'idir');
      expect(spy).toHaveBeenCalledTimes(1);
      expect(isChildCase).toBe(true);
    });

    it('should return false when type field is not a child services case', async () => {
      const spy = jest
        .spyOn(requestPreparerService, 'sendGetRequest')
        .mockResolvedValueOnce({
          data: { items: [{ [`${typeFieldName}`]: 'randomCaseType' }] },
          headers: {},
          status: 200,
          statusText: 'OK',
        } as AxiosResponse<any, any>);

      const isChildCase = await service.isChildCaseType('parentId', 'idir');
      expect(spy).toHaveBeenCalledTimes(1);
      expect(isChildCase).toBe(false);
    });

    it('should return false when type field does not exist on case entity', async () => {
      const spy = jest
        .spyOn(requestPreparerService, 'sendGetRequest')
        .mockResolvedValueOnce({
          data: { items: [{ [`${typeFieldName}sss`]: 'randomCaseType' }] },
          headers: {},
          status: 200,
          statusText: 'OK',
        } as AxiosResponse<any, any>);

      const isChildCase = await service.isChildCaseType('parentId', 'idir');
      expect(spy).toHaveBeenCalledTimes(1);
      expect(isChildCase).toBe(false);
    });

    it('should return false on upstream error', async () => {
      const spy = jest
        .spyOn(requestPreparerService, 'sendGetRequest')
        .mockRejectedValueOnce(new HttpException({}, HttpStatus.NO_CONTENT));

      const isChildCase = await service.isChildCaseType('parentId', 'idir');
      expect(spy).toHaveBeenCalledTimes(1);
      expect(isChildCase).toBe(false);
    });
  });
});
