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
  AttachmentsEntity,
  AttachmentsSingleResponseMemoExample,
} from '../../entities/attachments.entity';
import { RecordType } from '../../common/constants/enumerations';
import {
  idName,
  memoAttachmentsFieldName,
} from '../../common/constants/parameter-constants';
import { IdPathParams } from '../../dto/id-path-params.dto';
import { SinceQueryParams } from '../../dto/since-query-params.dto';
import { getMockRes } from '@jest-mock/express';

describe('MemosService', () => {
  let service: MemosService;
  let attachmentsService: AttachmentsService;
  const { res, mockClear } = getMockRes();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        MemosService,
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
    mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSingleMemoAttachmentRecord tests', () => {
    it.each([
      [
        AttachmentsSingleResponseMemoExample,
        { [idName]: 'test' } as IdPathParams,
        { since: '2024-12-01' } as SinceQueryParams,
        memoAttachmentsFieldName,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams, sinceQueryParams, typeFieldName) => {
        const attachmentsSpy = jest
          .spyOn(attachmentsService, 'getSingleAttachmentRecord')
          .mockReturnValueOnce(Promise.resolve(new AttachmentsEntity(data)));

        const result = await service.getSingleMemoAttachmentRecord(
          idPathParams,
          res,
          sinceQueryParams,
        );
        expect(attachmentsSpy).toHaveBeenCalledWith(
          RecordType.Memo,
          idPathParams,
          typeFieldName,
          res,
          sinceQueryParams,
        );
        expect(result).toEqual(new AttachmentsEntity(data));
      },
    );
  });
});
