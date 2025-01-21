import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { CasesService } from './cases.service';
import { SupportNetworkService } from '../../helpers/support-network/support-network.service';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';
import {
  NestedSupportNetworkEntity,
  SupportNetworkEntity,
  SupportNetworkListResponseCaseExample,
  SupportNetworkSingleResponseCaseExample,
} from '../../entities/support-network.entity';
import {
  AttachmentIdPathParams,
  ContactIdPathParams,
  IdPathParams,
  SupportNetworkIdPathParams,
  VisitIdPathParams,
} from '../../dto/id-path-params.dto';
import {
  AttachmentDetailsQueryParams,
  FilterQueryParams,
} from '../../dto/filter-query-params.dto';
import { RecordType, VisitDetails } from '../../common/constants/enumerations';
import { TokenRefresherService } from '../../external-api/token-refresher/token-refresher.service';
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
  casesAttachmentsFieldName,
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
import { getMockRes } from '@jest-mock/express';
import { startRowNumParamName } from '../../common/constants/upstream-constants';
import configuration from '../../configuration/configuration';
import { ContactsService } from '../../helpers/contacts/contacts.service';
import {
  ContactsEntity,
  ContactsListResponseCaseExample,
  ContactsSingleResponseCaseExample,
  NestedContactsEntity,
} from '../../entities/contacts.entity';
import { JwtService } from '@nestjs/jwt';

