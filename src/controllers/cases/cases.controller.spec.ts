import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CasesController } from './cases.controller';
import { CasesService } from './cases.service';
import {
  NestedSupportNetworkEntity,
  SupportNetworkEntity,
  SupportNetworkListResponseCaseExample,
  SupportNetworkSingleResponseCaseExample,
} from '../../entities/support-network.entity';
import {
  AttachmentDetailsQueryParams,
  FilterQueryParams,
} from '../../dto/filter-query-params.dto';
import {
  AttachmentIdPathParams,
  ContactIdPathParams,
  IdPathParams,
  SupportNetworkIdPathParams,
  VisitIdPathParams,
} from '../../dto/id-path-params.dto';
import { AuthService } from '../../common/guards/auth/auth.service';
import { TokenRefresherService } from '../../external-api/token-refresher/token-refresher.service';
import { SupportNetworkService } from '../../helpers/support-network/support-network.service';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';
import { InPersonVisitsService } from '../../helpers/in-person-visits/in-person-visits.service';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import {
  InPersonVisitsEntity,
  InPersonVisitsListResponseCaseExample,
  InPersonVisitsSingleResponseCaseExample,
  NestedInPersonVisitsEntity,
  PostInPersonVisitResponseExample,
} from '../../entities/in-person-visits.entity';
import {
  attachmentIdName,
  contactIdName,
  idName,
  inlineAttachmentParamName,
  sinceParamName,
  supportNetworkIdName,
  visitIdName,
} from '../../common/constants/parameter-constants';
import { AttachmentsService } from '../../helpers/attachments/attachments.service';
import {
  AttachmentDetailsCaseExample,
  AttachmentDetailsEntity,
  AttachmentsListResponseCaseExample,
  AttachmentsSingleResponseCaseExample,
  NestedAttachmentsEntity,
} from '../../entities/attachments.entity';
import { VisitDetails } from '../../common/constants/enumerations';
import { getMockReq, getMockRes } from '@jest-mock/express';
import {
  idirUsernameHeaderField,
  startRowNumParamName,
} from '../../common/constants/upstream-constants';
import configuration from '../../configuration/configuration';
import { ContactsService } from '../../helpers/contacts/contacts.service';
import {
  ContactsEntity,
  ContactsListResponseCaseExample,
  NestedContactsEntity,
} from '../../entities/contacts.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';

