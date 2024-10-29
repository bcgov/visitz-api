import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { CasesController } from './cases.controller';
import { CasesService } from './cases.service';
import { HelpersModule } from '../../helpers/helpers.module';
import {
  SupportNetworkEntity,
  SupportNetworkSingleResponseCaseExample,
} from '../../entities/support-network.entity';
import { SinceQueryParams } from '../../dto/since-query-params.dto';
import { IdPathParams } from '../../dto/id-path-params.dto';

describe('CasesController', () => {
  let controller: CasesController;
  let casesService: CasesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), HelpersModule],
      providers: [CasesService],
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
