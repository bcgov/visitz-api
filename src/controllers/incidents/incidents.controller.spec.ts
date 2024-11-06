import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IncidentsController } from './incidents.controller';
import { IncidentsService } from './incidents.service';
import {
  SupportNetworkEntity,
  SupportNetworkSingleResponseIncidentExample,
} from '../../entities/support-network.entity';
import { SinceQueryParams } from '../../dto/since-query-params.dto';
import { IdPathParams } from '../../dto/id-path-params.dto';
import { AuthService } from '../../common/guards/auth/auth.service';
import { SupportNetworkService } from '../../helpers/support-network/support-network.service';
import { TokenRefresherService } from '../../external-api/token-refresher/token-refresher.service';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import { idName } from '../../common/constants/parameter-constants';

describe('IncidentsController', () => {
  let controller: IncidentsController;
  let incidentsService: IncidentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        IncidentsService,
        SupportNetworkService,
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
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getSingleIncidentSupportNetworkInformationRecord tests', () => {
    it.each([
      [
        SupportNetworkSingleResponseIncidentExample,
        { [idName]: 'test' } as IdPathParams,
        { since: '2020-02-02' } as SinceQueryParams,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams, sinceQueryParams) => {
        const IncidentsServiceSpy = jest
          .spyOn(
            incidentsService,
            'getSingleIncidentSupportNetworkInformationRecord',
          )
          .mockReturnValueOnce(Promise.resolve(new SupportNetworkEntity(data)));

        const result =
          await controller.getSingleIncidentSupportNetworkInformationRecord(
            idPathParams,
            sinceQueryParams,
          );
        expect(IncidentsServiceSpy).toHaveBeenCalledWith(
          idPathParams,
          sinceQueryParams,
        );
        expect(result).toEqual(new SupportNetworkEntity(data));
      },
    );
  });
});
