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
  sinceParamName,
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

describe('IncidentsController', () => {
  let controller: IncidentsController;
  let incidentsService: IncidentsService;
  const { res, mockClear } = getMockRes();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [configuration] })],
      providers: [
        IncidentsService,
        SupportNetworkService,
        ContactsService,
        AttachmentsService,
        AuthService,
        TokenRefresherService,
        RequestPreparerService,
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
          [sinceParamName]: '2020-02-02',
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
            idPathParams,
            res,
            filterQueryParams,
          );
        expect(IncidentsServiceSpy).toHaveBeenCalledWith(
          idPathParams,
          res,
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
            idPathParams,
            res,
          );
        expect(IncidentsServiceSpy).toHaveBeenCalledWith(idPathParams, res);
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
          [sinceParamName]: '2020-02-02',
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
          idPathParams,
          res,
          filterQueryParams,
        );
        expect(incidentServiceSpy).toHaveBeenCalledWith(
          idPathParams,
          res,
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
          [sinceParamName]: '2020-02-02',
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
          [sinceParamName]: '2020-02-02',
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
            idPathParams,
            res,
            filterQueryParams,
          );
        expect(incidentServiceSpy).toHaveBeenCalledWith(
          idPathParams,
          res,
          filterQueryParams,
        );
        expect(result).toEqual(new AttachmentDetailsEntity(data));
      },
    );
  });

  describe('getListIncidentContactRecord tests', () => {
    it.each([
      [
        ContactsListResponseIncidentExample,
        { [idName]: 'test' } as IdPathParams,
        {
          [sinceParamName]: '2020-02-02',
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
          idPathParams,
          res,
          filterQueryParams,
        );
        expect(incidentServiceSpy).toHaveBeenCalledWith(
          idPathParams,
          res,
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
          idPathParams,
          res,
        );
        expect(incidentServiceSpy).toHaveBeenCalledWith(idPathParams, res);
        expect(result).toEqual(new ContactsEntity(data));
      },
    );
  });
});
