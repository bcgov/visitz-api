import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServiceRequestsController } from './service-requests.controller';
import { ServiceRequestsService } from './service-requests.service';
import {
  SupportNetworkEntity,
  SupportNetworkSingleResponseSRExample,
} from '../../entities/support-network.entity';
import { IdPathParams } from '../../dto/id-path-params.dto';
import { SinceQueryParams } from '../../dto/since-query-params.dto';
import { SupportNetworkService } from '../../helpers/support-network/support-network.service';
import { TokenRefresherService } from '../../external-api/token-refresher/token-refresher.service';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import { idName } from '../../common/constants/parameter-constants';
import { AttachmentsService } from '../../helpers/attachments/attachments.service';
import {
  AttachmentsEntity,
  AttachmentsSingleResponseSRExample,
} from '../../entities/attachments.entity';
import { AuthService } from '../../common/guards/auth/auth.service';

describe('ServiceRequestsController', () => {
  let controller: ServiceRequestsController;
  let serviceRequestsService: ServiceRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        ServiceRequestsService,
        AuthService,
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
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getSingleSRSupportNetworkInformationRecord tests', () => {
    it.each([
      [
        SupportNetworkSingleResponseSRExample,
        { [idName]: 'test' } as IdPathParams,
        { since: '2020-02-02' } as SinceQueryParams,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams, sinceQueryParams) => {
        const SRsServiceSpy = jest
          .spyOn(
            serviceRequestsService,
            'getSingleSRSupportNetworkInformationRecord',
          )
          .mockReturnValueOnce(Promise.resolve(new SupportNetworkEntity(data)));

        const result =
          await controller.getSingleSRSupportNetworkInformationRecord(
            idPathParams,
            sinceQueryParams,
          );
        expect(SRsServiceSpy).toHaveBeenCalledWith(
          idPathParams,
          sinceQueryParams,
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
        { since: '2020-02-02' } as SinceQueryParams,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams, sinceQueryParams) => {
        const SRsServiceSpy = jest
          .spyOn(serviceRequestsService, 'getSingleSRAttachmentRecord')
          .mockReturnValueOnce(Promise.resolve(new AttachmentsEntity(data)));

        const result = await controller.getSingleSRAttachmentRecord(
          idPathParams,
          sinceQueryParams,
        );
        expect(SRsServiceSpy).toHaveBeenCalledWith(
          idPathParams,
          sinceQueryParams,
        );
        expect(result).toEqual(new AttachmentsEntity(data));
      },
    );
  });
});
