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
  afterParamName,
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
import { JwtService } from '@nestjs/jwt';
import { VirusScanService } from '../virus-scan/virus-scan.service';
import {
  PostAttachmentDtoUpstream,
  PostAttachmentsCaseReturnExample,
  PostAttachmentsMemoReturnExample,
} from '../../dto/post-attachment.dto';
import { IdPathParams } from '../../dto/id-path-params.dto';
import { Readable } from 'stream';

describe('AttachmentsService', () => {
  let service: AttachmentsService;
  let virusScanService: VirusScanService;
  let requestPreparerService: RequestPreparerService;
  const { res, mockClear } = getMockRes();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [configuration] })],
      providers: [
        AttachmentsService,
        UtilitiesService,
        ConfigService,
        JwtService,
        TokenRefresherService,
        RequestPreparerService,
        VirusScanService,
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
    virusScanService = module.get<VirusScanService>(VirusScanService);
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
        { [afterParamName]: '2023-11-13' },
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
        { [afterParamName]: '2023-11-13' },
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

  describe('postSingleAttachmentRecord tests', () => {
    it.each([
      [
        PostAttachmentsCaseReturnExample,
        RecordType.Case,
        new PostAttachmentDtoUpstream({
          ...PostAttachmentsCaseReturnExample,
          [attachmentIdName]: 'ESIzRFVm',
        }),
        { [idName]: 'test' } as IdPathParams,
        {
          fieldname: '',
          originalname: 'filename.png',
          encoding: '',
          mimetype: 'image/png',
          size: 6,
          stream: Readable.from(Buffer.from([11, 22, 33, 44, 55, 66])),
          destination: '',
          filename: '',
          path: '',
          buffer: Buffer.from([11, 22, 33, 44, 55, 66]),
        } as Express.Multer.File,
      ],
      [
        PostAttachmentsMemoReturnExample,
        RecordType.Memo,
        new PostAttachmentDtoUpstream({
          ...PostAttachmentsMemoReturnExample,
          [attachmentIdName]: 'ESIzRFVm',
        }),
        { [idName]: 'test' } as IdPathParams,
        {
          fieldname: '',
          originalname: 'filename',
          encoding: '',
          mimetype: 'image/png',
          size: 6,
          stream: Readable.from(Buffer.from([11, 22, 33, 44, 55, 66])),
          destination: '',
          filename: '',
          path: '',
          buffer: Buffer.from([11, 22, 33, 44, 55, 66]),
        } as Express.Multer.File,
      ],
    ])(
      'should return post values given good input',
      async (data, recordType, body, id, file) => {
        const checkSpy = jest
          .spyOn(requestPreparerService, 'sendGetRequest')
          .mockResolvedValueOnce({
            data: {},
            headers: {},
            status: 200,
            statusText: 'OK',
          } as AxiosResponse<any, any>);
        const spy = jest
          .spyOn(requestPreparerService, 'sendPostRequest')
          .mockResolvedValueOnce({
            data: data,
            headers: {},
            status: 200,
            statusText: 'OK',
          } as AxiosResponse<any, any>);

        const virusScanSpy = jest
          .spyOn(virusScanService, 'scanFile')
          .mockResolvedValueOnce();

        const result = await service.postSingleAttachmentRecord(
          recordType,
          body,
          'idir',
          id,
          file,
        );
        expect(spy).toHaveBeenCalledTimes(1);
        expect(virusScanSpy).toHaveBeenCalledTimes(1);
        expect(checkSpy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(new NestedAttachmentsEntity(data));
      },
    );
  });
});
