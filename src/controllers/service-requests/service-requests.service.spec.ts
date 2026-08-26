import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule, HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { ServiceRequestsService } from './service-requests.service';
import { SupportNetworkService } from '../../helpers/support-network/support-network.service';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';
import {
  NestedSupportNetworkEntity,
  PostSupportNetworkSRResponseExample,
  SupportNetworkEntity,
  SupportNetworkListResponseSRExample,
  SupportNetworkSingleResponseSRExample,
} from '../../entities/support-network.entity';
import {
  AttachmentStatusEnum,
  RecordType,
} from '../../common/constants/enumerations';
import {
  ActivityIdPathParams,
  ActivityPlanIdPathParams,
  AdditionalInformationIdPathParams,
  AttachmentIdPathParams,
  CallInformationIdPathParams,
  ContactEducationIdPathParams,
  ContactIdPathParams,
  ContactLanguagesIdPathParams,
  ContactLegalAuthorityIdPathParams,
  ContactMedicalBehavioralIdPathParams,
  IdPathParams,
  ResponseNarrativeIdPathParams,
  SupportNetworkIdPathParams,
} from '../../dto/id-path-params.dto';
import {
  AttachmentDetailsQueryParams,
  FilterQueryParams,
} from '../../dto/filter-query-params.dto';
import { TokenRefresherService } from '../../external-api/token-refresher/token-refresher.service';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import {
  attachmentIdName,
  contactIdName,
  idName,
  inlineAttachmentParamName,
  afterParamName,
  srAttachmentsFieldName,
  supportNetworkIdName,
  responseNarrativeIdName,
  additionalInformationIdName,
  callInformationIdName,
  contactLanguageIdName,
  contactMedicalBehavioralIdName,
  contactEducationIdName,
  contactLegalAuthorityIdName,
  activityIdName,
  activityPlanIdName,
} from '../../common/constants/parameter-constants';
import { AttachmentsService } from '../../helpers/attachments/attachments.service';
import {
  AttachmentDetailsEntity,
  AttachmentDetailsSRExample,
  AttachmentsListResponseSRExample,
  AttachmentsSingleResponseSRExample,
  NestedAttachmentsEntity,
} from '../../entities/attachments.entity';
import { getMockRes } from '@jest-mock/express';
import { startRowNumParamName } from '../../common/constants/upstream-constants';
import configuration from '../../configuration/configuration';
import { ContactsService } from '../../helpers/contacts/contacts.service';
import {
  ContactsEntity,
  ContactsListResponseSRExample,
  ContactsSingleResponseSRExample,
  NestedContactsEntity,
} from '../../entities/contacts.entity';
import { JwtService } from '@nestjs/jwt';
import { VirusScanService } from '../../helpers/virus-scan/virus-scan.service';
import { Readable } from 'stream';
import { PostAttachmentsSRReturnExample } from '../../dto/post-attachment.dto';
import { ResponseNarrativeService } from '../../helpers/response-narrative/response-narrative.service';
import {
  NestedResponseNarrativeEntity,
  ResponseNarrativeEntity,
  ResponseNarrativeListResponseSRExample,
  ResponseNarrativeSingleResponseSRExample,
} from '../../entities/response-narrative.entity';
import { AdditionalInformationService } from '../../helpers/additional-information/additional-information.service';
import { CallInformationService } from '../../helpers/call-information/call-information.service';
import {
  AdditionalInformationListResponseSRExample,
  NestedAdditionalInformationEntity,
  AdditionalInformationSingleResponseSRExample,
  AdditionalInformationEntity,
} from '../../entities/additional-information.entity';
import {
  CallInformationListResponseSRExample,
  NestedCallInformationEntity,
  CallInformationSingleResponseSRExample,
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
import { ActivityPlanService } from '../../helpers/activity-plan/activity-plan.service';
import {
  ActivitiesListResponseSRExample,
  NestedActivitiesEntity,
  ActivitiesSingleResponseSRExample,
  ActivitiesEntity,
  PostActivitiesResponseSRExample,
} from '../../entities/activities.entity';
import {
  ActivityPlanListResponseSRExample,
  NestedActivityPlanEntity,
  ActivityPlanSingleResponseSRExample,
  ActivityPlanEntity,
  PostActivityPlanResponseSRExample,
} from '../../entities/activity-plan.entity';

describe('ServiceRequestsService', () => {
  let service: ServiceRequestsService;
  let supportNetworkService: SupportNetworkService;
  let attachmentsService: AttachmentsService;
  let contactsService: ContactsService;
  let responseNarrativeService: ResponseNarrativeService;
  let callInformationService: CallInformationService;
  let additionalInformationService: AdditionalInformationService;
  let activitiesService: ActivitiesService;
  let activityPlanService: ActivityPlanService;
  const { res, mockClear } = getMockRes();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule.forRoot({ load: [configuration] })],
      providers: [
        ServiceRequestsService,
        SupportNetworkService,
        ContactsService,
        AttachmentsService,
        VirusScanService,
        ResponseNarrativeService,
        CallInformationService,
        AdditionalInformationService,
        ActivitiesService,
        ActivityPlanService,
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

    service = module.get<ServiceRequestsService>(ServiceRequestsService);
    supportNetworkService = module.get<SupportNetworkService>(
      SupportNetworkService,
    );
    attachmentsService = module.get<AttachmentsService>(AttachmentsService);
    contactsService = module.get<ContactsService>(ContactsService);
    responseNarrativeService = module.get<ResponseNarrativeService>(
      ResponseNarrativeService,
    );
    callInformationService = module.get<CallInformationService>(
      CallInformationService,
    );
    additionalInformationService = module.get<AdditionalInformationService>(
      AdditionalInformationService,
    );
    activitiesService = module.get<ActivitiesService>(ActivitiesService);
    activityPlanService = module.get<ActivityPlanService>(ActivityPlanService);
    mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getListSRSupportNetworkInformationRecord tests', () => {
    it.each([
      [
        SupportNetworkListResponseSRExample,
        { [idName]: 'test' } as IdPathParams,
        {
          [afterParamName]: '2024-12-01',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams) => {
        const supportNetworkSpy = jest
          .spyOn(
            supportNetworkService,
            'getListSupportNetworkInformationRecord',
          )
          .mockReturnValueOnce(
            Promise.resolve(new NestedSupportNetworkEntity(data)),
          );

        const result = await service.getListSRSupportNetworkInformationRecord(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(supportNetworkSpy).toHaveBeenCalledWith(
          RecordType.SR,
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(result).toEqual(new NestedSupportNetworkEntity(data));
      },
    );
  });

  describe('getSingleSRSupportNetworkInformationRecord tests', () => {
    it.each([
      [
        SupportNetworkSingleResponseSRExample,
        {
          [idName]: 'test',
          [supportNetworkIdName]: 'test2',
        } as SupportNetworkIdPathParams,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams) => {
        const supportNetworkSpy = jest
          .spyOn(
            supportNetworkService,
            'getSingleSupportNetworkInformationRecord',
          )
          .mockReturnValueOnce(Promise.resolve(new SupportNetworkEntity(data)));

        const result = await service.getSingleSRSupportNetworkInformationRecord(
          idPathParams,
          res,
          'idir',
        );
        expect(supportNetworkSpy).toHaveBeenCalledWith(
          RecordType.SR,
          idPathParams,
          res,
          'idir',
        );
        expect(result).toEqual(new SupportNetworkEntity(data));
      },
    );
  });

  describe('getSingleSRAttachmentRecord tests', () => {
    it.each([
      [
        AttachmentsListResponseSRExample,
        { [idName]: 'test' } as IdPathParams,
        {
          [afterParamName]: '2024-12-01',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
        srAttachmentsFieldName,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams, typeFieldName) => {
        const attachmentsSpy = jest
          .spyOn(attachmentsService, 'getSingleAttachmentRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedAttachmentsEntity(data)),
          );

        const result = await service.getSingleSRAttachmentRecord(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(attachmentsSpy).toHaveBeenCalledWith(
          RecordType.SR,
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

  describe('getSingleSRAttachmentDetailsRecord tests', () => {
    it.each([
      [
        AttachmentDetailsSRExample,
        {
          [idName]: 'test',
          [attachmentIdName]: 'attachmenttest',
        } as AttachmentIdPathParams,
        { [afterParamName]: '2024-12-01' } as AttachmentDetailsQueryParams,
        srAttachmentsFieldName,
      ],
      [
        AttachmentsSingleResponseSRExample,
        {
          [idName]: 'test',
          [attachmentIdName]: 'attachmenttest',
        } as AttachmentIdPathParams,
        {
          [afterParamName]: '2024-12-01',
          [inlineAttachmentParamName]: 'false',
        } as AttachmentDetailsQueryParams,
        srAttachmentsFieldName,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams, filterQueryParams, typeFieldName) => {
        const attachmentsSpy = jest
          .spyOn(attachmentsService, 'getSingleAttachmentDetailsRecord')
          .mockReturnValueOnce(
            Promise.resolve(new AttachmentDetailsEntity(data)),
          );

        const result = await service.getSingleSRAttachmentDetailsRecord(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(attachmentsSpy).toHaveBeenCalledWith(
          RecordType.SR,
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

  describe('postSingleSRAttachmentRecord tests', () => {
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
        PostAttachmentsSRReturnExample,
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

        const result = await service.postSingleSRAttachmentRecord(
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

  describe('getListSRContactRecord tests', () => {
    it.each([
      [
        ContactsListResponseSRExample,
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

        const result = await service.getListSRContactRecord(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(contactsSpy).toHaveBeenCalledWith(
          RecordType.SR,
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(result).toEqual(new NestedContactsEntity(data));
      },
    );
  });

  describe('getSingleSRContactRecord tests', () => {
    it.each([
      [
        ContactsSingleResponseSRExample,
        { [idName]: 'test', [contactIdName]: 'test2' } as ContactIdPathParams,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams) => {
        const contactsSpy = jest
          .spyOn(contactsService, 'getSingleContactRecord')
          .mockReturnValueOnce(Promise.resolve(new ContactsEntity(data)));

        const result = await service.getSingleSRContactRecord(
          idPathParams,
          res,
          'idir',
        );
        expect(contactsSpy).toHaveBeenCalledWith(
          RecordType.SR,
          idPathParams,
          res,
          'idir',
        );
        expect(result).toEqual(new ContactsEntity(data));
      },
    );
  });

  describe('getListSRResponseNarrativeRecord tests', () => {
    it.each([
      [
        ResponseNarrativeListResponseSRExample,
        { [idName]: 'test' } as IdPathParams,
        {
          [afterParamName]: '2024-12-01',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams) => {
        const responseNarrativeSpy = jest
          .spyOn(responseNarrativeService, 'getListResponseNarrativeRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedResponseNarrativeEntity(data)),
          );

        const result = await service.getListSRResponseNarrativeRecord(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(responseNarrativeSpy).toHaveBeenCalledWith(
          RecordType.SR,
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(result).toEqual(new NestedResponseNarrativeEntity(data));
      },
    );
  });

  describe('getSingleSRResponseNarrativeRecord tests', () => {
    it.each([
      [
        ResponseNarrativeSingleResponseSRExample,
        {
          [idName]: 'test',
          [responseNarrativeIdName]: 'test2',
        } as ResponseNarrativeIdPathParams,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams) => {
        const responseNarrativeSpy = jest
          .spyOn(responseNarrativeService, 'getSingleResponseNarrativeRecord')
          .mockReturnValueOnce(
            Promise.resolve(new ResponseNarrativeEntity(data)),
          );

        const result = await service.getSingleSRResponseNarrativeRecord(
          idPathParams,
          res,
          'idir',
        );
        expect(responseNarrativeSpy).toHaveBeenCalledWith(
          RecordType.SR,
          idPathParams,
          res,
          'idir',
        );
        expect(result).toEqual(new ResponseNarrativeEntity(data));
      },
    );
  });

  describe('getListSRCallInformationRecord tests', () => {
    it.each([
      [
        CallInformationListResponseSRExample,
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

        const result = await service.getListSRCallInformationRecord(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(callInformationSpy).toHaveBeenCalledWith(
          RecordType.SR,
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(result).toEqual(new NestedCallInformationEntity(data));
      },
    );
  });

  describe('getSingleSRCallInformationRecord tests', () => {
    it.each([
      [
        CallInformationSingleResponseSRExample,
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

        const result = await service.getSingleSRCallInformationRecord(
          idPathParams,
          res,
          'idir',
        );
        expect(callInformationSpy).toHaveBeenCalledWith(
          RecordType.SR,
          idPathParams,
          res,
          'idir',
        );
        expect(result).toEqual(new CallInformationEntity(data));
      },
    );
  });

  describe('getListSRAdditionalInformationRecord tests', () => {
    it.each([
      [
        AdditionalInformationListResponseSRExample,
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

        const result = await service.getListSRAdditionalInformationRecord(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(additionalInformationSpy).toHaveBeenCalledWith(
          RecordType.SR,
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(result).toEqual(new NestedAdditionalInformationEntity(data));
      },
    );
  });

  describe('getSingleSRAdditionalInformationRecord tests', () => {
    it.each([
      [
        AdditionalInformationSingleResponseSRExample,
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

        const result = await service.getSingleSRAdditionalInformationRecord(
          idPathParams,
          res,
          'idir',
        );
        expect(additionalInformationSpy).toHaveBeenCalledWith(
          RecordType.SR,
          idPathParams,
          res,
          'idir',
        );
        expect(result).toEqual(new AdditionalInformationEntity(data));
      },
    );
  });

  describe('postSingleSRSupportNetworkRecord tests', () => {
    it.each([
      [
        {
          Name: 'Test',
        },
        'idir',
        { [idName]: 'test' } as IdPathParams,
        PostSupportNetworkSRResponseExample,
      ],
    ])(
      'should return nested values given good input',
      async (body, idir, idPathParams, data) => {
        const SupportNetworksSpy = jest
          .spyOn(supportNetworkService, 'postSingleSupportNetworkRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedSupportNetworkEntity(data)),
          );

        const result = await service.postSingleSRSupportNetworkRecord(
          body,
          idir,
          idPathParams,
        );
        expect(SupportNetworksSpy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(new NestedSupportNetworkEntity(data));
      },
    );
  });

  describe('getListSRContactLanguagesRecord tests', () => {
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

        const result = await service.getListSRContactLanguagesRecord(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(contactsSpy).toHaveBeenCalledWith(
          RecordType.SR,
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(result).toEqual(new NestedContactLanguagesEntity(data));
      },
    );
  });

  describe('getSingleSRContactLanguagesRecord tests', () => {
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

        const result = await service.getSingleSRContactLanguagesRecord(
          idPathParams,
          res,
          'idir',
        );
        expect(contactsSpy).toHaveBeenCalledWith(
          RecordType.SR,
          idPathParams,
          res,
          'idir',
        );
        expect(result).toEqual(new ContactLanguagesEntity(data));
      },
    );
  });

  describe('postSingleSRContactLanguagesRecord tests', () => {
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

        const result = await service.postSingleSRContactLanguagesRecord(
          body,
          idir,
          idPathParams,
        );
        expect(contactLanguagesSpy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(new NestedContactLanguagesEntity(data));
      },
    );
  });

  describe('getListSRContactMedicalBehavioralRecord tests', () => {
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

        const result = await service.getListSRContactMedicalBehavioralRecord(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(contactsSpy).toHaveBeenCalledWith(
          RecordType.SR,
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(result).toEqual(new NestedContactMedicalBehavioralEntity(data));
      },
    );
  });

  describe('getSingleSRContactMedicalBehavioralRecord tests', () => {
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

        const result = await service.getSingleSRContactMedicalBehavioralRecord(
          idPathParams,
          res,
          'idir',
        );
        expect(contactsSpy).toHaveBeenCalledWith(
          RecordType.SR,
          idPathParams,
          res,
          'idir',
        );
        expect(result).toEqual(new ContactMedicalBehavioralEntity(data));
      },
    );
  });

  describe('getListSRContactEducationRecord tests', () => {
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

        const result = await service.getListSRContactEducationRecord(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(contactsSpy).toHaveBeenCalledWith(
          RecordType.SR,
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(result).toEqual(new NestedContactEducationEntity(data));
      },
    );
  });

  describe('getSingleSRContactEducationRecord tests', () => {
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

        const result = await service.getSingleSRContactEducationRecord(
          idPathParams,
          res,
          'idir',
        );
        expect(contactsSpy).toHaveBeenCalledWith(
          RecordType.SR,
          idPathParams,
          res,
          'idir',
        );
        expect(result).toEqual(new ContactEducationEntity(data));
      },
    );
  });

  describe('postSingleSRContactEducationRecord tests', () => {
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

        const result = await service.postSingleSRContactEducationRecord(
          body,
          idir,
          idPathParams,
        );
        expect(contactEducationSpy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(new ContactEducationEntity(data));
      },
    );
  });

  describe('getListSRContactLegalAuthorityRecord tests', () => {
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

        const result = await service.getListSRContactLegalAuthorityRecord(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(contactsSpy).toHaveBeenCalledWith(
          RecordType.SR,
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(result).toEqual(new NestedContactLegalAuthorityEntity(data));
      },
    );
  });

  describe('getSingleSRContactLegalAuthorityRecord tests', () => {
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

        const result = await service.getSingleSRContactLegalAuthorityRecord(
          idPathParams,
          res,
          'idir',
        );
        expect(contactsSpy).toHaveBeenCalledWith(
          RecordType.SR,
          idPathParams,
          res,
          'idir',
        );
        expect(result).toEqual(new ContactLegalAuthorityEntity(data));
      },
    );
  });

  describe('getListSRActivityRecord tests', () => {
    it.each([
      [
        ActivitiesListResponseSRExample,
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

        const result = await service.getListSRActivityRecord(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(activitiesSpy).toHaveBeenCalledWith(
          RecordType.SR,
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(result).toEqual(new NestedActivitiesEntity(data));
      },
    );
  });

  describe('getSingleSRActivityRecord tests', () => {
    it.each([
      [
        ActivitiesSingleResponseSRExample,
        { [idName]: 'test', [activityIdName]: 'test2' } as ActivityIdPathParams,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams) => {
        const activitiesSpy = jest
          .spyOn(activitiesService, 'getSingleActivityRecord')
          .mockReturnValueOnce(Promise.resolve(new ActivitiesEntity(data)));

        const result = await service.getSingleSRActivityRecord(
          idPathParams,
          res,
          'idir',
        );
        expect(activitiesSpy).toHaveBeenCalledWith(
          RecordType.SR,
          idPathParams,
          res,
          'idir',
        );
        expect(result).toEqual(new ActivitiesEntity(data));
      },
    );
  });

  describe('postSingleSRActivityRecord tests', () => {
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
        PostActivitiesResponseSRExample,
      ],
    ])(
      'should return nested values given good input',
      async (body, idir, idPathParams, data) => {
        const activitiesSpy = jest
          .spyOn(activitiesService, 'postSingleActivityRecord')
          .mockReturnValueOnce(Promise.resolve(new ActivitiesEntity(data)));

        const result = await service.postSingleSRActivityRecord(
          body,
          idir,
          idPathParams,
        );
        expect(activitiesSpy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(new ActivitiesEntity(data));
      },
    );
  });

  describe('getListSRActivityPlanRecord tests', () => {
    it.each([
      [
        ActivityPlanListResponseSRExample,
        { [idName]: 'test' } as IdPathParams,
        {
          [afterParamName]: '2024-12-01',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams) => {
        const activityPlanSpy = jest
          .spyOn(activityPlanService, 'getListActivityPlanRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedActivityPlanEntity(data)),
          );

        const result = await service.getListSRActivityPlanRecord(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(activityPlanSpy).toHaveBeenCalledWith(
          RecordType.SR,
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(result).toEqual(new NestedActivityPlanEntity(data));
      },
    );
  });

  describe('getSingleSRActivityPlanRecord tests', () => {
    it.each([
      [
        ActivityPlanSingleResponseSRExample,
        {
          [idName]: 'test',
          [activityPlanIdName]: 'test2',
        } as ActivityPlanIdPathParams,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams) => {
        const activityPlanSpy = jest
          .spyOn(activityPlanService, 'getSingleActivityPlanRecord')
          .mockReturnValueOnce(Promise.resolve(new ActivityPlanEntity(data)));

        const result = await service.getSingleSRActivityPlanRecord(
          idPathParams,
          res,
          'idir',
        );
        expect(activityPlanSpy).toHaveBeenCalledWith(
          RecordType.SR,
          idPathParams,
          res,
          'idir',
        );
        expect(result).toEqual(new ActivityPlanEntity(data));
      },
    );
  });

  describe('postSingleSRActivityPlanRecord tests', () => {
    it.each([
      [
        {
          Status: 'Open',
          Template: 'Template here',
        },
        'idir',
        { [idName]: 'test' } as IdPathParams,
        PostActivityPlanResponseSRExample,
      ],
    ])(
      'should return nested values given good input',
      async (body, idir, idPathParams, data) => {
        const activityPlanSpy = jest
          .spyOn(activityPlanService, 'postSingleActivityPlanRecord')
          .mockReturnValueOnce(Promise.resolve(new ActivityPlanEntity(data)));

        const result = await service.postSingleSRActivityPlanRecord(
          body,
          idir,
          idPathParams,
        );
        expect(activityPlanSpy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(new ActivityPlanEntity(data));
      },
    );
  });
});