describe('CasesController', () => {
  let controller: CasesController;
  let casesService: CasesService;
  const { res, mockClear } = getMockRes();
  const req = getMockReq({ headers: { [idirUsernameHeaderField]: 'idir' } });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ load: [configuration] }),
        JwtModule.register({ global: true }),
      ],
      providers: [
        CasesService,
        AuthService,
        ContactsService,
        SupportNetworkService,
        AttachmentsService,
        TokenRefresherService,
        InPersonVisitsService,
        RequestPreparerService,
        JwtService,
        { provide: CACHE_MANAGER, useValue: {} },
        ConfigService,
        UtilitiesService,
        { provide: HttpService, useValue: { get: jest.fn(), post: jest.fn() } },
      ],
      controllers: [CasesController],
    }).compile();

    controller = module.get<CasesController>(CasesController);
    casesService = module.get<CasesService>(CasesService);
    mockClear();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getListCaseSupportNetworkInformationRecord tests', () => {
    it.each([
      [
        SupportNetworkListResponseCaseExample,
        { [idName]: 'test' } as IdPathParams,
        {
          [sinceParamName]: '2020-02-02',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams) => {
        const casesServiceSpy = jest
          .spyOn(casesService, 'getListCaseSupportNetworkInformationRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedSupportNetworkEntity(data)),
          );

        const result =
          await controller.getListCaseSupportNetworkInformationRecord(
            req,
            idPathParams,
            res,
            filterQueryParams,
          );
        expect(casesServiceSpy).toHaveBeenCalledWith(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(result).toEqual(new NestedSupportNetworkEntity(data));
      },
    );
  });

  describe('getSingleCaseSupportNetworkInformationRecord tests', () => {
    it.each([
      [
        SupportNetworkSingleResponseCaseExample,
        {
          [idName]: 'test',
          [supportNetworkIdName]: 'test2',
        } as SupportNetworkIdPathParams,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams) => {
        const casesServiceSpy = jest
          .spyOn(casesService, 'getSingleCaseSupportNetworkInformationRecord')
          .mockReturnValueOnce(Promise.resolve(new SupportNetworkEntity(data)));

        const result =
          await controller.getSingleCaseSupportNetworkInformationRecord(
            req,
            idPathParams,
            res,
          );
        expect(casesServiceSpy).toHaveBeenCalledWith(idPathParams, res, 'idir');
        expect(result).toEqual(new SupportNetworkEntity(data));
      },
    );
  });

  describe('getListCaseInPersonVisitRecord tests', () => {
    it.each([
      [
        InPersonVisitsListResponseCaseExample,
        { [idName]: 'test' } as IdPathParams,
        {
          [sinceParamName]: '2020-02-02',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams) => {
        const casesServiceSpy = jest
          .spyOn(casesService, 'getListCaseInPersonVisitRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedInPersonVisitsEntity(data)),
          );

        const result = await controller.getListCaseInPersonVisitRecord(
          req,
          idPathParams,
          res,
          filterQueryParams,
        );
        expect(casesServiceSpy).toHaveBeenCalledWith(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(result).toEqual(new NestedInPersonVisitsEntity(data));
      },
    );
  });

  describe('getSingleCaseInPersonVisitRecord tests', () => {
    it.each([
      [
        InPersonVisitsSingleResponseCaseExample,
        { [idName]: 'test', [visitIdName]: 'test2' } as VisitIdPathParams,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams) => {
        const casesServiceSpy = jest
          .spyOn(casesService, 'getSingleCaseInPersonVisitRecord')
          .mockReturnValueOnce(Promise.resolve(new InPersonVisitsEntity(data)));

        const result = await controller.getSingleCaseInPersonVisitRecord(
          req,
          idPathParams,
          res,
        );
        expect(casesServiceSpy).toHaveBeenCalledWith(idPathParams, res, 'idir');
        expect(result).toEqual(new InPersonVisitsEntity(data));
      },
    );
  });

  describe('postSingleCaseInPersonVisitRecord tests', () => {
    it.each([
      [
        {
          'Date of visit': '2024-11-13T21:24:03',
          'Visit Details Value': VisitDetails.NotPrivateInHome,
          'Visit Description': 'comment',
        },
        { [idName]: 'test' } as IdPathParams,
        'idir',
        PostInPersonVisitResponseExample,
      ],
    ])(
      'should return a single nested given good input',
      async (body, idPathParams, idir, data) => {
        const casesServiceSpy = jest
          .spyOn(casesService, 'postSingleCaseInPersonVisitRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedInPersonVisitsEntity(data)),
          );

        const result = await controller.postSingleCaseInPersonVisitRecord(
          getMockReq({ headers: { [idirUsernameHeaderField]: idir } }),
          body,
          idPathParams,
        );
        expect(casesServiceSpy).toHaveBeenCalledWith(body, idir, idPathParams);
        expect(result).toEqual(new NestedInPersonVisitsEntity(data));
      },
    );
  });

  describe('getSingleCaseAttachmentRecord tests', () => {
    it.each([
      [
        AttachmentsListResponseCaseExample,
        { [idName]: 'test' } as IdPathParams,
        {
          [sinceParamName]: '2020-02-02',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams) => {
        const caseServiceSpy = jest
          .spyOn(casesService, 'getSingleCaseAttachmentRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedAttachmentsEntity(data)),
          );

        const result = await controller.getSingleCaseAttachmentRecord(
          req,
          idPathParams,
          res,
          filterQueryParams,
        );
        expect(caseServiceSpy).toHaveBeenCalledWith(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(result).toEqual(new NestedAttachmentsEntity(data));
      },
    );
  });

  describe('getSingleCaseAttachmentDetailsRecord tests', () => {
    it.each([
      [
        AttachmentDetailsCaseExample,
        {
          [idName]: 'test',
          [attachmentIdName]: 'attachmenttest',
        } as AttachmentIdPathParams,
        {
          [sinceParamName]: '2020-02-02',
          [startRowNumParamName]: 0,
        } as AttachmentDetailsQueryParams,
      ],
      [
        AttachmentsSingleResponseCaseExample,
        {
          [idName]: 'test',
          [attachmentIdName]: 'attachmenttest',
        } as AttachmentIdPathParams,
        {
          [sinceParamName]: '2020-02-02',
          [startRowNumParamName]: 0,
          [inlineAttachmentParamName]: 'false',
        } as AttachmentDetailsQueryParams,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams, filterQueryParams) => {
        const caseServiceSpy = jest
          .spyOn(casesService, 'getSingleCaseAttachmentDetailsRecord')
          .mockReturnValueOnce(
            Promise.resolve(new AttachmentDetailsEntity(data)),
          );

        const result = await controller.getSingleCaseAttachmentDetailsRecord(
          req,
          idPathParams,
          res,
          filterQueryParams,
        );
        expect(caseServiceSpy).toHaveBeenCalledWith(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(result).toEqual(new AttachmentDetailsEntity(data));
      },
    );
  });

  describe('getListCaseContactRecord tests', () => {
    it.each([
      [
        ContactsListResponseCaseExample,
        { [idName]: 'test' } as IdPathParams,
        {
          [sinceParamName]: '2020-02-02',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams) => {
        const caseServiceSpy = jest
          .spyOn(casesService, 'getListCaseContactRecord')
          .mockReturnValueOnce(Promise.resolve(new NestedContactsEntity(data)));

        const result = await controller.getListCaseContactRecord(
          req,
          idPathParams,
          res,
          filterQueryParams,
        );
        expect(caseServiceSpy).toHaveBeenCalledWith(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(result).toEqual(new NestedContactsEntity(data));
      },
    );
  });

  describe('getSingleCaseContactRecord tests', () => {
    it.each([
      [
        ContactsListResponseCaseExample,
        { [idName]: 'test', [contactIdName]: 'test2' } as ContactIdPathParams,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams) => {
        const caseServiceSpy = jest
          .spyOn(casesService, 'getSingleCaseContactRecord')
          .mockReturnValueOnce(Promise.resolve(new ContactsEntity(data)));

        const result = await controller.getSingleCaseContactRecord(
          req,
          idPathParams,
          res,
        );
        expect(caseServiceSpy).toHaveBeenCalledWith(idPathParams, res, 'idir');
        expect(result).toEqual(new ContactsEntity(data));
      },
    );
  });
});
