import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule, HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { ServiceRequestsService } from './service-requests.service';
import { SupportNetworkService } from '../../helpers/support-network/support-network.service';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';
import {
  NestedSupportNetworkEntity,
  SupportNetworkEntity,
  SupportNetworkListResponseSRExample,
  SupportNetworkSingleResponseSRExample,
} from '../../entities/support-network.entity';
import { RecordType } from '../../common/constants/enumerations';
import {
  AttachmentIdPathParams,
  ContactIdPathParams,
  IdPathParams,
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

describe('ServiceRequestsService', () => {
  let service: ServiceRequestsService;
  let supportNetworkService: SupportNetworkService;
  let attachmentsService: AttachmentsService;
  let contactsService: ContactsService;
  const { res, mockClear } = getMockRes();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule.forRoot({ load: [configuration] })],
      providers: [
        ServiceRequestsService,
        SupportNetworkService,
        ContactsService,
        AttachmentsService,
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
});
