import { Test, TestingModule } from '@nestjs/testing';
import { MemosService } from './memos.service';
import { ConfigModule } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import { TokenRefresherService } from '../../external-api/token-refresher/token-refresher.service';
import { AttachmentsService } from '../../helpers/attachments/attachments.service';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';
import {
  AttachmentDetailsEntity,
  AttachmentDetailsMemoExample,
  AttachmentsListResponseMemoExample,
  AttachmentsSingleResponseMemoExample,
  NestedAttachmentsEntity,
} from '../../entities/attachments.entity';
import {
  AttachmentStatusEnum,
  RecordType,
} from '../../common/constants/enumerations';
import {
  attachmentIdName,
  contactIdName,
  idName,
  inlineAttachmentParamName,
  memoAttachmentsFieldName,
  afterParamName,
  additionalInformationIdName,
  callInformationIdName,
  contactLanguageIdName,
  contactMedicalBehavioralIdName,
  contactEducationIdName,
  contactLegalAuthorityIdName,
  activityIdName,
} from '../../common/constants/parameter-constants';
import {
  ActivityIdPathParams,
  AdditionalInformationIdPathParams,
  AttachmentIdPathParams,
  CallInformationIdPathParams,
  ContactEducationIdPathParams,
  ContactIdPathParams,
  ContactLanguagesIdPathParams,
  ContactLegalAuthorityIdPathParams,
  ContactMedicalBehavioralIdPathParams,
  IdPathParams,
} from '../../dto/id-path-params.dto';
import {
  AttachmentDetailsQueryParams,
  FilterQueryParams,
} from '../../dto/filter-query-params.dto';
import { getMockRes } from '@jest-mock/express';
import { startRowNumParamName } from '../../common/constants/upstream-constants';
import configuration from '../../configuration/configuration';
import { ContactsService } from '../../helpers/contacts/contacts.service';
import {
  ContactsEntity,
  ContactsListResponseMemoExample,
  ContactsSingleResponseMemoExample,
  NestedContactsEntity,
} from '../../entities/contacts.entity';
import { JwtService } from '@nestjs/jwt';
import { VirusScanService } from '../../helpers/virus-scan/virus-scan.service';
import { Readable } from 'stream';
import { PostAttachmentsMemoReturnExample } from '../../dto/post-attachment.dto';
import { CallInformationService } from '../../helpers/call-information/call-information.service';
import { AdditionalInformationService } from '../../helpers/additional-information/additional-information.service';
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
  ContactLanguagesEntity,
  ContactLanguagesListResponseExample,
  ContactLanguagesSingleExample,
  NestedContactLanguagesEntity,
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
  PostContactEducationResponseExample,
} from '../../entities/contact-education.entity';
import {
  ContactLegalAuthorityListResponseExample,
  NestedContactLegalAuthorityEntity,
  ContactLegalAuthoritySingleExample,
  ContactLegalAuthorityEntity,
} from '../../entities/contact-legals.entity';
import { ActivitiesService } from '../../helpers/activities/activities.service';
import {
  ActivitiesListResponseMemoExample,
  NestedActivitiesEntity,
  ActivitiesSingleResponseMemoExample,
  ActivitiesEntity,
  PostActivitiesResponseMemoExample,
} from '../../entities/activities.entity';

