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
  casesAttachmentsFieldName,
  idName,
  incidentsAttachmentsFieldName,
} from '../../common/constants/parameter-constants';
import { AxiosResponse } from 'axios';
import {
  AttachmentsEntity,
  AttachmentsListResponseIncidentExample,
  AttachmentsSingleResponseCaseExample,
  NestedAttachmentsEntity,
} from '../../entities/attachments.entity';

describe('AttachmentsService', () => {
  let service: AttachmentsService;
  let requestPreparerService: RequestPreparerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSingleAttachmentRecord tests', () => {
    it.each([
      [
        RecordType.Case,
        { [idName]: 'id' },
        casesAttachmentsFieldName,
        AttachmentsSingleResponseCaseExample,
      ],
    ])(
      'should return a single attachment entity given good inputs',
      async (type, id, typeFieldName, data) => {
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
        );
        expect(spy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(new AttachmentsEntity(data));
      },
    );

    it.each([
      [
        RecordType.Incident,
        { [idName]: 'id' },
        incidentsAttachmentsFieldName,
        { since: '2023-11-13' },
        AttachmentsListResponseIncidentExample,
      ],
    ])(
      'should return a nested attachment entity given good inputs',
      async (type, id, typeFieldName, since, data) => {
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
          since,
        );
        expect(spy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(new NestedAttachmentsEntity(data));
      },
    );
  });
});
