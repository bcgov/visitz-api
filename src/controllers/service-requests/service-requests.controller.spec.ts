import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServiceRequestsController } from './service-requests.controller';
import { ServiceRequestsService } from './service-requests.service';
import {
  NestedSupportNetworkEntity,
  PostSupportNetworkSRResponseExample,
  SupportNetworkEntity,
  SupportNetworkListResponseSRExample,
  SupportNetworkSingleResponseSRExample,
} from '../../entities/support-network.entity';
import {
  AdditionalInformationIdPathParams,
  AttachmentIdPathParams,
  CallInformationIdPathParams,
  ContactEducationIdPathParams,
  ContactIdPathParams,
  ContactLanguagesIdPathParams,
  ContactMedicalBehavioralIdPathParams,
  IdPathParams,
  ResponseNarrativeIdPathParams,
  SupportNetworkIdPathParams,
} from '../../dto/id-path-params.dto';
import {
  AttachmentDetailsQueryParams,
  FilterQueryParams,
} from '../../dto/filter-query-params.dto';
import { SupportNetworkService } from '../../helpers/support-network/support-network.service';
import { TokenRefresherService } from '../../external-api/token-refresher/token-refresher.service';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import {
  attachmentIdName,
  contactIdName,
  idName,
  inlineAttachmentParamName,
  afterParamName,
  supportNetworkIdName,
  responseNarrativeIdName,
  additionalInformationIdName,
  callInformationIdName,
  contactLanguageIdName,
  contactMedicalBehavioralIdName,
  contactEducationIdName,
} from '../../common/constants/parameter-constants';
import { AttachmentsService } from '../../helpers/attachments/attachments.service';
import {
  AttachmentDetailsEntity,
  AttachmentDetailsSRExample,
  AttachmentsListResponseSRExample,
  AttachmentsSingleResponseSRExample,
  NestedAttachmentsEntity,
} from '../../entities/attachments.entity';
import { AuthService } from '../../common/guards/auth/auth.service';
import { getMockReq, getMockRes } from '@jest-mock/express';
import {
  idirUsernameHeaderField,
  startRowNumParamName,
} from '../../common/constants/upstream-constants';
import configuration from '../../configuration/configuration';
import { ContactsService } from '../../helpers/contacts/contacts.service';
import {
  ContactsEntity,
  ContactsListResponseSRExample,
  ContactsSingleResponseSRExample,
  NestedContactsEntity,
} from '../../entities/contacts.entity';
import { JwtModule } from '@nestjs/jwt';
import { VirusScanService } from '../../helpers/virus-scan/virus-scan.service';
import { Readable } from 'stream';
import { AttachmentStatusEnum } from '../../common/constants/enumerations';
import { PostAttachmentsSRReturnExample } from '../../dto/post-attachment.dto';
import { ResponseNarrativeService } from '../../helpers/response-narrative/response-narrative.service';
import {
  ResponseNarrativeListResponseSRExample,
  NestedResponseNarrativeEntity,
  ResponseNarrativeSingleResponseSRExample,
  ResponseNarrativeEntity,
} from '../../entities/response-narrative.entity';
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
import { AdditionalInformationService } from '../../helpers/additional-information/additional-information.service';
import { CallInformationService } from '../../helpers/call-information/call-information.service';
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
} from '../../entities/contact-education.entity';

