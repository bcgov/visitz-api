import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IncidentsController } from './incidents.controller';
import { IncidentsService } from './incidents.service';
import {
  NestedSupportNetworkEntity,
  SupportNetworkEntity,
  SupportNetworkListResponseIncidentExample,
  SupportNetworkSingleResponseIncidentExample,
} from '../../entities/support-network.entity';
import {
  AttachmentDetailsQueryParams,
  FilterQueryParams,
} from '../../dto/filter-query-params.dto';
import {
  AttachmentIdPathParams,
  ContactIdPathParams,
  IdPathParams,
  SafetyAssessmentIdPathParams,
  SupportNetworkIdPathParams,
} from '../../dto/id-path-params.dto';
import { AuthService } from '../../common/guards/auth/auth.service';
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
  safetyAssessmentIdName,
  supportNetworkIdName,
} from '../../common/constants/parameter-constants';
import { AttachmentsService } from '../../helpers/attachments/attachments.service';
import {
  AttachmentDetailsEntity,
  AttachmentDetailsIncidentExample,
  AttachmentsListResponseIncidentExample,
  AttachmentsSingleResponseIncidentExample,
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
  ContactsListResponseIncidentExample,
  ContactsSingleResponseIncidentExample,
  NestedContactsEntity,
} from '../../entities/contacts.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { SafetyAssessmentService } from '../../helpers/safety-assessment/safety-assessment.service';
import {
  NestedSafetyAssessmentEntity,
  SafetyAssessmentEntity,
  SafetyAssessmentListResponseIncidentExample,
  SafetyAssessmentSingleResponseIncidentExample,
} from '../../entities/safety-assessment.entity';
import { VirusScanService } from '../../helpers/virus-scan/virus-scan.service';
import { Readable } from 'stream';
import { AttachmentStatusEnum } from '../../common/constants/enumerations';
import { PostAttachmentsIncidentReturnExample } from '../../dto/post-attachment.dto';

