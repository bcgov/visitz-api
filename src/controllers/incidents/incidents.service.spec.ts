import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { IncidentsService } from './incidents.service';
import { SupportNetworkService } from '../../helpers/support-network/support-network.service';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';
import {
  NestedSupportNetworkEntity,
  PostSupportNetworkIncidentResponseExample,
  SupportNetworkEntity,
  SupportNetworkListResponseIncidentExample,
  SupportNetworkSingleResponseIncidentExample,
} from '../../entities/support-network.entity';
import {
  AttachmentDetailsQueryParams,
  FilterQueryParams,
} from '../../dto/filter-query-params.dto';
import {
  AdditionalInformationIdPathParams,
  AttachmentIdPathParams,
  CallInformationIdPathParams,
  ContactIdPathParams,
  ContactLanguagesIdPathParams,
  ContactMedicalBehavioralIdPathParams,
  IdPathParams,
  IncidentConcernIdPathParams,
  ResponseNarrativeIdPathParams,
  SafetyAssessmentIdPathParams,
  SupportNetworkIdPathParams,
} from '../../dto/id-path-params.dto';
import {
  AttachmentStatusEnum,
  RecordType,
} from '../../common/constants/enumerations';
import { TokenRefresherService } from '../../external-api/token-refresher/token-refresher.service';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import {
  attachmentIdName,
  contactIdName,
  idName,
  incidentsAttachmentsFieldName,
  inlineAttachmentParamName,
  afterParamName,
  safetyAssessmentIdName,
  supportNetworkIdName,
  responseNarrativeIdName,
  incidentConcernIdName,
  callInformationIdName,
  additionalInformationIdName,
  contactLanguageIdName,
  contactMedicalBehavioralIdName,
} from '../../common/constants/parameter-constants';
import { AttachmentsService } from '../../helpers/attachments/attachments.service';
import {
  AttachmentDetailsEntity,
  AttachmentDetailsIncidentExample,
  AttachmentsListResponseIncidentExample,
  AttachmentsSingleResponseIncidentExample,
  NestedAttachmentsEntity,
} from '../../entities/attachments.entity';
import { getMockRes } from '@jest-mock/express';
import { startRowNumParamName } from '../../common/constants/upstream-constants';
import configuration from '../../configuration/configuration';
import { ContactsService } from '../../helpers/contacts/contacts.service';
import {
  ContactsEntity,
  ContactsListResponseIncidentExample,
  ContactsSingleResponseIncidentExample,
  NestedContactsEntity,
} from '../../entities/contacts.entity';
import { JwtService } from '@nestjs/jwt';
import { SafetyAssessmentService } from '../../helpers/safety-assessment/safety-assessment.service';
import {
  NestedSafetyAssessmentEntity,
  SafetyAssessmentEntity,
  SafetyAssessmentListResponseIncidentExample,
  SafetyAssessmentSingleResponseIncidentExample,
} from '../../entities/safety-assessment.entity';
import { VirusScanService } from '../../helpers/virus-scan/virus-scan.service';
import { PostAttachmentsIncidentReturnExample } from '../../dto/post-attachment.dto';
import { Readable } from 'stream';
import { ResponseNarrativeService } from '../../helpers/response-narrative/response-narrative.service';
import {
  ResponseNarrativeListResponseIncidentExample,
  NestedResponseNarrativeEntity,
  ResponseNarrativeSingleResponseIncidentExample,
  ResponseNarrativeEntity,
} from '../../entities/response-narrative.entity';
import { IncidentConcernService } from '../../helpers/incident-concern/incident-concern.service';
import {
  IncidentConcernEntity,
  IncidentConcernListResponseExample,
  IncidentConcernSingleExample,
  NestedIncidentConcernEntity,
} from '../../entities/incident-concern.entity';
import { CallInformationService } from '../../helpers/call-information/call-information.service';
import { AdditionalInformationService } from '../../helpers/additional-information/additional-information.service';
import {
  CallInformationListResponseIncidentExample,
  NestedCallInformationEntity,
  CallInformationSingleResponseIncidentExample,
  CallInformationEntity,
} from '../../entities/call-information.entity';
import {
  AdditionalInformationListResponseIncidentExample,
  NestedAdditionalInformationEntity,
  AdditionalInformationSingleResponseIncidentExample,
  AdditionalInformationEntity,
} from '../../entities/additional-information.entity';
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