describe('ServiceRequestsController', () => {
  let controller: ServiceRequestsController;
  let serviceRequestsService: ServiceRequestsService;
  const { res, mockClear } = getMockRes();
  const req = getMockReq({ headers: { [idirUsernameHeaderField]: 'idir' } });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ load: [configuration] }),
        JwtModule.register({ global: true }),
      ],
      providers: [
        ServiceRequestsService,
        AuthService,
        ContactsService,
        SupportNetworkService,
        AttachmentsService,
        ResponseNarrativeService,
        CallInformationService,
        AdditionalInformationService,
        VirusScanService,
        TokenRefresherService,
        RequestPreparerService,
        { provide: CACHE_MANAGER, useValue: {} },
        ConfigService,
        UtilitiesService,
        { provide: HttpService, useValue: { get: jest.fn() } },
      ],
      controllers: [ServiceRequestsController],
    }).compile();

    controller = module.get<ServiceRequestsController>(
      ServiceRequestsController,
    );
    serviceRequestsService = module.get<ServiceRequestsService>(
      ServiceRequestsService,
    );
    mockClear();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getListSRSupportNetworkInformationRecord tests', () => {
    it.each([
      [
        SupportNetworkListResponseSRExample,
        { [idName]: 'test' } as IdPathParams,
        {
          [afterParamName]: '2020-02-02',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams) => {
        const SRsServiceSpy = jest
          .spyOn(
            serviceRequestsService,
            'getListSRSupportNetworkInformationRecord',
          )
          .mockReturnValueOnce(
            Promise.resolve(new NestedSupportNetworkEntity(data)),
          );

        const result =
          await controller.getListSRSupportNetworkInformationRecord(
            req,
            idPathParams,
            res,
            filterQueryParams,
          );
        expect(SRsServiceSpy).toHaveBeenCalledWith(
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
        const SRsServiceSpy = jest
          .spyOn(
            serviceRequestsService,
            'getSingleSRSupportNetworkInformationRecord',
          )
          .mockReturnValueOnce(Promise.resolve(new SupportNetworkEntity(data)));

        const result =
          await controller.getSingleSRSupportNetworkInformationRecord(
            req,
            idPathParams,
            res,
          );
        expect(SRsServiceSpy).toHaveBeenCalledWith(idPathParams, res, 'idir');
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
          [afterParamName]: '2020-02-02',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams) => {
        const SRsServiceSpy = jest
          .spyOn(serviceRequestsService, 'getSingleSRAttachmentRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedAttachmentsEntity(data)),
          );

        const result = await controller.getSingleSRAttachmentRecord(
          req,
          idPathParams,
          res,
          filterQueryParams,
        );
        expect(SRsServiceSpy).toHaveBeenCalledWith(
          idPathParams,
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
        {
          [afterParamName]: '2020-02-02',
          [startRowNumParamName]: 0,
        } as AttachmentDetailsQueryParams,
      ],
      [
        AttachmentsSingleResponseSRExample,
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
        const SRsServiceSpy = jest
          .spyOn(serviceRequestsService, 'getSingleSRAttachmentDetailsRecord')
          .mockReturnValueOnce(
            Promise.resolve(new AttachmentDetailsEntity(data)),
          );

        const result = await controller.getSingleSRAttachmentDetailsRecord(
          req,
          idPathParams,
          res,
          filterQueryParams,
        );
        expect(SRsServiceSpy).toHaveBeenCalledWith(
          idPathParams,
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
        { [idName]: 'test' } as IdPathParams,
        'idir',
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
      'should return a single nested given good input',
      async (body, idPathParams, idir, data, file) => {
        const srsServiceSpy = jest
          .spyOn(serviceRequestsService, 'postSingleSRAttachmentRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedAttachmentsEntity(data)),
          );

        const result = await controller.postSingleSRAttachmentRecord(
          getMockReq({ headers: { [idirUsernameHeaderField]: idir } }),
          body,
          idPathParams,
          file,
        );
        expect(srsServiceSpy).toHaveBeenCalledWith(
          body,
          idir,
          idPathParams,
          file,
        );
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
          [afterParamName]: '2020-02-02',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams) => {
        const SRsServiceSpy = jest
          .spyOn(serviceRequestsService, 'getListSRContactRecord')
          .mockReturnValueOnce(Promise.resolve(new NestedContactsEntity(data)));

        const result = await controller.getListSRContactRecord(
          req,
          idPathParams,
          res,
          filterQueryParams,
        );
        expect(SRsServiceSpy).toHaveBeenCalledWith(
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
        {
          [afterParamName]: '2020-02-02',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams) => {
        const SRsServiceSpy = jest
          .spyOn(serviceRequestsService, 'getSingleSRContactRecord')
          .mockReturnValueOnce(Promise.resolve(new ContactsEntity(data)));

        const result = await controller.getSingleSRContactRecord(
          req,
          idPathParams,
          res,
        );
        expect(SRsServiceSpy).toHaveBeenCalledWith(idPathParams, res, 'idir');
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
          [afterParamName]: '2020-02-02',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams) => {
        const SRsServiceSpy = jest
          .spyOn(serviceRequestsService, 'getListSRResponseNarrativeRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedResponseNarrativeEntity(data)),
          );

        const result = await controller.getListSRResponseNarrativeRecord(
          req,
          idPathParams,
          res,
          filterQueryParams,
        );
        expect(SRsServiceSpy).toHaveBeenCalledWith(
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
        {
          [afterParamName]: '2020-02-02',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams) => {
        const SRsServiceSpy = jest
          .spyOn(serviceRequestsService, 'getSingleSRResponseNarrativeRecord')
          .mockReturnValueOnce(
            Promise.resolve(new ResponseNarrativeEntity(data)),
          );

        const result = await controller.getSingleSRResponseNarrativeRecord(
          req,
          idPathParams,
          res,
        );
        expect(SRsServiceSpy).toHaveBeenCalledWith(idPathParams, res, 'idir');
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
          [afterParamName]: '2020-02-02',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams) => {
        const SRsServiceSpy = jest
          .spyOn(serviceRequestsService, 'getListSRCallInformationRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedCallInformationEntity(data)),
          );

        const result = await controller.getListSRCallInformationRecord(
          req,
          idPathParams,
          res,
          filterQueryParams,
        );
        expect(SRsServiceSpy).toHaveBeenCalledWith(
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
        {
          [afterParamName]: '2020-02-02',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams) => {
        const SRsServiceSpy = jest
          .spyOn(serviceRequestsService, 'getSingleSRCallInformationRecord')
          .mockReturnValueOnce(
            Promise.resolve(new CallInformationEntity(data)),
          );

        const result = await controller.getSingleSRCallInformationRecord(
          req,
          idPathParams,
          res,
        );
        expect(SRsServiceSpy).toHaveBeenCalledWith(idPathParams, res, 'idir');
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
          [afterParamName]: '2020-02-02',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams) => {
        const SRsServiceSpy = jest
          .spyOn(serviceRequestsService, 'getListSRAdditionalInformationRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedAdditionalInformationEntity(data)),
          );

        const result = await controller.getListSRAdditionalInformationRecord(
          req,
          idPathParams,
          res,
          filterQueryParams,
        );
        expect(SRsServiceSpy).toHaveBeenCalledWith(
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
        {
          [afterParamName]: '2020-02-02',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams) => {
        const SRsServiceSpy = jest
          .spyOn(
            serviceRequestsService,
            'getSingleSRAdditionalInformationRecord',
          )
          .mockReturnValueOnce(
            Promise.resolve(new AdditionalInformationEntity(data)),
          );

        const result = await controller.getSingleSRAdditionalInformationRecord(
          req,
          idPathParams,
          res,
        );
        expect(SRsServiceSpy).toHaveBeenCalledWith(idPathParams, res, 'idir');
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
        { [idName]: 'test' } as IdPathParams,
        'idir',
        PostSupportNetworkSRResponseExample,
      ],
    ])(
      'should return a single nested given good input',
      async (body, idPathParams, idir, data) => {
        const SRsServiceSpy = jest
          .spyOn(serviceRequestsService, 'postSingleSRSupportNetworkRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedSupportNetworkEntity(data)),
          );

        const result = await controller.postSingleSRSupportNetworkRecord(
          getMockReq({ headers: { [idirUsernameHeaderField]: idir } }),
          body,
          idPathParams,
        );
        expect(SRsServiceSpy).toHaveBeenCalledWith(body, idir, idPathParams);
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
          [afterParamName]: '2020-02-02',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams) => {
        const SRsServiceSpy = jest
          .spyOn(serviceRequestsService, 'getListSRContactLanguagesRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedContactLanguagesEntity(data)),
          );

        const result = await controller.getListSRContactLanguagesRecord(
          req,
          idPathParams,
          res,
          filterQueryParams,
        );
        expect(SRsServiceSpy).toHaveBeenCalledWith(
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
        {
          [afterParamName]: '2020-02-02',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams) => {
        const SRsServiceSpy = jest
          .spyOn(serviceRequestsService, 'getSingleSRContactLanguagesRecord')
          .mockReturnValueOnce(
            Promise.resolve(new ContactLanguagesEntity(data)),
          );

        const result = await controller.getSingleSRContactLanguagesRecord(
          req,
          idPathParams,
          res,
        );
        expect(SRsServiceSpy).toHaveBeenCalledWith(idPathParams, res, 'idir');
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
        { [idName]: 'test', [contactIdName]: 'Id Here' } as ContactIdPathParams,
        'idir',
        PostContactLanguagesResponseExample,
      ],
    ])(
      'should return a single nested given good input',
      async (body, idPathParams, idir, data) => {
        const serviceRequestsServiceSpy = jest
          .spyOn(serviceRequestsService, 'postSingleSRContactLanguagesRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedContactLanguagesEntity(data)),
          );

        const result = await controller.postSingleSRContactLanguagesRecord(
          getMockReq({ headers: { [idirUsernameHeaderField]: idir } }),
          body,
          idPathParams,
        );
        expect(serviceRequestsServiceSpy).toHaveBeenCalledWith(
          body,
          idir,
          idPathParams,
        );
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
          [afterParamName]: '2020-02-02',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams) => {
        const serviceRequestsServiceSpy = jest
          .spyOn(
            serviceRequestsService,
            'getListSRContactMedicalBehavioralRecord',
          )
          .mockReturnValueOnce(
            Promise.resolve(new NestedContactMedicalBehavioralEntity(data)),
          );

        const result = await controller.getListSRContactMedicalBehavioralRecord(
          req,
          idPathParams,
          res,
          filterQueryParams,
        );
        expect(serviceRequestsServiceSpy).toHaveBeenCalledWith(
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
        {
          [afterParamName]: '2020-02-02',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams) => {
        const serviceRequestsServiceSpy = jest
          .spyOn(
            serviceRequestsService,
            'getSingleSRContactMedicalBehavioralRecord',
          )
          .mockReturnValueOnce(
            Promise.resolve(new ContactMedicalBehavioralEntity(data)),
          );

        const result =
          await controller.getSingleSRContactMedicalBehavioralRecord(
            req,
            idPathParams,
            res,
          );
        expect(serviceRequestsServiceSpy).toHaveBeenCalledWith(
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
          [afterParamName]: '2020-02-02',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams) => {
        const serviceRequestsServiceSpy = jest
          .spyOn(serviceRequestsService, 'getListSRContactEducationRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedContactEducationEntity(data)),
          );

        const result = await controller.getListSRContactEducationRecord(
          req,
          idPathParams,
          res,
          filterQueryParams,
        );
        expect(serviceRequestsServiceSpy).toHaveBeenCalledWith(
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
        {
          [afterParamName]: '2020-02-02',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams) => {
        const serviceRequestsServiceSpy = jest
          .spyOn(serviceRequestsService, 'getSingleSRContactEducationRecord')
          .mockReturnValueOnce(
            Promise.resolve(new ContactEducationEntity(data)),
          );

        const result = await controller.getSingleSRContactEducationRecord(
          req,
          idPathParams,
          res,
        );
        expect(serviceRequestsServiceSpy).toHaveBeenCalledWith(
          idPathParams,
          res,
          'idir',
        );
        expect(result).toEqual(new ContactEducationEntity(data));
      },
    );
  });
});
