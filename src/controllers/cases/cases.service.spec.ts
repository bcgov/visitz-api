import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { CasesService } from './cases.service';
import { SupportNetworkService } from '../../helpers/support-network/support-network.service';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';
import {
  SupportNetworkEntity,
  SupportNetworkSingleResponseCaseExample,
} from '../../entities/support-network.entity';
import { IdPathParams } from '../../dto/id-path-params.dto';
import { SinceQueryParams } from '../../dto/since-query-params.dto';
import { RecordType } from '../../common/constants/enumerations';
import { TokenRefresherService } from '../../external-api/token-refresher/token-refresher.service';
import { InPersonVisitsService } from '../../helpers/in-person-visits/in-person-visits.service';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import {
  InPersonVisitsEntity,
  InPersonVisitsSingleResponseCaseExample,
} from '../../entities/in-person-visits.entity';
import { idName } from '../../common/constants/parameter-constants';
import { AttachmentsService } from '../../helpers/attachments/attachments.service';

describe('CasesService', () => {
  let service: CasesService;
  let supportNetworkService: SupportNetworkService;
  let inPersonVisitsService: InPersonVisitsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule.forRoot()],
      providers: [
        CasesService,
        SupportNetworkService,
        AttachmentsService,
        UtilitiesService,
        TokenRefresherService,
        InPersonVisitsService,
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

    service = module.get<CasesService>(CasesService);
    supportNetworkService = module.get<SupportNetworkService>(
      SupportNetworkService,
    );
    inPersonVisitsService = module.get<InPersonVisitsService>(
      InPersonVisitsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSingleCaseSupportNetworkInformationRecord tests', () => {
    it.each([
      [
        SupportNetworkSingleResponseCaseExample,
        { [idName]: 'test' } as IdPathParams,
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

        const result =
          await service.getSingleCaseSupportNetworkInformationRecord(
            idPathParams,
            sinceQueryParams,
          );
        expect(supportNetworkSpy).toHaveBeenCalledWith(
          RecordType.Case,
          idPathParams,
          sinceQueryParams,
        );
        expect(result).toEqual(new SupportNetworkEntity(data));
      },
    );
  });

  describe('getSingleCaseInPersonVisitRecord tests', () => {
    it.each([
      [
        InPersonVisitsSingleResponseCaseExample,
        { [idName]: 'test' } as IdPathParams,
        { since: '2024-12-01' } as SinceQueryParams,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams, sinceQueryParams) => {
        const InPersonVisitsSpy = jest
          .spyOn(inPersonVisitsService, 'getSingleInPersonVisitRecord')
          .mockReturnValueOnce(Promise.resolve(new InPersonVisitsEntity(data)));

        const result = await service.getSingleCaseInPersonVisitRecord(
          idPathParams,
          sinceQueryParams,
        );
        expect(InPersonVisitsSpy).toHaveBeenCalledWith(
          RecordType.Case,
          idPathParams,
          sinceQueryParams,
        );
        expect(result).toEqual(new InPersonVisitsEntity(data));
      },
    );
  });
});
