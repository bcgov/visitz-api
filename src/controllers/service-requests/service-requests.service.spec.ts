import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule, HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { ServiceRequestsService } from './service-requests.service';
import { SupportNetworkService } from '../../helpers/support-network/support-network.service';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';
import {
  SupportNetworkEntity,
  SupportNetworkSingleResponseSRExample,
} from '../../entities/support-network.entity';
import { RecordType } from '../../common/constants/enumerations';
import { IdPathParams } from '../../dto/id-path-params.dto';
import { SinceQueryParams } from '../../dto/since-query-params.dto';
import { TokenRefresherService } from '../../external-api/token-refresher/token-refresher.service';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import {
  idName,
  srAttachmentsFieldName,
} from '../../common/constants/parameter-constants';
import { AttachmentsService } from '../../helpers/attachments/attachments.service';
import {
  AttachmentsEntity,
  AttachmentsSingleResponseSRExample,
} from '../../entities/attachments.entity';
import { getMockRes } from '@jest-mock/express';
import { startRowNumParamName } from '../../common/constants/upstream-constants';
import { StartRowNumQueryParams } from '../../dto/start-row-num-query-params.dto';

describe('ServiceRequestsService', () => {
  let service: ServiceRequestsService;
  let supportNetworkService: SupportNetworkService;
  let attachmentsService: AttachmentsService;
  const { res, mockClear } = getMockRes();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule.forRoot()],
      providers: [
        ServiceRequestsService,
        SupportNetworkService,
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

    service = module.get<ServiceRequestsService>(ServiceRequestsService);
    supportNetworkService = module.get<SupportNetworkService>(
      SupportNetworkService,
    );
    attachmentsService = module.get<AttachmentsService>(AttachmentsService);
    mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSingleSRSupportNetworkInformationRecord tests', () => {
    it.each([
      [
        SupportNetworkSingleResponseSRExample,
        { [idName]: 'test' } as IdPathParams,
        { since: '2024-12-01' } as SinceQueryParams,
        { [startRowNumParamName]: 0 } as StartRowNumQueryParams,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams, sinceQueryParams, startRowNum) => {
        const supportNetworkSpy = jest
          .spyOn(
            supportNetworkService,
            'getSingleSupportNetworkInformationRecord',
          )
          .mockReturnValueOnce(Promise.resolve(new SupportNetworkEntity(data)));

        const result = await service.getSingleSRSupportNetworkInformationRecord(
          idPathParams,
          res,
          sinceQueryParams,
          startRowNum,
        );
        expect(supportNetworkSpy).toHaveBeenCalledWith(
          RecordType.SR,
          idPathParams,
          res,
          sinceQueryParams,
          startRowNum,
        );
        expect(result).toEqual(new SupportNetworkEntity(data));
      },
    );
  });

  describe('getSingleSRAttachmentRecord tests', () => {
    it.each([
      [
        AttachmentsSingleResponseSRExample,
        { [idName]: 'test' } as IdPathParams,
        { since: '2024-12-01' } as SinceQueryParams,
        srAttachmentsFieldName,
        { [startRowNumParamName]: 0 } as StartRowNumQueryParams,
      ],
    ])(
      'should return single values given good input',
      async (
        data,
        idPathParams,
        sinceQueryParams,
        typeFieldName,
        startRowNum,
      ) => {
        const attachmentsSpy = jest
          .spyOn(attachmentsService, 'getSingleAttachmentRecord')
          .mockReturnValueOnce(Promise.resolve(new AttachmentsEntity(data)));

        const result = await service.getSingleSRAttachmentRecord(
          idPathParams,
          res,
          sinceQueryParams,
          startRowNum,
        );
        expect(attachmentsSpy).toHaveBeenCalledWith(
          RecordType.SR,
          idPathParams,
          typeFieldName,
          res,
          sinceQueryParams,
          startRowNum,
        );
        expect(result).toEqual(new AttachmentsEntity(data));
      },
    );
  });
});
