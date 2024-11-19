import { Test, TestingModule } from '@nestjs/testing';
import { MemosController } from './memos.controller';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import { TokenRefresherService } from '../../external-api/token-refresher/token-refresher.service';
import { AttachmentsService } from '../../helpers/attachments/attachments.service';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';
import { MemosService } from './memos.service';
import { idName } from '../../common/constants/parameter-constants';
import { IdPathParams } from '../../dto/id-path-params.dto';
import { FilterQueryParams } from '../../dto/filter-query-params.dto';
import {
  AttachmentsSingleResponseMemoExample,
  AttachmentsEntity,
} from '../../entities/attachments.entity';
import { getMockRes } from '@jest-mock/express';

describe('MemosController', () => {
  let controller: MemosController;
  let memosService: MemosService;
  const { res, mockClear } = getMockRes();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        MemosService,
        AttachmentsService,
        TokenRefresherService,
        RequestPreparerService,
        { provide: CACHE_MANAGER, useValue: {} },
        ConfigService,
        UtilitiesService,
        { provide: HttpService, useValue: { get: jest.fn() } },
      ],
      controllers: [MemosController],
    }).compile();

    controller = module.get<MemosController>(MemosController);
    memosService = module.get<MemosService>(MemosService);
    mockClear();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getSingleMemoAttachmentRecord tests', () => {
    it.each([
      [
        AttachmentsSingleResponseMemoExample,
        { [idName]: 'test' } as IdPathParams,
        { since: '2020-02-02', startRowNumParamName: 0 } as FilterQueryParams,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams, filterQueryParams) => {
        const memoServiceSpy = jest
          .spyOn(memosService, 'getSingleMemoAttachmentRecord')
          .mockReturnValueOnce(Promise.resolve(new AttachmentsEntity(data)));

        const result = await controller.getSingleMemoAttachmentRecord(
          idPathParams,
          res,
          filterQueryParams,
        );
        expect(memoServiceSpy).toHaveBeenCalledWith(
          idPathParams,
          res,
          filterQueryParams,
        );
        expect(result).toEqual(new AttachmentsEntity(data));
      },
    );
  });
});
