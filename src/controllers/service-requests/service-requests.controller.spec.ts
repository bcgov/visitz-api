import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ServiceRequestsController } from './service-requests.controller';
import { ServiceRequestsService } from './service-requests.service';
import { HelpersModule } from '../../helpers/helpers.module';
import {
  SupportNetworkEntity,
  SupportNetworkSingleResponseSRExample,
} from '../../entities/support-network.entity';
import { IdPathParams } from '../../dto/id-path-params.dto';
import { SinceQueryParams } from '../../dto/since-query-params.dto';
import { AuthService } from '../../common/guards/auth/auth.service';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';

describe('ServiceRequestsController', () => {
  let controller: ServiceRequestsController;
  let serviceRequestsService: ServiceRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), HelpersModule],
      providers: [
        ServiceRequestsService,
        AuthService,
        { provide: CACHE_MANAGER, useValue: {} },
        UtilitiesService,
        ConfigService,
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
        { id: 'test' } as IdPathParams,
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
});
