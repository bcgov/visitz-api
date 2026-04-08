import { Test, TestingModule } from '@nestjs/testing';
import { ContactsService } from './contacts.service';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../../configuration/configuration';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import { TokenRefresherService } from '../../external-api/token-refresher/token-refresher.service';
import { UtilitiesService } from '../utilities/utilities.service';
import { RecordType } from '../../common/constants/enumerations';
import { AxiosResponse } from 'axios';
import {
  contactIdName,
  idName,
  afterParamName,
  contactLanguageIdName,
} from '../../common/constants/parameter-constants';
import { FilterQueryParams } from '../../dto/filter-query-params.dto';
import {
  ContactIdPathParams,
  ContactLanguagesIdPathParams,
  IdPathParams,
} from '../../dto/id-path-params.dto';
import {
  ContactsEntity,
  ContactsListResponseCaseExample,
  ContactsSingleResponseCaseExample,
  NestedContactsEntity,
} from '../../entities/contacts.entity';
import { getMockRes } from '@jest-mock/express';
import { JwtService } from '@nestjs/jwt';
import {
  ContactLanguagesEntity,
  ContactLanguagesListResponseExample,
  ContactLanguagesSingleExample,
  NestedContactLanguagesEntity,
} from '../../entities/contact-languages.entity';
import {
  contactLanguagesType,
  stringNull,
} from '../../common/constants/upstream-constants';
import { PostContactLanguagesDtoUpstream } from '../../dto/post-contact-languages.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('ContactsService', () => {
  let service: ContactsService;
  let requestPreparerService: RequestPreparerService;
  const { res, mockClear } = getMockRes();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [configuration] })],
      providers: [
        ContactsService,
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

    service = module.get<ContactsService>(ContactsService);
    requestPreparerService = module.get<RequestPreparerService>(
      RequestPreparerService,
    );
    mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getListContactRecord tests', () => {
    it.each([
      [
        ContactsListResponseCaseExample,
        RecordType.Case,
        { [idName]: 'test' } as IdPathParams,
        undefined,
      ],
      [
        ContactsListResponseCaseExample,
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

        const result = await service.getListContactRecord(
          recordType,
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(spy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(new NestedContactsEntity(data));
      },
    );
  });

  describe('getSingleContactRecord tests', () => {
    it.each([
      [
        ContactsSingleResponseCaseExample,
        RecordType.Case,
        { [idName]: 'test', [contactIdName]: 'test2' } as ContactIdPathParams,
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

        const result = await service.getSingleContactRecord(
          recordType,
          idPathParams,
          res,
          'idir',
        );
        expect(spy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(new ContactsEntity(data));
      },
    );
  });

  describe('getListContactLanguagesRecord tests', () => {
    it.each([
      [
        ContactLanguagesListResponseExample,
        RecordType.Case,
        { [idName]: 'test', [contactIdName]: 'test2' } as ContactIdPathParams,
        undefined,
      ],
      [
        ContactLanguagesListResponseExample,
        RecordType.Case,
        { [idName]: 'test', [contactIdName]: 'test2' } as ContactIdPathParams,
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

        const result = await service.getListContactLanguagesRecord(
          recordType,
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(spy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(new NestedContactLanguagesEntity(data));
      },
    );
  });

  describe('getSingleContactLanguagesRecord tests', () => {
    it.each([
      [
        ContactLanguagesSingleExample,
        RecordType.Case,
        {
          [idName]: 'test',
          [contactIdName]: 'test2',
          [contactLanguageIdName]: 'test3',
        } as ContactLanguagesIdPathParams,
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

        const result = await service.getSingleContactLanguagesRecord(
          recordType,
          idPathParams,
          res,
          'idir',
        );
        expect(spy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(new ContactLanguagesEntity(data));
      },
    );
  });

  describe('postSingleContactLanguagesRecord tests', () => {
    it.each([
      [
        { items: [{ Id: 'Id Here' }] },
        RecordType.Case,
        new PostContactLanguagesDtoUpstream({
          Id: stringNull,
          'Language Name': 'English',
          Type: contactLanguagesType,
        }),
        { [idName]: 'test', [contactIdName]: 'Id Here' } as ContactIdPathParams,
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
        const checkSpy = jest
          .spyOn(requestPreparerService, 'sendGetRequest')
          .mockResolvedValueOnce({
            data: data,
            headers: {},
            status: 200,
            statusText: 'OK',
          } as AxiosResponse<any, any>);
        const result = await service.postSingleContactLanguagesRecord(
          recordType,
          body,
          'idir',
          id,
        );
        expect(spy).toHaveBeenCalledTimes(1);
        expect(checkSpy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(new NestedContactLanguagesEntity(data));
      },
    );

    it.each([
      [
        { items: [{ Id: 'Id Here' }] },
        RecordType.Case,
        new PostContactLanguagesDtoUpstream({
          Id: stringNull,
          'Language Name': 'English',
          Type: contactLanguagesType,
        }),
        { [idName]: 'test', [contactIdName]: 'Id Here' } as ContactIdPathParams,
      ],
    ])(
      'should return post values given good input, but no upstream preferred language',
      async (data, recordType, body, id) => {
        const spy = jest
          .spyOn(requestPreparerService, 'sendPutRequest')
          .mockResolvedValueOnce({
            data: data,
            headers: {},
            status: 200,
            statusText: 'OK',
          } as AxiosResponse<any, any>);
        const checkSpy = jest
          .spyOn(requestPreparerService, 'sendGetRequest')
          .mockImplementationOnce(() => {
            throw new HttpException({}, HttpStatus.NO_CONTENT);
          });
        const result = await service.postSingleContactLanguagesRecord(
          recordType,
          body,
          'idir',
          id,
        );
        expect(spy).toHaveBeenCalledTimes(1);
        expect(checkSpy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(new NestedContactLanguagesEntity(data));
      },
    );

    it.each([
      [
        RecordType.Case,
        new PostContactLanguagesDtoUpstream({
          Id: stringNull,
          'Language Name': 'English',
          Type: contactLanguagesType,
        }),
        { [idName]: 'test', [contactIdName]: 'Id Here' } as ContactIdPathParams,
      ],
    ])('should throw on non-404 check error', async (recordType, body, id) => {
      const checkSpy = jest
        .spyOn(requestPreparerService, 'sendGetRequest')
        .mockImplementationOnce(() => {
          throw new HttpException({}, HttpStatus.INTERNAL_SERVER_ERROR);
        });
      await expect(
        service.postSingleContactLanguagesRecord(recordType, body, 'idir', id),
      ).rejects.toThrow(HttpException);
      expect(checkSpy).toHaveBeenCalledTimes(1);
    });
  });
});
