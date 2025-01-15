import { Test, TestingModule } from '@nestjs/testing';
import { AttachmentsService } from './attachments.service';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import { TokenRefresherService } from '../../external-api/token-refresher/token-refresher.service';
import { UtilitiesService } from '../utilities/utilities.service';
import { RecordType } from '../../common/constants/enumerations';
import {
  attachmentIdName,
  idName,
  incidentsAttachmentsFieldName,
  sinceParamName,
} from '../../common/constants/parameter-constants';
import { AxiosResponse } from 'axios';
import {
  AttachmentDetailsEntity,
  AttachmentDetailsIncidentExample,
  AttachmentsListResponseIncidentExample,
  NestedAttachmentsEntity,
} from '../../entities/attachments.entity';
import { getMockRes } from '@jest-mock/express';
import configuration from '../../configuration/configuration';

describe('AttachmentsService', () => {
  let service: AttachmentsService;
  let requestPreparerService: RequestPreparerService;
  const { res, mockClear } = getMockRes();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [configuration] })],
      providers: [
        AttachmentsService,
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

    service = module.get<AttachmentsService>(AttachmentsService);
    requestPreparerService = module.get<RequestPreparerService>(
      RequestPreparerService,
    );
    mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSingleAttachmentRecord tests', () => {
    it.each([
      [
        RecordType.Incident,
        { [idName]: 'id' },
        incidentsAttachmentsFieldName,
        { [sinceParamName]: '2023-11-13' },
        AttachmentsListResponseIncidentExample,
      ],
    ])(
      'should return a nested attachment entity given good inputs',
      async (type, id, typeFieldName, filter, data) => {
        const spy = jest
          .spyOn(requestPreparerService, 'sendGetRequest')
          .mockResolvedValueOnce({
            data: data,
            headers: {},
            status: 200,
            statusText: 'OK',
          } as AxiosResponse<any, any>);
        const result = await service.getSingleAttachmentRecord(
          type,
          id,
          typeFieldName,
          res,
          'idir',
          filter,
        );
        expect(spy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(new NestedAttachmentsEntity(data));
      },
    );
  });

  describe('getSingleAttachmentDetailsRecord tests', () => {
    it.each([
      [
        RecordType.Incident,
        { [idName]: 'id', [attachmentIdName]: 'attachmentId' },
        incidentsAttachmentsFieldName,
        { [sinceParamName]: '2023-11-13' },
        AttachmentDetailsIncidentExample,
      ],
    ])(
      'should return a nested attachment entity given good inputs',
      async (type, id, typeFieldName, filter, data) => {
        const spy = jest
          .spyOn(requestPreparerService, 'sendGetRequest')
          .mockResolvedValueOnce({
            data: data,
            headers: {},
            status: 200,
            statusText: 'OK',
          } as AxiosResponse<any, any>);
        const result = await service.getSingleAttachmentDetailsRecord(
          type,
          id,
          typeFieldName,
          res,
          'idir',
          filter,
        );
        expect(spy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(new AttachmentDetailsEntity(data));
      },
    );
  });
});
