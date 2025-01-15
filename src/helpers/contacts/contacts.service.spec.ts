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
  sinceParamName,
} from '../../common/constants/parameter-constants';
import { FilterQueryParams } from '../../dto/filter-query-params.dto';
import {
  ContactIdPathParams,
  IdPathParams,
} from '../../dto/id-path-params.dto';
import {
  ContactsEntity,
  ContactsListResponseCaseExample,
  ContactsSingleResponseCaseExample,
  NestedContactsEntity,
} from '../../entities/contacts.entity';
import { getMockRes } from '@jest-mock/express';

describe('ContactsService', () => {
  let service: ContactsService;
  let requestPreparerService: RequestPreparerService;
  const { res, mockClear } = getMockRes();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [configuration] })],
      providers: [
        ContactsService,
        ContactsService,
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
});