describe('IncidentsService', () => {
  let service: IncidentsService;
  let supportNetworkService: SupportNetworkService;
  let attachmentsService: AttachmentsService;
  let contactsService: ContactsService;
  let safetyAssessmentsService: SafetyAssessmentService;
  let responseNarrativeService: ResponseNarrativeService;
  let incidentConcernService: IncidentConcernService;
  let callInformationService: CallInformationService;
  let additionalInformationService: AdditionalInformationService;
  const { res, mockClear } = getMockRes();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule.forRoot({ load: [configuration] })],
      providers: [
        IncidentsService,
        ContactsService,
        SupportNetworkService,
        AttachmentsService,
        VirusScanService,
        SafetyAssessmentService,
        ResponseNarrativeService,
        CallInformationService,
        AdditionalInformationService,
        IncidentConcernService,
        UtilitiesService,
        TokenRefresherService,
        JwtService,
        RequestPreparerService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            set: () => jest.fn(),
            get: () => 'Bearer token',
          },
        },
      ],
    }).compile();

    service = module.get<IncidentsService>(IncidentsService);
    supportNetworkService = module.get<SupportNetworkService>(
      SupportNetworkService,
    );
    attachmentsService = module.get<AttachmentsService>(AttachmentsService);
    contactsService = module.get<ContactsService>(ContactsService);
    safetyAssessmentsService = module.get<SafetyAssessmentService>(
      SafetyAssessmentService,
    );
    responseNarrativeService = module.get<ResponseNarrativeService>(
      ResponseNarrativeService,
    );
    incidentConcernService = module.get<IncidentConcernService>(
      IncidentConcernService,
    );
    callInformationService = module.get<CallInformationService>(
      CallInformationService,
    );
    additionalInformationService = module.get<AdditionalInformationService>(
      AdditionalInformationService,
    );
    mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getListIncidentSupportNetworkInformationRecord tests', () => {
    it.each([
      [
        SupportNetworkListResponseIncidentExample,
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

        const result =
          await service.getListIncidentSupportNetworkInformationRecord(
            idPathParams,
            res,
            'idir',
            filterQueryParams,
          );
        expect(supportNetworkSpy).toHaveBeenCalledWith(
          RecordType.Incident,
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(result).toEqual(new NestedSupportNetworkEntity(data));
      },
    );
  });

  describe('getSingleIncidentSupportNetworkInformationRecord tests', () => {
    it.each([
      [
        SupportNetworkSingleResponseIncidentExample,
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

        const result =
          await service.getSingleIncidentSupportNetworkInformationRecord(
            idPathParams,
            res,
            'idir',
          );
        expect(supportNetworkSpy).toHaveBeenCalledWith(
          RecordType.Incident,
          idPathParams,
          res,
          'idir',
        );
        expect(result).toEqual(new SupportNetworkEntity(data));
      },
    );
  });

  describe('getSingleIncidentAttachmentRecord tests', () => {
    it.each([
      [
        AttachmentsListResponseIncidentExample,
        { [idName]: 'test' } as IdPathParams,
        {
          [afterParamName]: '2024-12-01',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
        incidentsAttachmentsFieldName,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams, typeFieldName) => {
        const attachmentsSpy = jest
          .spyOn(attachmentsService, 'getSingleAttachmentRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedAttachmentsEntity(data)),
          );

        const result = await service.getSingleIncidentAttachmentRecord(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(attachmentsSpy).toHaveBeenCalledWith(
          RecordType.Incident,
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

  describe('getSingleIncidentAttachmentDetailsRecord tests', () => {
    it.each([
      [
        AttachmentDetailsIncidentExample,
        {
          [idName]: 'test',
          [attachmentIdName]: 'attachmenttest',
        } as AttachmentIdPathParams,
        { [afterParamName]: '2024-12-01' } as AttachmentDetailsQueryParams,
        incidentsAttachmentsFieldName,
      ],
      [
        AttachmentsSingleResponseIncidentExample,
        {
          [idName]: 'test',
          [attachmentIdName]: 'attachmenttest',
        } as AttachmentIdPathParams,
        {
          [afterParamName]: '2024-12-01',
          [inlineAttachmentParamName]: 'false',
        } as AttachmentDetailsQueryParams,
        incidentsAttachmentsFieldName,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams, filterQueryParams, typeFieldName) => {
        const attachmentsSpy = jest
          .spyOn(attachmentsService, 'getSingleAttachmentDetailsRecord')
          .mockReturnValueOnce(
            Promise.resolve(new AttachmentDetailsEntity(data)),
          );

        const result = await service.getSingleIncidentAttachmentDetailsRecord(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(attachmentsSpy).toHaveBeenCalledWith(
          RecordType.Incident,
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

  describe('postSingleIncidentAttachmentRecord tests', () => {
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
        PostAttachmentsIncidentReturnExample,
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

        const result = await service.postSingleIncidentAttachmentRecord(
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

  describe('getListIncidentContactRecord tests', () => {
    it.each([
      [
        ContactsListResponseIncidentExample,
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

        const result = await service.getListIncidentContactRecord(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(contactsSpy).toHaveBeenCalledWith(
          RecordType.Incident,
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(result).toEqual(new NestedContactsEntity(data));
      },
    );
  });

  describe('getSingleIncidentContactRecord tests', () => {
    it.each([
      [
        ContactsSingleResponseIncidentExample,
        { [idName]: 'test', [contactIdName]: 'false' } as ContactIdPathParams,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams) => {
        const contactsSpy = jest
          .spyOn(contactsService, 'getSingleContactRecord')
          .mockReturnValueOnce(Promise.resolve(new ContactsEntity(data)));

        const result = await service.getSingleIncidentContactRecord(
          idPathParams,
          res,
          'idir',
        );
        expect(contactsSpy).toHaveBeenCalledWith(
          RecordType.Incident,
          idPathParams,
          res,
          'idir',
        );
        expect(result).toEqual(new ContactsEntity(data));
      },
    );
  });

  describe('getListIncidentSafetyAssessmentRecord tests', () => {
    it.each([
      [
        SafetyAssessmentListResponseIncidentExample,
        { [idName]: 'test' } as IdPathParams,
        {
          [afterParamName]: '2024-12-01',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams) => {
        const safetyAssessmentSpy = jest
          .spyOn(safetyAssessmentsService, 'getListSafetyAssessmentRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedSafetyAssessmentEntity(data)),
          );

        const result = await service.getListIncidentSafetyAssessmentRecord(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(safetyAssessmentSpy).toHaveBeenCalledWith(
          RecordType.Incident,
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(result).toEqual(new NestedSafetyAssessmentEntity(data));
      },
    );
  });

  describe('getSingleIncidentSafetyAssessmentRecord tests', () => {
    it.each([
      [
        SafetyAssessmentSingleResponseIncidentExample,
        {
          [idName]: 'test',
          [safetyAssessmentIdName]: 'false',
        } as SafetyAssessmentIdPathParams,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams) => {
        const safetyAssessmentSpy = jest
          .spyOn(safetyAssessmentsService, 'getSingleSafetyAssessmentRecord')
          .mockReturnValueOnce(
            Promise.resolve(new SafetyAssessmentEntity(data)),
          );

        const result = await service.getSingleIncidentSafetyAssessmentRecord(
          idPathParams,
          res,
          'idir',
        );
        expect(safetyAssessmentSpy).toHaveBeenCalledWith(
          RecordType.Incident,
          idPathParams,
          res,
          'idir',
        );
        expect(result).toEqual(new SafetyAssessmentEntity(data));
      },
    );
  });

  describe('getListIncidentResponseNarrativeRecord tests', () => {
    it.each([
      [
        ResponseNarrativeListResponseIncidentExample,
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

        const result = await service.getListIncidentResponseNarrativeRecord(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(responseNarrativeSpy).toHaveBeenCalledWith(
          RecordType.Incident,
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(result).toEqual(new NestedResponseNarrativeEntity(data));
      },
    );
  });

  describe('getSingleIncidentResponseNarrativeRecord tests', () => {
    it.each([
      [
        ResponseNarrativeSingleResponseIncidentExample,
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

        const result = await service.getSingleIncidentResponseNarrativeRecord(
          idPathParams,
          res,
          'idir',
        );
        expect(responseNarrativeSpy).toHaveBeenCalledWith(
          RecordType.Incident,
          idPathParams,
          res,
          'idir',
        );
        expect(result).toEqual(new ResponseNarrativeEntity(data));
      },
    );
  });

  describe('getListIncidentConcernRecord tests', () => {
    it.each([
      [
        IncidentConcernListResponseExample,
        { [idName]: 'test' } as IdPathParams,
        {
          [afterParamName]: '2024-12-01',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams) => {
        const incidentConcernSpy = jest
          .spyOn(incidentConcernService, 'getListIncidentConcernRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedIncidentConcernEntity(data)),
          );

        const result = await service.getListIncidentConcernRecord(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(incidentConcernSpy).toHaveBeenCalledWith(
          RecordType.Incident,
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(result).toEqual(new NestedIncidentConcernEntity(data));
      },
    );
  });

  describe('getSingleIncidentConcernRecord tests', () => {
    it.each([
      [
        IncidentConcernSingleExample,
        {
          [idName]: 'test',
          [incidentConcernIdName]: 'test2',
        } as IncidentConcernIdPathParams,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams) => {
        const incidentConcernSpy = jest
          .spyOn(incidentConcernService, 'getSingleIncidentConcernRecord')
          .mockReturnValueOnce(
            Promise.resolve(new IncidentConcernEntity(data)),
          );

        const result = await service.getSingleIncidentConcernRecord(
          idPathParams,
          res,
          'idir',
        );
        expect(incidentConcernSpy).toHaveBeenCalledWith(
          RecordType.Incident,
          idPathParams,
          res,
          'idir',
        );
        expect(result).toEqual(new IncidentConcernEntity(data));
      },
    );
  });

  describe('getListIncidentCallInformationRecord tests', () => {
    it.each([
      [
        CallInformationListResponseIncidentExample,
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

        const result = await service.getListIncidentCallInformationRecord(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(callInformationSpy).toHaveBeenCalledWith(
          RecordType.Incident,
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(result).toEqual(new NestedCallInformationEntity(data));
      },
    );
  });

  describe('getSingleIncidentCallInformationRecord tests', () => {
    it.each([
      [
        CallInformationSingleResponseIncidentExample,
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

        const result = await service.getSingleIncidentCallInformationRecord(
          idPathParams,
          res,
          'idir',
        );
        expect(callInformationSpy).toHaveBeenCalledWith(
          RecordType.Incident,
          idPathParams,
          res,
          'idir',
        );
        expect(result).toEqual(new CallInformationEntity(data));
      },
    );
  });

  describe('getListIncidentAdditionalInformationRecord tests', () => {
    it.each([
      [
        AdditionalInformationListResponseIncidentExample,
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

        const result = await service.getListIncidentAdditionalInformationRecord(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(additionalInformationSpy).toHaveBeenCalledWith(
          RecordType.Incident,
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(result).toEqual(new NestedAdditionalInformationEntity(data));
      },
    );
  });

  describe('getSingleIncidentAdditionalInformationRecord tests', () => {
    it.each([
      [
        AdditionalInformationSingleResponseIncidentExample,
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

        const result =
          await service.getSingleIncidentAdditionalInformationRecord(
            idPathParams,
            res,
            'idir',
          );
        expect(additionalInformationSpy).toHaveBeenCalledWith(
          RecordType.Incident,
          idPathParams,
          res,
          'idir',
        );
        expect(result).toEqual(new AdditionalInformationEntity(data));
      },
    );
  });

  describe('postSingleIncidentSupportNetworkRecord tests', () => {
    it.each([
      [
        {
          Name: 'Test',
        },
        'idir',
        { [idName]: 'test' } as IdPathParams,
        PostSupportNetworkIncidentResponseExample,
      ],
    ])(
      'should return nested values given good input',
      async (body, idir, idPathParams, data) => {
        const SupportNetworksSpy = jest
          .spyOn(supportNetworkService, 'postSingleSupportNetworkRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedSupportNetworkEntity(data)),
          );

        const result = await service.postSingleIncidentSupportNetworkRecord(
          body,
          idir,
          idPathParams,
        );
        expect(SupportNetworksSpy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(new NestedSupportNetworkEntity(data));
      },
    );
  });

  describe('getListIncidentContactLanguagesRecord tests', () => {
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

        const result = await service.getListIncidentContactLanguagesRecord(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(contactsSpy).toHaveBeenCalledWith(
          RecordType.Incident,
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(result).toEqual(new NestedContactLanguagesEntity(data));
      },
    );
  });

  describe('getSingleIncidentContactLanguagesRecord tests', () => {
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

        const result = await service.getSingleIncidentContactLanguagesRecord(
          idPathParams,
          res,
          'idir',
        );
        expect(contactsSpy).toHaveBeenCalledWith(
          RecordType.Incident,
          idPathParams,
          res,
          'idir',
        );
        expect(result).toEqual(new ContactLanguagesEntity(data));
      },
    );
  });

  describe('postSingleIncidentContactLanguagesRecord tests', () => {
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

        const result = await service.postSingleIncidentContactLanguagesRecord(
          body,
          idir,
          idPathParams,
        );
        expect(contactLanguagesSpy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(new NestedContactLanguagesEntity(data));
      },
    );
  });

  describe('getListIncidentContactMedicalBehavioralRecord tests', () => {
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

        const result =
          await service.getListIncidentContactMedicalBehavioralRecord(
            idPathParams,
            res,
            'idir',
            filterQueryParams,
          );
        expect(contactsSpy).toHaveBeenCalledWith(
          RecordType.Incident,
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(result).toEqual(new NestedContactMedicalBehavioralEntity(data));
      },
    );
  });

  describe('getSingleIncidentContactMedicalBehavioralRecord tests', () => {
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
          await service.getSingleIncidentContactMedicalBehavioralRecord(
            idPathParams,
            res,
            'idir',
          );
        expect(contactsSpy).toHaveBeenCalledWith(
          RecordType.Incident,
          idPathParams,
          res,
          'idir',
        );
        expect(result).toEqual(new ContactMedicalBehavioralEntity(data));
      },
    );
  });
});
