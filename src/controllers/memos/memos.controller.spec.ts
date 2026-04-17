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
  additionalInformationIdName,
  callInformationIdName,
  contactLanguageIdName,
  contactMedicalBehavioralIdName,
  contactEducationIdName,
} from '../../common/constants/parameter-constants';
import {
  AdditionalInformationIdPathParams,
  AttachmentIdPathParams,
  CallInformationIdPathParams,
  ContactEducationIdPathParams,
  ContactIdPathParams,
  ContactLanguagesIdPathParams,
  ContactMedicalBehavioralIdPathParams,
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
import { AdditionalInformationService } from '../../helpers/additional-information/additional-information.service';
import { CallInformationService } from '../../helpers/call-information/call-information.service';
import {
  AdditionalInformationListResponseMemoExample,
  NestedAdditionalInformationEntity,
  AdditionalInformationSingleResponseMemoExample,
  AdditionalInformationEntity,
} from '../../entities/additional-information.entity';
import {
  CallInformationListResponseMemoExample,
  NestedCallInformationEntity,
  CallInformationSingleResponseMemoExample,
  CallInformationEntity,
} from '../../entities/call-information.entity';
import {
  ContactLanguagesListResponseExample,
  NestedContactLanguagesEntity,
  ContactLanguagesSingleExample,
  ContactLanguagesEntity,
  PostContactLanguagesResponseExample,
} from '../../entities/contact-languages.entity';
import {
  ContactMedicalBehavioralListResponseExample,
  NestedContactMedicalBehavioralEntity,
  ContactMedicalBehavioralSingleExample,
  ContactMedicalBehavioralEntity,
} from '../../entities/contact-medical-behavioral.entity';
import {
  ContactEducationListResponseExample,
  NestedContactEducationEntity,
  ContactEducationSingleExample,
  ContactEducationEntity,
} from '../../entities/contact-education.entity';

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
        CallInformationService,
        AdditionalInformationService,
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

  describe('getListMemoCallInformationRecord tests', () => {
    it.each([
      [
        CallInformationListResponseMemoExample,
        { [idName]: 'test' } as IdPathParams,
        {
          [afterParamName]: '2020-02-02',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams) => {
        const memosServiceSpy = jest
          .spyOn(memosService, 'getListMemoCallInformationRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedCallInformationEntity(data)),
          );

        const result = await controller.getListMemoCallInformationRecord(
          req,
          idPathParams,
          res,
          filterQueryParams,
        );
        expect(memosServiceSpy).toHaveBeenCalledWith(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(result).toEqual(new NestedCallInformationEntity(data));
      },
    );
  });

  describe('getSingleMemoCallInformationRecord tests', () => {
    it.each([
      [
        CallInformationSingleResponseMemoExample,
        {
          [idName]: 'test',
          [callInformationIdName]: 'test2',
        } as CallInformationIdPathParams,
        {
          [afterParamName]: '2020-02-02',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams) => {
        const memosServiceSpy = jest
          .spyOn(memosService, 'getSingleMemoCallInformationRecord')
          .mockReturnValueOnce(
            Promise.resolve(new CallInformationEntity(data)),
          );

        const result = await controller.getSingleMemoCallInformationRecord(
          req,
          idPathParams,
          res,
        );
        expect(memosServiceSpy).toHaveBeenCalledWith(idPathParams, res, 'idir');
        expect(result).toEqual(new CallInformationEntity(data));
      },
    );
  });

  describe('getListMemoAdditionalInformationRecord tests', () => {
    it.each([
      [
        AdditionalInformationListResponseMemoExample,
        { [idName]: 'test' } as IdPathParams,
        {
          [afterParamName]: '2020-02-02',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams) => {
        const memosServiceSpy = jest
          .spyOn(memosService, 'getListMemoAdditionalInformationRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedAdditionalInformationEntity(data)),
          );

        const result = await controller.getListMemoAdditionalInformationRecord(
          req,
          idPathParams,
          res,
          filterQueryParams,
        );
        expect(memosServiceSpy).toHaveBeenCalledWith(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(result).toEqual(new NestedAdditionalInformationEntity(data));
      },
    );
  });

  describe('getSingleMemoAdditionalInformationRecord tests', () => {
    it.each([
      [
        AdditionalInformationSingleResponseMemoExample,
        {
          [idName]: 'test',
          [additionalInformationIdName]: 'test2',
        } as AdditionalInformationIdPathParams,
        {
          [afterParamName]: '2020-02-02',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams) => {
        const memosServiceSpy = jest
          .spyOn(memosService, 'getSingleMemoAdditionalInformationRecord')
          .mockReturnValueOnce(
            Promise.resolve(new AdditionalInformationEntity(data)),
          );

        const result =
          await controller.getSingleMemoAdditionalInformationRecord(
            req,
            idPathParams,
            res,
          );
        expect(memosServiceSpy).toHaveBeenCalledWith(idPathParams, res, 'idir');
        expect(result).toEqual(new AdditionalInformationEntity(data));
      },
    );
  });

  describe('getListMemoContactLanguagesRecord tests', () => {
    it.each([
      [
        ContactLanguagesListResponseExample,
        { [idName]: 'test', [contactIdName]: 'test2' } as ContactIdPathParams,
        {
          [afterParamName]: '2020-02-02',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams) => {
        const memosServiceSpy = jest
          .spyOn(memosService, 'getListMemoContactLanguagesRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedContactLanguagesEntity(data)),
          );

        const result = await controller.getListMemoContactLanguagesRecord(
          req,
          idPathParams,
          res,
          filterQueryParams,
        );
        expect(memosServiceSpy).toHaveBeenCalledWith(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(result).toEqual(new NestedContactLanguagesEntity(data));
      },
    );
  });

  describe('getSingleMemoContactLanguagesRecord tests', () => {
    it.each([
      [
        ContactLanguagesSingleExample,
        {
          [idName]: 'test',
          [contactIdName]: 'test2',
          [contactLanguageIdName]: 'test3',
        } as ContactLanguagesIdPathParams,
        {
          [afterParamName]: '2020-02-02',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams) => {
        const memosServiceSpy = jest
          .spyOn(memosService, 'getSingleMemoContactLanguagesRecord')
          .mockReturnValueOnce(
            Promise.resolve(new ContactLanguagesEntity(data)),
          );

        const result = await controller.getSingleMemoContactLanguagesRecord(
          req,
          idPathParams,
          res,
        );
        expect(memosServiceSpy).toHaveBeenCalledWith(idPathParams, res, 'idir');
        expect(result).toEqual(new ContactLanguagesEntity(data));
      },
    );
  });

  describe('postSingleMemoContactLanguagesRecord tests', () => {
    it.each([
      [
        {
          'Language Name': 'English',
        },
        { [idName]: 'test', [contactIdName]: 'Id Here' } as ContactIdPathParams,
        'idir',
        PostContactLanguagesResponseExample,
      ],
    ])(
      'should return a single nested given good input',
      async (body, idPathParams, idir, data) => {
        const memosServiceSpy = jest
          .spyOn(memosService, 'postSingleMemoContactLanguagesRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedContactLanguagesEntity(data)),
          );

        const result = await controller.postSingleMemoContactLanguagesRecord(
          getMockReq({ headers: { [idirUsernameHeaderField]: idir } }),
          body,
          idPathParams,
        );
        expect(memosServiceSpy).toHaveBeenCalledWith(body, idir, idPathParams);
        expect(result).toEqual(new NestedContactLanguagesEntity(data));
      },
    );
  });

  describe('getListMemoContactMedicalBehavioralRecord tests', () => {
    it.each([
      [
        ContactMedicalBehavioralListResponseExample,
        { [idName]: 'test', [contactIdName]: 'test2' } as ContactIdPathParams,
        {
          [afterParamName]: '2020-02-02',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams) => {
        const memosServiceSpy = jest
          .spyOn(memosService, 'getListMemoContactMedicalBehavioralRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedContactMedicalBehavioralEntity(data)),
          );

        const result =
          await controller.getListMemoContactMedicalBehavioralRecord(
            req,
            idPathParams,
            res,
            filterQueryParams,
          );
        expect(memosServiceSpy).toHaveBeenCalledWith(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(result).toEqual(new NestedContactMedicalBehavioralEntity(data));
      },
    );
  });

  describe('getSingleMemoContactMedicalBehavioralRecord tests', () => {
    it.each([
      [
        ContactMedicalBehavioralSingleExample,
        {
          [idName]: 'test',
          [contactIdName]: 'test2',
          [contactMedicalBehavioralIdName]: 'test3',
        } as ContactMedicalBehavioralIdPathParams,
        {
          [afterParamName]: '2020-02-02',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams) => {
        const memosServiceSpy = jest
          .spyOn(memosService, 'getSingleMemoContactMedicalBehavioralRecord')
          .mockReturnValueOnce(
            Promise.resolve(new ContactMedicalBehavioralEntity(data)),
          );

        const result =
          await controller.getSingleMemoContactMedicalBehavioralRecord(
            req,
            idPathParams,
            res,
          );
        expect(memosServiceSpy).toHaveBeenCalledWith(idPathParams, res, 'idir');
        expect(result).toEqual(new ContactMedicalBehavioralEntity(data));
      },
    );
  });

  describe('getListMemoContactEducationRecord tests', () => {
    it.each([
      [
        ContactEducationListResponseExample,
        { [idName]: 'test', [contactIdName]: 'test2' } as ContactIdPathParams,
        {
          [afterParamName]: '2020-02-02',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams) => {
        const memosServiceSpy = jest
          .spyOn(memosService, 'getListMemoContactEducationRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedContactEducationEntity(data)),
          );

        const result = await controller.getListMemoContactEducationRecord(
          req,
          idPathParams,
          res,
          filterQueryParams,
        );
        expect(memosServiceSpy).toHaveBeenCalledWith(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(result).toEqual(new NestedContactEducationEntity(data));
      },
    );
  });

  describe('getSingleMemoContactEducationRecord tests', () => {
    it.each([
      [
        ContactEducationSingleExample,
        {
          [idName]: 'test',
          [contactIdName]: 'test2',
          [contactEducationIdName]: 'test3',
        } as ContactEducationIdPathParams,
        {
          [afterParamName]: '2020-02-02',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams) => {
        const memosServiceSpy = jest
          .spyOn(memosService, 'getSingleMemoContactEducationRecord')
          .mockReturnValueOnce(
            Promise.resolve(new ContactEducationEntity(data)),
          );

        const result = await controller.getSingleMemoContactEducationRecord(
          req,
          idPathParams,
          res,
        );
        expect(memosServiceSpy).toHaveBeenCalledWith(idPathParams, res, 'idir');
        expect(result).toEqual(new ContactEducationEntity(data));
      },
    );
  });
});
