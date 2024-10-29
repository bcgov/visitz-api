import { Test, TestingModule } from '@nestjs/testing';
import { IncidentsService } from './incidents.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { SupportNetworkService } from '../../helpers/support-network/support-network.service';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';
import {
  SupportNetworkEntity,
  SupportNetworkSingleResponseIncidentExample,
} from '../../entities/support-network.entity';
import { SinceQueryParams } from '../../dto/since-query-params.dto';
import { IdPathParams } from '../../dto/id-path-params.dto';
import { RecordType } from '../../common/constants/enumerations';

describe('IncidentsService', () => {
  let service: IncidentsService;
  let supportNetworkService: SupportNetworkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule.forRoot()],
      providers: [IncidentsService, SupportNetworkService, UtilitiesService],
    }).compile();

    service = module.get<IncidentsService>(IncidentsService);
    supportNetworkService = module.get<SupportNetworkService>(
      SupportNetworkService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSingleIncidentSupportNetworkInformationRecord tests', () => {
    it.each([
      [
        SupportNetworkSingleResponseIncidentExample,
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

        const result =
          await service.getSingleIncidentSupportNetworkInformationRecord(
            idPathParams,
            sinceQueryParams,
          );
        expect(supportNetworkSpy).toHaveBeenCalledWith(
          RecordType.Incident,
          idPathParams,
          sinceQueryParams,
        );
        expect(result).toEqual(new SupportNetworkEntity(data));
      },
    );
  });
});
