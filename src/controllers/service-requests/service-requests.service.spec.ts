import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule, HttpService } from '@nestjs/axios';
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

describe('ServiceRequestsService', () => {
  let service: ServiceRequestsService;
  let supportNetworkService: SupportNetworkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule.forRoot()],
      providers: [
        ServiceRequestsService,
        SupportNetworkService,
        UtilitiesService,
        { provide: HttpService, useValue: { get: jest.fn() } },
      ],
    }).compile();

    service = module.get<ServiceRequestsService>(ServiceRequestsService);
    supportNetworkService = module.get<SupportNetworkService>(
      SupportNetworkService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSingleSRSupportNetworkInformationRecord tests', () => {
    it.each([
      [
        SupportNetworkSingleResponseSRExample,
        { id: 'test' } as IdPathParams,
        { since: '2024-12-01' } as SinceQueryParams,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams, sinceQueryParams) => {
        const supportNetworkSpy = jest
          .spyOn(
            supportNetworkService,
            'getSingleSupportNetworkInformationRecord',
          )
          .mockReturnValueOnce(Promise.resolve(new SupportNetworkEntity(data)));

        const result = await service.getSingleSRSupportNetworkInformationRecord(
          idPathParams,
          sinceQueryParams,
        );
        expect(supportNetworkSpy).toHaveBeenCalledWith(
          RecordType.SR,
          idPathParams,
          sinceQueryParams,
        );
        expect(result).toEqual(new SupportNetworkEntity(data));
      },
    );
  });
});
