import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CasesController } from './cases.controller';
import { CasesService } from './cases.service';
import {
  SupportNetworkEntity,
  SupportNetworkSingleResponseCaseExample,
} from '../../entities/support-network.entity';
import { SinceQueryParams } from '../../dto/since-query-params.dto';
import { IdPathParams } from '../../dto/id-path-params.dto';
import { AuthService } from '../../common/guards/auth/auth.service';
import { TokenRefresherService } from '../../external-api/token-refresher/token-refresher.service';
import { SupportNetworkService } from '../../helpers/support-network/support-network.service';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';
import { InPersonVisitsService } from '../../helpers/in-person-visits/in-person-visits.service';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';

describe('CasesController', () => {
  let controller: CasesController;
  let casesService: CasesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        CasesService,
        AuthService,
        SupportNetworkService,
        TokenRefresherService,
        InPersonVisitsService,
        RequestPreparerService,
        { provide: CACHE_MANAGER, useValue: {} },
        ConfigService,
        UtilitiesService,
        { provide: HttpService, useValue: { get: jest.fn() } },
      ],
      controllers: [CasesController],
    }).compile();

    controller = module.get<CasesController>(CasesController);
    casesService = module.get<CasesService>(CasesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getSingleCaseSupportNetworkInformationRecord tests', () => {
    it.each([
      [
        SupportNetworkSingleResponseCaseExample,
        { id: 'test' } as IdPathParams,
        { since: '2020-02-02' } as SinceQueryParams,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams, sinceQueryParams) => {
        const casesServiceSpy = jest
          .spyOn(casesService, 'getSingleCaseSupportNetworkInformationRecord')
          .mockReturnValueOnce(Promise.resolve(new SupportNetworkEntity(data)));

        const result =
          await controller.getSingleCaseSupportNetworkInformationRecord(
            idPathParams,
            sinceQueryParams,
          );
        expect(casesServiceSpy).toHaveBeenCalledWith(
          idPathParams,
          sinceQueryParams,
        );
        expect(result).toEqual(new SupportNetworkEntity(data));
      },
    );
  });
});
