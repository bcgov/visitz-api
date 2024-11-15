import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { IncidentsService } from './incidents.service';
import { SupportNetworkService } from '../../helpers/support-network/support-network.service';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';
import {
  SupportNetworkEntity,
  SupportNetworkSingleResponseIncidentExample,
} from '../../entities/support-network.entity';
import { SinceQueryParams } from '../../dto/since-query-params.dto';
import { IdPathParams } from '../../dto/id-path-params.dto';
import { RecordType } from '../../common/constants/enumerations';
import { TokenRefresherService } from '../../external-api/token-refresher/token-refresher.service';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import {
  idName,
  incidentsAttachmentsFieldName,
} from '../../common/constants/parameter-constants';
import { AttachmentsService } from '../../helpers/attachments/attachments.service';
import {
  AttachmentsSingleResponseIncidentExample,
  AttachmentsEntity,
} from '../../entities/attachments.entity';

describe('IncidentsService', () => {
  let service: IncidentsService;
  let supportNetworkService: SupportNetworkService;
  let attachmentsService: AttachmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule.forRoot()],
      providers: [
        IncidentsService,
        SupportNetworkService,
        AttachmentsService,
        UtilitiesService,
        TokenRefresherService,
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

    service = module.get<IncidentsService>(IncidentsService);
    supportNetworkService = module.get<SupportNetworkService>(
      SupportNetworkService,
    );
    attachmentsService = module.get<AttachmentsService>(AttachmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSingleIncidentSupportNetworkInformationRecord tests', () => {
    it.each([
      [
        SupportNetworkSingleResponseIncidentExample,
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

  describe('getSingleIncidentAttachmentRecord tests', () => {
    it.each([
      [
        AttachmentsSingleResponseIncidentExample,
        { [idName]: 'test' } as IdPathParams,
        { since: '2024-12-01' } as SinceQueryParams,
        incidentsAttachmentsFieldName,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams, sinceQueryParams, typeFieldName) => {
        const attachmentsSpy = jest
          .spyOn(attachmentsService, 'getSingleAttachmentRecord')
          .mockReturnValueOnce(Promise.resolve(new AttachmentsEntity(data)));

        const result = await service.getSingleIncidentAttachmentRecord(
          idPathParams,
          sinceQueryParams,
        );
        expect(attachmentsSpy).toHaveBeenCalledWith(
          RecordType.Incident,
          idPathParams,
          typeFieldName,
          sinceQueryParams,
        );
        expect(result).toEqual(new AttachmentsEntity(data));
      },
    );
  });
});