describe('MemosService', () => {
  let service: MemosService;
  let attachmentsService: AttachmentsService;
  let contactsService: ContactsService;
  let callInformationService: CallInformationService;
  let additionalInformationService: AdditionalInformationService;
  let activitiesService: ActivitiesService;
  const { res, mockClear } = getMockRes();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [configuration] })],
      providers: [
        MemosService,
        ContactsService,
        AttachmentsService,
        CallInformationService,
        AdditionalInformationService,
        ActivitiesService,
        VirusScanService,
        UtilitiesService,
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

    service = module.get<MemosService>(MemosService);
    attachmentsService = module.get<AttachmentsService>(AttachmentsService);
    contactsService = module.get<ContactsService>(ContactsService);
    callInformationService = module.get<CallInformationService>(
      CallInformationService,
    );
    additionalInformationService = module.get<AdditionalInformationService>(
      AdditionalInformationService,
    );
    activitiesService = module.get<ActivitiesService>(ActivitiesService);
    mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSingleMemoAttachmentRecord tests', () => {
    it.each([
      [
        AttachmentsListResponseMemoExample,
        { [idName]: 'test' } as IdPathParams,
        {
          [afterParamName]: '2024-12-01',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
        memoAttachmentsFieldName,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams, typeFieldName) => {
        const attachmentsSpy = jest
          .spyOn(attachmentsService, 'getSingleAttachmentRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedAttachmentsEntity(data)),
          );

        const result = await service.getSingleMemoAttachmentRecord(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(attachmentsSpy).toHaveBeenCalledWith(
          RecordType.Memo,
          idPathParams,
          typeFieldName,
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
        { [afterParamName]: '2024-12-01' } as AttachmentDetailsQueryParams,
        memoAttachmentsFieldName,
      ],
      [
        AttachmentsSingleResponseMemoExample,
        {
          [idName]: 'test',
          [attachmentIdName]: 'attachmenttest',
        } as AttachmentIdPathParams,
        {
          [afterParamName]: '2024-12-01',
          [inlineAttachmentParamName]: 'false',
        } as AttachmentDetailsQueryParams,
        memoAttachmentsFieldName,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams, filterQueryParams, typeFieldName) => {
        const attachmentsSpy = jest
          .spyOn(attachmentsService, 'getSingleAttachmentDetailsRecord')
          .mockReturnValueOnce(
            Promise.resolve(new AttachmentDetailsEntity(data)),
          );

        const result = await service.getSingleMemoAttachmentDetailsRecord(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(attachmentsSpy).toHaveBeenCalledWith(
          RecordType.Memo,
          idPathParams,
          typeFieldName,
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
        'idir',
        { [idName]: 'test' } as IdPathParams,
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
      'should return nested values given good input',
      async (body, idir, idPathParams, data, file) => {
        const attachmentsSpy = jest
          .spyOn(attachmentsService, 'postSingleAttachmentRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedAttachmentsEntity(data)),
          );

        const result = await service.postSingleMemoAttachmentRecord(
          body,
          idir,
          idPathParams,
          file,
        );
        expect(attachmentsSpy).toHaveBeenCalledTimes(1);
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
          [afterParamName]: '2024-12-01',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams) => {
        const contactsSpy = jest
          .spyOn(contactsService, 'getListContactRecord')
          .mockReturnValueOnce(Promise.resolve(new NestedContactsEntity(data)));

        const result = await service.getListMemoContactRecord(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(contactsSpy).toHaveBeenCalledWith(
          RecordType.Memo,
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
        ContactsSingleResponseMemoExample,
        { [idName]: 'test', [contactIdName]: 'test2' } as ContactIdPathParams,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams) => {
        const contactsSpy = jest
          .spyOn(contactsService, 'getSingleContactRecord')
          .mockReturnValueOnce(Promise.resolve(new ContactsEntity(data)));

        const result = await service.getSingleMemoContactRecord(
          idPathParams,
          res,
          'idir',
        );
        expect(contactsSpy).toHaveBeenCalledWith(
          RecordType.Memo,
          idPathParams,
          res,
          'idir',
        );
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
          [afterParamName]: '2024-12-01',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams) => {
        const callInformationSpy = jest
          .spyOn(callInformationService, 'getListCallInformationRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedCallInformationEntity(data)),
          );

        const result = await service.getListMemoCallInformationRecord(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(callInformationSpy).toHaveBeenCalledWith(
          RecordType.Memo,
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
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams) => {
        const callInformationSpy = jest
          .spyOn(callInformationService, 'getSingleCallInformationRecord')
          .mockReturnValueOnce(
            Promise.resolve(new CallInformationEntity(data)),
          );

        const result = await service.getSingleMemoCallInformationRecord(
          idPathParams,
          res,
          'idir',
        );
        expect(callInformationSpy).toHaveBeenCalledWith(
          RecordType.Memo,
          idPathParams,
          res,
          'idir',
        );
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
          [afterParamName]: '2024-12-01',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams) => {
        const additionalInformationSpy = jest
          .spyOn(
            additionalInformationService,
            'getListAdditionalInformationRecord',
          )
          .mockReturnValueOnce(
            Promise.resolve(new NestedAdditionalInformationEntity(data)),
          );

        const result = await service.getListMemoAdditionalInformationRecord(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(additionalInformationSpy).toHaveBeenCalledWith(
          RecordType.Memo,
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
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams) => {
        const additionalInformationSpy = jest
          .spyOn(
            additionalInformationService,
            'getSingleAdditionalInformationRecord',
          )
          .mockReturnValueOnce(
            Promise.resolve(new AdditionalInformationEntity(data)),
          );

        const result = await service.getSingleMemoAdditionalInformationRecord(
          idPathParams,
          res,
          'idir',
        );
        expect(additionalInformationSpy).toHaveBeenCalledWith(
          RecordType.Memo,
          idPathParams,
          res,
          'idir',
        );
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
          [afterParamName]: '2024-12-01',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams) => {
        const contactsSpy = jest
          .spyOn(contactsService, 'getListContactLanguagesRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedContactLanguagesEntity(data)),
          );

        const result = await service.getListMemoContactLanguagesRecord(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(contactsSpy).toHaveBeenCalledWith(
          RecordType.Memo,
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
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams) => {
        const contactsSpy = jest
          .spyOn(contactsService, 'getSingleContactLanguagesRecord')
          .mockReturnValueOnce(
            Promise.resolve(new ContactLanguagesEntity(data)),
          );

        const result = await service.getSingleMemoContactLanguagesRecord(
          idPathParams,
          res,
          'idir',
        );
        expect(contactsSpy).toHaveBeenCalledWith(
          RecordType.Memo,
          idPathParams,
          res,
          'idir',
        );
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
        'idir',
        { [idName]: 'test', [contactIdName]: 'Id Here' } as ContactIdPathParams,
        PostContactLanguagesResponseExample,
      ],
    ])(
      'should return nested values given good input',
      async (body, idir, idPathParams, data) => {
        const contactLanguagesSpy = jest
          .spyOn(contactsService, 'postSingleContactLanguagesRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedContactLanguagesEntity(data)),
          );

        const result = await service.postSingleMemoContactLanguagesRecord(
          body,
          idir,
          idPathParams,
        );
        expect(contactLanguagesSpy).toHaveBeenCalledTimes(1);
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
          [afterParamName]: '2024-12-01',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams) => {
        const contactsSpy = jest
          .spyOn(contactsService, 'getListContactMedicalBehavioralRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedContactMedicalBehavioralEntity(data)),
          );

        const result = await service.getListMemoContactMedicalBehavioralRecord(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(contactsSpy).toHaveBeenCalledWith(
          RecordType.Memo,
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
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams) => {
        const contactsSpy = jest
          .spyOn(contactsService, 'getSingleContactMedicalBehavioralRecord')
          .mockReturnValueOnce(
            Promise.resolve(new ContactMedicalBehavioralEntity(data)),
          );

        const result =
          await service.getSingleMemoContactMedicalBehavioralRecord(
            idPathParams,
            res,
            'idir',
          );
        expect(contactsSpy).toHaveBeenCalledWith(
          RecordType.Memo,
          idPathParams,
          res,
          'idir',
        );
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
          [afterParamName]: '2024-12-01',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams) => {
        const contactsSpy = jest
          .spyOn(contactsService, 'getListContactEducationRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedContactEducationEntity(data)),
          );

        const result = await service.getListMemoContactEducationRecord(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(contactsSpy).toHaveBeenCalledWith(
          RecordType.Memo,
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
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams) => {
        const contactsSpy = jest
          .spyOn(contactsService, 'getSingleContactEducationRecord')
          .mockReturnValueOnce(
            Promise.resolve(new ContactEducationEntity(data)),
          );

        const result = await service.getSingleMemoContactEducationRecord(
          idPathParams,
          res,
          'idir',
        );
        expect(contactsSpy).toHaveBeenCalledWith(
          RecordType.Memo,
          idPathParams,
          res,
          'idir',
        );
        expect(result).toEqual(new ContactEducationEntity(data));
      },
    );
  });

  describe('postSingleMemoContactEducationRecord tests', () => {
    it.each([
      [
        {
          Degree: '12',
        },
        'idir',
        { [idName]: 'test', [contactIdName]: 'Id Here' } as ContactIdPathParams,
        PostContactEducationResponseExample,
      ],
    ])(
      'should return nested values given good input',
      async (body, idir, idPathParams, data) => {
        const contactEducationSpy = jest
          .spyOn(contactsService, 'postSingleContactEducationRecord')
          .mockReturnValueOnce(
            Promise.resolve(new ContactEducationEntity(data)),
          );

        const result = await service.postSingleMemoContactEducationRecord(
          body,
          idir,
          idPathParams,
        );
        expect(contactEducationSpy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(new ContactEducationEntity(data));
      },
    );
  });

  describe('getListMemoContactLegalAuthorityRecord tests', () => {
    it.each([
      [
        ContactLegalAuthorityListResponseExample,
        { [idName]: 'test', [contactIdName]: 'test2' } as ContactIdPathParams,
        {
          [afterParamName]: '2024-12-01',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams) => {
        const contactsSpy = jest
          .spyOn(contactsService, 'getListContactLegalAuthorityRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedContactLegalAuthorityEntity(data)),
          );

        const result = await service.getListMemoContactLegalAuthorityRecord(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(contactsSpy).toHaveBeenCalledWith(
          RecordType.Memo,
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(result).toEqual(new NestedContactLegalAuthorityEntity(data));
      },
    );
  });

  describe('getSingleMemoContactLegalAuthorityRecord tests', () => {
    it.each([
      [
        ContactLegalAuthoritySingleExample,
        {
          [idName]: 'test',
          [contactIdName]: 'test2',
          [contactLegalAuthorityIdName]: 'test3',
        } as ContactLegalAuthorityIdPathParams,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams) => {
        const contactsSpy = jest
          .spyOn(contactsService, 'getSingleContactLegalAuthorityRecord')
          .mockReturnValueOnce(
            Promise.resolve(new ContactLegalAuthorityEntity(data)),
          );

        const result = await service.getSingleMemoContactLegalAuthorityRecord(
          idPathParams,
          res,
          'idir',
        );
        expect(contactsSpy).toHaveBeenCalledWith(
          RecordType.Memo,
          idPathParams,
          res,
          'idir',
        );
        expect(result).toEqual(new ContactLegalAuthorityEntity(data));
      },
    );
  });

  describe('getListMemoActivityRecord tests', () => {
    it.each([
      [
        ActivitiesListResponseMemoExample,
        { [idName]: 'test' } as IdPathParams,
        {
          [afterParamName]: '2024-12-01',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams) => {
        const activitiesSpy = jest
          .spyOn(activitiesService, 'getListActivityRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedActivitiesEntity(data)),
          );

        const result = await service.getListMemoActivityRecord(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(activitiesSpy).toHaveBeenCalledWith(
          RecordType.Memo,
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(result).toEqual(new NestedActivitiesEntity(data));
      },
    );
  });

  describe('getSingleMemoActivityRecord tests', () => {
    it.each([
      [
        ActivitiesSingleResponseMemoExample,
        { [idName]: 'test', [activityIdName]: 'test2' } as ActivityIdPathParams,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams) => {
        const activitiesSpy = jest
          .spyOn(activitiesService, 'getSingleActivityRecord')
          .mockReturnValueOnce(Promise.resolve(new ActivitiesEntity(data)));

        const result = await service.getSingleMemoActivityRecord(
          idPathParams,
          res,
          'idir',
        );
        expect(activitiesSpy).toHaveBeenCalledWith(
          RecordType.Memo,
          idPathParams,
          res,
          'idir',
        );
        expect(result).toEqual(new ActivitiesEntity(data));
      },
    );
  });

  describe('postSingleMemoActivityRecord tests', () => {
    it.each([
      [
        {
          Status: 'Open',
          Type: 'type',
          Description: 'description here',
          'Action By': 'Staff',
          Due: '2090-10-05T17:34:57',
          'Duration Minutes': '60',
          'Ministry Id': '0-R9NH',
          Planned: '2090-10-02T17:34:57',
          Priority: '3-Standard',
        },
        'idir',
        { [idName]: 'test' } as IdPathParams,
        PostActivitiesResponseMemoExample,
      ],
    ])(
      'should return nested values given good input',
      async (body, idir, idPathParams, data) => {
        const activitiesSpy = jest
          .spyOn(activitiesService, 'postSingleActivityRecord')
          .mockReturnValueOnce(Promise.resolve(new ActivitiesEntity(data)));

        const result = await service.postSingleMemoActivityRecord(
          body,
          idir,
          idPathParams,
        );
        expect(activitiesSpy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(new ActivitiesEntity(data));
      },
    );
  });
});
