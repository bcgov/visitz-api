import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServiceRequestsController } from './service-requests.controller';
import { ServiceRequestsService } from './service-requests.service';
import {
  NestedSupportNetworkEntity,
  SupportNetworkEntity,
  SupportNetworkListResponseSRExample,
  SupportNetworkSingleResponseSRExample,
} from '../../entities/support-network.entity';
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
import { SupportNetworkService } from '../../helpers/support-network/support-network.service';
import { TokenRefresherService } from '../../external-api/token-refresher/token-refresher.service';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import {
  attachmentIdName,
  contactIdName,
  idName,
  inlineAttachmentParamName,
  sinceParamName,
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

describe('ServiceRequestsController', () => {
  let controller: ServiceRequestsController;
  let serviceRequestsService: ServiceRequestsService;
  const { res, mockClear } = getMockRes();
  const req = getMockReq({ headers: { [idirUsernameHeaderField]: 'idir' } });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [configuration] })],
      providers: [
        ServiceRequestsService,
        AuthService,
        ContactsService,
        SupportNetworkService,
        AttachmentsService,
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
          [sinceParamName]: '2020-02-02',
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
          [sinceParamName]: '2020-02-02',
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
          [sinceParamName]: '2020-02-02',
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
          [sinceParamName]: '2020-02-02',
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

  describe('getListSRContactRecord tests', () => {
    it.each([
      [
        ContactsListResponseSRExample,
        { [idName]: 'test' } as IdPathParams,
        {
          [sinceParamName]: '2020-02-02',
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
          [sinceParamName]: '2020-02-02',
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
});
