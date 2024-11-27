import { Test, TestingModule } from '@nestjs/testing';
import { MemosService } from './memos.service';
import { ConfigModule } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import { TokenRefresherService } from '../../external-api/token-refresher/token-refresher.service';
import { AttachmentsService } from '../../helpers/attachments/attachments.service';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';
import {
  AttachmentsListResponseMemoExample,
  NestedAttachmentsEntity,
} from '../../entities/attachments.entity';
import { RecordType } from '../../common/constants/enumerations';
import {
  idName,
  memoAttachmentsFieldName,
  sinceParamName,
} from '../../common/constants/parameter-constants';
import { IdPathParams } from '../../dto/id-path-params.dto';
import { FilterQueryParams } from '../../dto/filter-query-params.dto';
import { getMockRes } from '@jest-mock/express';
import { startRowNumParamName } from '../../common/constants/upstream-constants';
import configuration from '../../configuration/configuration';
import { ContactsService } from '../../helpers/contacts/contacts.service';
import {
  ContactsListResponseMemoExample,
  NestedContactsEntity,
} from '../../entities/contacts.entity';

describe('MemosService', () => {
  let service: MemosService;
  let attachmentsService: AttachmentsService;
  let contactsService: ContactsService;
  const { res, mockClear } = getMockRes();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [configuration] })],
      providers: [
        MemosService,
        ContactsService,
        AttachmentsService,
        UtilitiesService,
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

    service = module.get<MemosService>(MemosService);
    attachmentsService = module.get<AttachmentsService>(AttachmentsService);
    contactsService = module.get<ContactsService>(ContactsService);
    mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSingleMemoAttachmentRecord tests', () => {
    it.each([
      [
        AttachmentsListResponseMemoExample,
        { [idName]: 'test' } as IdPathParams,
        {
          [sinceParamName]: '2024-12-01',
          [startRowNumParamName]: 0,
        } as FilterQueryParams,
        memoAttachmentsFieldName,
      ],
    ])(
      'should return nested values given good input',
      async (data, idPathParams, filterQueryParams, typeFieldName) => {
        const attachmentsSpy = jest
          .spyOn(attachmentsService, 'getSingleAttachmentRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedAttachmentsEntity(data)),
          );

        const result = await service.getSingleMemoAttachmentRecord(
          idPathParams,
          res,
          filterQueryParams,
        );
        expect(attachmentsSpy).toHaveBeenCalledWith(
          RecordType.Memo,
          idPathParams,
          typeFieldName,
          res,
          filterQueryParams,
        );
        expect(result).toEqual(new NestedAttachmentsEntity(data));
      },
    );
  });

  describe('getSingleMemoContactRecord tests', () => {
    it.each([
      [
        ContactsListResponseMemoExample,
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

        const result = await service.getSingleMemoContactRecord(
          idPathParams,
          res,
          filterQueryParams,
        );
        expect(contactsSpy).toHaveBeenCalledWith(
          RecordType.Memo,
          idPathParams,
          res,
          filterQueryParams,
        );
        expect(result).toEqual(new NestedContactsEntity(data));
      },
    );
  });
});
