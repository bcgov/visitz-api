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
import { FilterQueryParams } from '../../dto/filter-query-params.dto';
import { RecordType, VisitDetails } from '../../common/constants/enumerations';
import { TokenRefresherService } from '../../external-api/token-refresher/token-refresher.service';
import { InPersonVisitsService } from '../../helpers/in-person-visits/in-person-visits.service';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import {
  InPersonVisitsEntity,
  InPersonVisitsSingleResponseCaseExample,
  NestedInPersonVisitsEntity,
  PostInPersonVisitResponseExample,
} from '../../entities/in-person-visits.entity';
import {
  casesAttachmentsFieldName,
  idName,
} from '../../common/constants/parameter-constants';
import { AttachmentsService } from '../../helpers/attachments/attachments.service';
import {
  AttachmentsSingleResponseCaseExample,
  AttachmentsEntity,
} from '../../entities/attachments.entity';
import { getMockRes } from '@jest-mock/express';
import { startRowNumParamName } from '../../common/constants/upstream-constants';

describe('CasesService', () => {
  let service: CasesService;
  let supportNetworkService: SupportNetworkService;
  let inPersonVisitsService: InPersonVisitsService;
  let attachmentsService: AttachmentsService;
  const { res, mockClear } = getMockRes();

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
    attachmentsService = module.get<AttachmentsService>(AttachmentsService);
    mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSingleCaseSupportNetworkInformationRecord tests', () => {
    it.each([
      [
        SupportNetworkSingleResponseCaseExample,
        { [idName]: 'test' } as IdPathParams,
        { since: '2024-12-01' } as FilterQueryParams,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams, filterQueryParams) => {
        const supportNetworkSpy = jest
          .spyOn(
            supportNetworkService,
            'getSingleSupportNetworkInformationRecord',
          )
          .mockReturnValueOnce(Promise.resolve(new SupportNetworkEntity(data)));

        const result =
          await service.getSingleCaseSupportNetworkInformationRecord(
            idPathParams,
            res,
            filterQueryParams,
          );
        expect(supportNetworkSpy).toHaveBeenCalledWith(
          RecordType.Case,
          idPathParams,
          res,
          filterQueryParams,
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
        { since: '2024-12-01', [startRowNumParamName]: 0 } as FilterQueryParams,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams, filterQueryParams) => {
        const InPersonVisitsSpy = jest
          .spyOn(inPersonVisitsService, 'getSingleInPersonVisitRecord')
          .mockReturnValueOnce(Promise.resolve(new InPersonVisitsEntity(data)));

        const result = await service.getSingleCaseInPersonVisitRecord(
          idPathParams,
          res,
          filterQueryParams,
        );
        expect(InPersonVisitsSpy).toHaveBeenCalledWith(
          RecordType.Case,
          idPathParams,
          res,
          filterQueryParams,
        );
        expect(result).toEqual(new InPersonVisitsEntity(data));
      },
    );
  });

  describe('postSingleCaseInPersonVisitRecord tests', () => {
    it.each([
      [
        {
          'Date of visit': '11/08/2024 08:24:11',
          'Visit Details Value': VisitDetails.NotPrivateInHome,
          'Visit Description': 'comment',
        },
        'idir',
        { [idName]: 'test' } as IdPathParams,
        PostInPersonVisitResponseExample,
      ],
    ])(
      'should return single values given good input',
      async (body, idir, idPathParams, data) => {
        const InPersonVisitsSpy = jest
          .spyOn(inPersonVisitsService, 'postSingleInPersonVisitRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedInPersonVisitsEntity(data)),
          );

        const result = await service.postSingleCaseInPersonVisitRecord(
          body,
          idir,
          idPathParams,
        );
        expect(InPersonVisitsSpy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(new NestedInPersonVisitsEntity(data));
      },
    );
  });

  describe('getSingleCaseAttachmentRecord tests', () => {
    it.each([
      [
        AttachmentsSingleResponseCaseExample,
        { [idName]: 'test' } as IdPathParams,
        { since: '2024-12-01' } as FilterQueryParams,
        casesAttachmentsFieldName,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams, filterQueryParams, typeFieldName) => {
        const attachmentsSpy = jest
          .spyOn(attachmentsService, 'getSingleAttachmentRecord')
          .mockReturnValueOnce(Promise.resolve(new AttachmentsEntity(data)));

        const result = await service.getSingleCaseAttachmentRecord(
          idPathParams,
          res,
          filterQueryParams,
        );
        expect(attachmentsSpy).toHaveBeenCalledWith(
          RecordType.Case,
          idPathParams,
          typeFieldName,
          res,
          filterQueryParams,
        );
        expect(result).toEqual(new AttachmentsEntity(data));
      },
    );
  });
});