describe('IncidentsController', () => {
  let controller: IncidentsController;
  let incidentsService: IncidentsService;
  const { res, mockClear } = getMockRes();
  const req = getMockReq({ headers: { [idirUsernameHeaderField]: 'idir' } });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ load: [configuration] }),
        JwtModule.register({ global: true }),
      ],
      providers: [
        IncidentsService,
        SupportNetworkService,
        ContactsService,
        AttachmentsService,
        VirusScanService,
        SafetyAssessmentService,
        AuthService,
        TokenRefresherService,
        RequestPreparerService,
        JwtService,
        { provide: CACHE_MANAGER, useValue: {} },
        ConfigService,
        UtilitiesService,
        { provide: HttpService, useValue: { get: jest.fn() } },
      ],
      controllers: [IncidentsController],
    }).compile();

    controller = module.get<IncidentsController>(IncidentsController);
    incidentsService = module.get<IncidentsService>(IncidentsService);
    mockClear();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getListIncidentSupportNetworkInformationRecord tests', () => {
    it.each([
      [
        SupportNetworkListResponseIncidentExample,
        { [idName]: 'test' } as IdPathParams,
        {
          [afterParamName]: '2020-02-02',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams) => {
        const IncidentsServiceSpy = jest
          .spyOn(
            incidentsService,
            'getListIncidentSupportNetworkInformationRecord',
          )
          .mockReturnValueOnce(
            Promise.resolve(new NestedSupportNetworkEntity(data)),
          );

        const result =
          await controller.getListIncidentSupportNetworkInformationRecord(
            req,
            idPathParams,
            res,
            filterQueryParams,
          );
        expect(IncidentsServiceSpy).toHaveBeenCalledWith(
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
        const IncidentsServiceSpy = jest
          .spyOn(
            incidentsService,
            'getSingleIncidentSupportNetworkInformationRecord',
          )
          .mockReturnValueOnce(Promise.resolve(new SupportNetworkEntity(data)));

        const result =
          await controller.getSingleIncidentSupportNetworkInformationRecord(
            req,
            idPathParams,
            res,
          );
        expect(IncidentsServiceSpy).toHaveBeenCalledWith(
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
          [afterParamName]: '2020-02-02',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams) => {
        const incidentServiceSpy = jest
          .spyOn(incidentsService, 'getSingleIncidentAttachmentRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedAttachmentsEntity(data)),
          );

        const result = await controller.getSingleIncidentAttachmentRecord(
          req,
          idPathParams,
          res,
          filterQueryParams,
        );
        expect(incidentServiceSpy).toHaveBeenCalledWith(
          idPathParams,
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
        {
          [afterParamName]: '2020-02-02',
          [startRowNumParamName]: 0,
        } as AttachmentDetailsQueryParams,
      ],
      [
        AttachmentsSingleResponseIncidentExample,
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
        const incidentServiceSpy = jest
          .spyOn(incidentsService, 'getSingleIncidentAttachmentDetailsRecord')
          .mockReturnValueOnce(
            Promise.resolve(new AttachmentDetailsEntity(data)),
          );

        const result =
          await controller.getSingleIncidentAttachmentDetailsRecord(
            req,
            idPathParams,
            res,
            filterQueryParams,
          );
        expect(incidentServiceSpy).toHaveBeenCalledWith(
          idPathParams,
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
        { [idName]: 'test' } as IdPathParams,
        'idir',
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
      'should return a single nested given good input',
      async (body, idPathParams, idir, data, file) => {
        const incidentsServiceSpy = jest
          .spyOn(incidentsService, 'postSingleIncidentAttachmentRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedAttachmentsEntity(data)),
          );

        const result = await controller.postSingleIncidentAttachmentRecord(
          getMockReq({ headers: { [idirUsernameHeaderField]: idir } }),
          body,
          idPathParams,
          file,
        );
        expect(incidentsServiceSpy).toHaveBeenCalledWith(
          body,
          idir,
          idPathParams,
          file,
        );
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
          [afterParamName]: '2020-02-02',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams) => {
        const incidentServiceSpy = jest
          .spyOn(incidentsService, 'getListIncidentContactRecord')
          .mockReturnValueOnce(Promise.resolve(new NestedContactsEntity(data)));

        const result = await controller.getListIncidentContactRecord(
          req,
          idPathParams,
          res,
          filterQueryParams,
        );
        expect(incidentServiceSpy).toHaveBeenCalledWith(
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
        { [idName]: 'test', [contactIdName]: 'test2' } as ContactIdPathParams,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams) => {
        const incidentServiceSpy = jest
          .spyOn(incidentsService, 'getSingleIncidentContactRecord')
          .mockReturnValueOnce(Promise.resolve(new ContactsEntity(data)));

        const result = await controller.getSingleIncidentContactRecord(
          req,
          idPathParams,
          res,
        );
        expect(incidentServiceSpy).toHaveBeenCalledWith(
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
          [afterParamName]: '2020-02-02',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams) => {
        const incidentServiceSpy = jest
          .spyOn(incidentsService, 'getListIncidentSafetyAssessmentRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedSafetyAssessmentEntity(data)),
          );

        const result = await controller.getListIncidentSafetyAssessmentRecord(
          req,
          idPathParams,
          res,
          filterQueryParams,
        );
        expect(incidentServiceSpy).toHaveBeenCalledWith(
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
          [safetyAssessmentIdName]: 'test2',
        } as SafetyAssessmentIdPathParams,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams) => {
        const incidentServiceSpy = jest
          .spyOn(incidentsService, 'getSingleIncidentSafetyAssessmentRecord')
          .mockReturnValueOnce(
            Promise.resolve(new SafetyAssessmentEntity(data)),
          );

        const result = await controller.getSingleIncidentSafetyAssessmentRecord(
          req,
          idPathParams,
          res,
        );
        expect(incidentServiceSpy).toHaveBeenCalledWith(
          idPathParams,
          res,
          'idir',
        );
        expect(result).toEqual(new SafetyAssessmentEntity(data));
      },
    );
  });
});