describe('CasesService', () => {
  let service: CasesService;
  let supportNetworkService: SupportNetworkService;
  let inPersonVisitsService: InPersonVisitsService;
  let attachmentsService: AttachmentsService;
  let contactsService: ContactsService;
  const { res, mockClear } = getMockRes();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule.forRoot({ load: [configuration] })],
      providers: [
        CasesService,
        ContactsService,
        SupportNetworkService,
        AttachmentsService,
        UtilitiesService,
        JwtService,
        TokenRefresherService,
        InPersonVisitsService,
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

    service = module.get<CasesService>(CasesService);
    supportNetworkService = module.get<SupportNetworkService>(
      SupportNetworkService,
    );
    inPersonVisitsService = module.get<InPersonVisitsService>(
      InPersonVisitsService,
    );
    attachmentsService = module.get<AttachmentsService>(AttachmentsService);
    contactsService = module.get<ContactsService>(ContactsService);
    mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getListCaseSupportNetworkInformationRecord tests', () => {
    it.each([
      [
        SupportNetworkListResponseCaseExample,
        { [idName]: 'test' } as IdPathParams,
        { [sinceParamName]: '2024-12-01' } as FilterQueryParams,
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

        const result = await service.getListCaseSupportNetworkInformationRecord(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(supportNetworkSpy).toHaveBeenCalledWith(
          RecordType.Case,
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
        const supportNetworkSpy = jest
          .spyOn(
            supportNetworkService,
            'getSingleSupportNetworkInformationRecord',
          )
          .mockReturnValueOnce(Promise.resolve(new SupportNetworkEntity(data)));

        const result =
          await service.getSingleCaseSupportNetworkInformationRecord(
            idPathParams,
            res,
            'idir',
          );
        expect(supportNetworkSpy).toHaveBeenCalledWith(
          RecordType.Case,
          idPathParams,
          res,
          'idir',
        );
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
          [sinceParamName]: '2024-12-01',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams) => {
        const InPersonVisitsSpy = jest
          .spyOn(inPersonVisitsService, 'getListInPersonVisitRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedInPersonVisitsEntity(data)),
          );

        const result = await service.getListCaseInPersonVisitRecord(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(InPersonVisitsSpy).toHaveBeenCalledWith(
          RecordType.Case,
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
        const InPersonVisitsSpy = jest
          .spyOn(inPersonVisitsService, 'getSingleInPersonVisitRecord')
          .mockReturnValueOnce(Promise.resolve(new InPersonVisitsEntity(data)));

        const result = await service.getSingleCaseInPersonVisitRecord(
          idPathParams,
          res,
          'idir',
        );
        expect(InPersonVisitsSpy).toHaveBeenCalledWith(
          RecordType.Case,
          idPathParams,
          res,
          'idir',
        );
        expect(result).toEqual(new InPersonVisitsEntity(data));
      },
    );
  });

  describe('postSingleCaseInPersonVisitRecord tests', () => {
    it.each([
      [
        {
          'Date of visit': '11/08/2024 08:24:11',
          'Visit Details Value': VisitDetails.NotPrivateInHome,
          'Visit Description': 'comment',
        },
        'idir',
        { [idName]: 'test' } as IdPathParams,
        PostInPersonVisitResponseExample,
      ],
    ])(
      'should return nested values given good input',
      async (body, idir, idPathParams, data) => {
        const InPersonVisitsSpy = jest
          .spyOn(inPersonVisitsService, 'postSingleInPersonVisitRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedInPersonVisitsEntity(data)),
          );

        const result = await service.postSingleCaseInPersonVisitRecord(
          body,
          idir,
          idPathParams,
        );
        expect(InPersonVisitsSpy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(new NestedInPersonVisitsEntity(data));
      },
    );
  });

  describe('getSingleCaseAttachmentRecord tests', () => {
    it.each([
      [
        AttachmentsListResponseCaseExample,
        { [idName]: 'test' } as IdPathParams,
        { [sinceParamName]: '2024-12-01' } as FilterQueryParams,
        casesAttachmentsFieldName,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams, typeFieldName) => {
        const attachmentsSpy = jest
          .spyOn(attachmentsService, 'getSingleAttachmentRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedAttachmentsEntity(data)),
          );

        const result = await service.getSingleCaseAttachmentRecord(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(attachmentsSpy).toHaveBeenCalledWith(
          RecordType.Case,
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

  describe('getSingleCaseAttachmentDetailsRecord tests', () => {
    it.each([
      [
        AttachmentDetailsCaseExample,
        {
          [idName]: 'test',
          [attachmentIdName]: 'attachmenttest',
        } as AttachmentIdPathParams,
        { [sinceParamName]: '2024-12-01' } as AttachmentDetailsQueryParams,
        casesAttachmentsFieldName,
      ],
      [
        AttachmentsSingleResponseCaseExample,
        {
          [idName]: 'test',
          [attachmentIdName]: 'attachmenttest',
        } as AttachmentIdPathParams,
        {
          [sinceParamName]: '2024-12-01',
          [inlineAttachmentParamName]: 'false',
        } as AttachmentDetailsQueryParams,
        casesAttachmentsFieldName,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams, filterQueryParams, typeFieldName) => {
        const attachmentsSpy = jest
          .spyOn(attachmentsService, 'getSingleAttachmentDetailsRecord')
          .mockReturnValueOnce(
            Promise.resolve(new AttachmentDetailsEntity(data)),
          );

        const result = await service.getSingleCaseAttachmentDetailsRecord(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(attachmentsSpy).toHaveBeenCalledWith(
          RecordType.Case,
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

  describe('getListCaseContactRecord tests', () => {
    it.each([
      [
        ContactsListResponseCaseExample,
        { [idName]: 'test' } as IdPathParams,
        {
          [sinceParamName]: '2024-12-01',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams) => {
        const contactsSpy = jest
          .spyOn(contactsService, 'getListContactRecord')
          .mockReturnValueOnce(Promise.resolve(new NestedContactsEntity(data)));

        const result = await service.getListCaseContactRecord(
          idPathParams,
          res,
          'idir',
          filterQueryParams,
        );
        expect(contactsSpy).toHaveBeenCalledWith(
          RecordType.Case,
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
        ContactsSingleResponseCaseExample,
        { [idName]: 'test', [contactIdName]: 'test2' } as ContactIdPathParams,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams) => {
        const contactsSpy = jest
          .spyOn(contactsService, 'getSingleContactRecord')
          .mockReturnValueOnce(Promise.resolve(new ContactsEntity(data)));

        const result = await service.getSingleCaseContactRecord(
          idPathParams,
          res,
          'idir',
        );
        expect(contactsSpy).toHaveBeenCalledWith(
          RecordType.Case,
          idPathParams,
          res,
          'idir',
        );
        expect(result).toEqual(new ContactsEntity(data));
      },
    );
  });
});
