import { Test, TestingModule } from '@nestjs/testing';
import { MemosController } from './memos.controller';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import { AuthService } from '../../common/guards/auth/auth.service';
import { TokenRefresherService } from '../../external-api/token-refresher/token-refresher.service';
import { AttachmentsService } from '../../helpers/attachments/attachments.service';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';
import { MemosService } from './memos.service';
import {
  attachmentIdName,
  contactIdName,
  idName,
  inlineAttachmentParamName,
  afterParamName,
} from '../../common/constants/parameter-constants';
import {
  AttachmentIdPathParams,
  ContactIdPathParams,
  IdPathParams,
} from '../../dto/id-path-params.dto';
import {
  AttachmentDetailsQueryParams,
  FilterQueryParams,
} from '../../dto/filter-query-params.dto';
import {
  AttachmentDetailsEntity,
  AttachmentDetailsMemoExample,
  AttachmentsListResponseMemoExample,
  AttachmentsSingleResponseMemoExample,
  NestedAttachmentsEntity,
} from '../../entities/attachments.entity';
import { getMockReq, getMockRes } from '@jest-mock/express';
import {
  idirUsernameHeaderField,
  startRowNumParamName,
} from '../../common/constants/upstream-constants';
import configuration from '../../configuration/configuration';
import { ContactsService } from '../../helpers/contacts/contacts.service';
import {
  ContactsEntity,
  ContactsListResponseMemoExample,
  NestedContactsEntity,
} from '../../entities/contacts.entity';
import { JwtService } from '@nestjs/jwt';
import { VirusScanService } from '../../helpers/virus-scan/virus-scan.service';
import { Readable } from 'stream';
import { AttachmentStatusEnum } from '../../common/constants/enumerations';
import { PostAttachmentsMemoReturnExample } from '../../dto/post-attachment.dto';

describe('MemosController', () => {
  let controller: MemosController;
  let memosService: MemosService;
  const { res, mockClear } = getMockRes();
  const req = getMockReq({ headers: { [idirUsernameHeaderField]: 'idir' } });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [configuration] })],
      providers: [
        MemosService,
        AuthService,
        ContactsService,
        AttachmentsService,
        VirusScanService,
        TokenRefresherService,
        RequestPreparerService,
        JwtService,
        { provide: CACHE_MANAGER, useValue: {} },
        ConfigService,
        UtilitiesService,
        { provide: HttpService, useValue: { get: jest.fn() } },
      ],
      controllers: [MemosController],
    }).compile();

    controller = module.get<MemosController>(MemosController);
    memosService = module.get<MemosService>(MemosService);
    mockClear();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getSingleMemoAttachmentRecord tests', () => {
    it.each([
      [
        AttachmentsListResponseMemoExample,
        { [idName]: 'test' } as IdPathParams,
        {
          [afterParamName]: '2020-02-02',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams) => {
        const memoServiceSpy = jest
          .spyOn(memosService, 'getSingleMemoAttachmentRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedAttachmentsEntity(data)),
          );

        const result = await controller.getSingleMemoAttachmentRecord(
          req,
          idPathParams,
          res,
          filterQueryParams,
        );
        expect(memoServiceSpy).toHaveBeenCalledWith(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(result).toEqual(new NestedAttachmentsEntity(data));
      },
    );
  });

  describe('getSingleMemoAttachmentDetailsRecord tests', () => {
    it.each([
      [
        AttachmentDetailsMemoExample,
        {
          [idName]: 'test',
          [attachmentIdName]: 'attachmenttest',
        } as AttachmentIdPathParams,
        {
          [afterParamName]: '2020-02-02',
          [startRowNumParamName]: 0,
        } as AttachmentDetailsQueryParams,
      ],
      [
        AttachmentsSingleResponseMemoExample,
        {
          [idName]: 'test',
          [attachmentIdName]: 'attachmenttest',
        } as AttachmentIdPathParams,
        {
          [afterParamName]: '2020-02-02',
          [startRowNumParamName]: 0,
          [inlineAttachmentParamName]: 'false',
        } as AttachmentDetailsQueryParams,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams, filterQueryParams) => {
        const memoServiceSpy = jest
          .spyOn(memosService, 'getSingleMemoAttachmentDetailsRecord')
          .mockReturnValueOnce(
            Promise.resolve(new AttachmentDetailsEntity(data)),
          );

        const result = await controller.getSingleMemoAttachmentDetailsRecord(
          req,
          idPathParams,
          res,
          filterQueryParams,
        );
        expect(memoServiceSpy).toHaveBeenCalledWith(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(result).toEqual(new AttachmentDetailsEntity(data));
      },
    );
  });

  describe('postSingleMemoAttachmentRecord tests', () => {
    it.each([
      [
        {
          Category: 'Documentation',
          'Form Description': 'KKCFS Document',
          Status: AttachmentStatusEnum.Profiled,
          Template: 'TEMPLATENAMEHERE',
        },
        { [idName]: 'test' } as IdPathParams,
        'idir',
        PostAttachmentsMemoReturnExample,
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
    ])(
      'should return a single nested given good input',
      async (body, idPathParams, idir, data, file) => {
        const memosServiceSpy = jest
          .spyOn(memosService, 'postSingleMemoAttachmentRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedAttachmentsEntity(data)),
          );

        const result = await controller.postSingleMemoAttachmentRecord(
          getMockReq({ headers: { [idirUsernameHeaderField]: idir } }),
          body,
          idPathParams,
          file,
        );
        expect(memosServiceSpy).toHaveBeenCalledWith(
          body,
          idir,
          idPathParams,
          file,
        );
        expect(result).toEqual(new NestedAttachmentsEntity(data));
      },
    );
  });

  describe('getListMemoContactRecord tests', () => {
    it.each([
      [
        ContactsListResponseMemoExample,
        { [idName]: 'test' } as IdPathParams,
        {
          [afterParamName]: '2020-02-02',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams) => {
        const memoServiceSpy = jest
          .spyOn(memosService, 'getListMemoContactRecord')
          .mockReturnValueOnce(Promise.resolve(new NestedContactsEntity(data)));

        const result = await controller.getListMemoContactRecord(
          req,
          idPathParams,
          res,
          filterQueryParams,
        );
        expect(memoServiceSpy).toHaveBeenCalledWith(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(result).toEqual(new NestedContactsEntity(data));
      },
    );
  });

  describe('getSingleMemoContactRecord tests', () => {
    it.each([
      [
        ContactsListResponseMemoExample,
        { [idName]: 'test', [contactIdName]: 'test2' } as ContactIdPathParams,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams) => {
        const memoServiceSpy = jest
          .spyOn(memosService, 'getSingleMemoContactRecord')
          .mockReturnValueOnce(Promise.resolve(new ContactsEntity(data)));

        const result = await controller.getSingleMemoContactRecord(
          req,
          idPathParams,
          res,
        );
        expect(memoServiceSpy).toHaveBeenCalledWith(idPathParams, res, 'idir');
        expect(result).toEqual(new ContactsEntity(data));
      },
    );
  });
});
