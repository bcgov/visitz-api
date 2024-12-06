import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { IncidentsService } from './incidents.service';
import { SupportNetworkService } from '../../helpers/support-network/support-network.service';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';
import {
  NestedSupportNetworkEntity,
  SupportNetworkListResponseIncidentExample,
} from '../../entities/support-network.entity';
import { FilterQueryParams } from '../../dto/filter-query-params.dto';
import {
  AttachmentIdPathParams,
  IdPathParams,
} from '../../dto/id-path-params.dto';
import { RecordType } from '../../common/constants/enumerations';
import { TokenRefresherService } from '../../external-api/token-refresher/token-refresher.service';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import {
  attachmentIdName,
  idName,
  incidentsAttachmentsFieldName,
  sinceParamName,
} from '../../common/constants/parameter-constants';
import { AttachmentsService } from '../../helpers/attachments/attachments.service';
import {
  AttachmentDetailsEntity,
  AttachmentDetailsIncidentExample,
  AttachmentsListResponseIncidentExample,
  NestedAttachmentsEntity,
} from '../../entities/attachments.entity';
import { getMockRes } from '@jest-mock/express';
import { startRowNumParamName } from '../../common/constants/upstream-constants';
import configuration from '../../configuration/configuration';
import { ContactsService } from '../../helpers/contacts/contacts.service';
import {
  ContactsListResponseIncidentExample,
  NestedContactsEntity,
} from '../../entities/contacts.entity';

describe('IncidentsService', () => {
  let service: IncidentsService;
  let supportNetworkService: SupportNetworkService;
  let attachmentsService: AttachmentsService;
  let contactsService: ContactsService;
  const { res, mockClear } = getMockRes();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule.forRoot({ load: [configuration] })],
      providers: [
        IncidentsService,
        ContactsService,
        SupportNetworkService,
        AttachmentsService,
        UtilitiesService,
        TokenRefresherService,
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
    mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSingleIncidentSupportNetworkInformationRecord tests', () => {
    it.each([
      [
        SupportNetworkListResponseIncidentExample,
        { [idName]: 'test' } as IdPathParams,
        {
          [sinceParamName]: '2024-12-01',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams) => {
        const supportNetworkSpy = jest
          .spyOn(
            supportNetworkService,
            'getSingleSupportNetworkInformationRecord',
          )
          .mockReturnValueOnce(
            Promise.resolve(new NestedSupportNetworkEntity(data)),
          );

        const result =
          await service.getSingleIncidentSupportNetworkInformationRecord(
            idPathParams,
            res,
            filterQueryParams,
          );
        expect(supportNetworkSpy).toHaveBeenCalledWith(
          RecordType.Incident,
          idPathParams,
          res,
          filterQueryParams,
        );
        expect(result).toEqual(new NestedSupportNetworkEntity(data));
      },
    );
  });

  describe('getSingleIncidentAttachmentRecord tests', () => {
    it.each([
      [
        AttachmentsListResponseIncidentExample,
        { [idName]: 'test' } as IdPathParams,
        {
          [sinceParamName]: '2024-12-01',
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
          filterQueryParams,
        );
        expect(attachmentsSpy).toHaveBeenCalledWith(
          RecordType.Incident,
          idPathParams,
          typeFieldName,
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
        { [sinceParamName]: '2024-12-01' } as FilterQueryParams,
        incidentsAttachmentsFieldName,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams, typeFieldName) => {
        const attachmentsSpy = jest
          .spyOn(attachmentsService, 'getSingleAttachmentDetailsRecord')
          .mockReturnValueOnce(
            Promise.resolve(new AttachmentDetailsEntity(data)),
          );

        const result = await service.getSingleIncidentAttachmentDetailsRecord(
          idPathParams,
          res,
          filterQueryParams,
        );
        expect(attachmentsSpy).toHaveBeenCalledWith(
          RecordType.Incident,
          idPathParams,
          typeFieldName,
          res,
          filterQueryParams,
        );
        expect(result).toEqual(new AttachmentDetailsEntity(data));
      },
    );
  });

  describe('getSingleIncidentContactRecord tests', () => {
    it.each([
      [
        ContactsListResponseIncidentExample,
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
          .spyOn(contactsService, 'getSingleContactRecord')
          .mockReturnValueOnce(Promise.resolve(new NestedContactsEntity(data)));

        const result = await service.getSingleIncidentContactRecord(
          idPathParams,
          res,
          filterQueryParams,
        );
        expect(contactsSpy).toHaveBeenCalledWith(
          RecordType.Incident,
          idPathParams,
          res,
          filterQueryParams,
        );
        expect(result).toEqual(new NestedContactsEntity(data));
      },
    );
  });
});
