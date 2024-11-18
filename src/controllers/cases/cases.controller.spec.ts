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
import {
  InPersonVisitsEntity,
  InPersonVisitsSingleResponseCaseExample,
  NestedInPersonVisitsEntity,
  PostInPersonVisitResponseExample,
} from '../../entities/in-person-visits.entity';
import { idName } from '../../common/constants/parameter-constants';
import { AttachmentsService } from '../../helpers/attachments/attachments.service';
import {
  AttachmentsSingleResponseCaseExample,
  AttachmentsEntity,
} from '../../entities/attachments.entity';
import { VisitDetails } from '../../common/constants/enumerations';
import { getMockReq, getMockRes } from '@jest-mock/express';
import {
  idirUsernameHeaderField,
  startRowNumParamName,
} from '../../common/constants/upstream-constants';
import { StartRowNumQueryParams } from '../../dto/start-row-num-query-params.dto';

describe('CasesController', () => {
  let controller: CasesController;
  let casesService: CasesService;
  const { res, mockClear } = getMockRes();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        CasesService,
        AuthService,
        SupportNetworkService,
        AttachmentsService,
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
    mockClear();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getSingleCaseSupportNetworkInformationRecord tests', () => {
    it.each([
      [
        SupportNetworkSingleResponseCaseExample,
        { [idName]: 'test' } as IdPathParams,
        { since: '2020-02-02' } as SinceQueryParams,
        { [startRowNumParamName]: 0 } as StartRowNumQueryParams,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams, sinceQueryParams, startRowNum) => {
        const casesServiceSpy = jest
          .spyOn(casesService, 'getSingleCaseSupportNetworkInformationRecord')
          .mockReturnValueOnce(Promise.resolve(new SupportNetworkEntity(data)));

        const result =
          await controller.getSingleCaseSupportNetworkInformationRecord(
            idPathParams,
            res,
            sinceQueryParams,
            startRowNum,
          );
        expect(casesServiceSpy).toHaveBeenCalledWith(
          idPathParams,
          res,
          sinceQueryParams,
          startRowNum,
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
        { since: '2020-02-02' } as SinceQueryParams,
        { [startRowNumParamName]: 0 } as StartRowNumQueryParams,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams, sinceQueryParams, startRowNum) => {
        const casesServiceSpy = jest
          .spyOn(casesService, 'getSingleCaseInPersonVisitRecord')
          .mockReturnValueOnce(Promise.resolve(new InPersonVisitsEntity(data)));

        const result = await controller.getSingleCaseInPersonVisitRecord(
          idPathParams,
          res,
          sinceQueryParams,
          startRowNum,
        );
        expect(casesServiceSpy).toHaveBeenCalledWith(
          idPathParams,
          res,
          sinceQueryParams,
          startRowNum,
        );
        expect(result).toEqual(new InPersonVisitsEntity(data));
      },
    );
  });

  describe('postSingleCaseInPersonVisitRecord tests', () => {
    it.each([
      [
        {
          'Date of visit': '2024-11-13T21:24:03',
          'Visit Details Value': VisitDetails.NotPrivateInHome,
          'Visit Description': 'comment',
        },
        { [idName]: 'test' } as IdPathParams,
        'idir',
        PostInPersonVisitResponseExample,
      ],
    ])(
      'should return single values given good input',
      async (body, idPathParams, idir, data) => {
        const casesServiceSpy = jest
          .spyOn(casesService, 'postSingleCaseInPersonVisitRecord')
          .mockReturnValueOnce(
            Promise.resolve(new NestedInPersonVisitsEntity(data)),
          );

        const result = await controller.postSingleCaseInPersonVisitRecord(
          body,
          idPathParams,
          getMockReq({ headers: { [idirUsernameHeaderField]: idir } }),
        );
        expect(casesServiceSpy).toHaveBeenCalledWith(body, idir, idPathParams);
        expect(result).toEqual(new NestedInPersonVisitsEntity(data));
      },
    );
  });

  describe('getSingleCaseAttachmentRecord tests', () => {
    it.each([
      [
        AttachmentsSingleResponseCaseExample,
        { [idName]: 'test' } as IdPathParams,
        { since: '2020-02-02' } as SinceQueryParams,
        { [startRowNumParamName]: 0 } as StartRowNumQueryParams,
      ],
    ])(
      'should return single values given good input',
      async (data, idPathParams, sinceQueryParams, startRowNum) => {
        const caseServiceSpy = jest
          .spyOn(casesService, 'getSingleCaseAttachmentRecord')
          .mockReturnValueOnce(Promise.resolve(new AttachmentsEntity(data)));

        const result = await controller.getSingleCaseAttachmentRecord(
          idPathParams,
          res,
          sinceQueryParams,
          startRowNum,
        );
        expect(caseServiceSpy).toHaveBeenCalledWith(
          idPathParams,
          res,
          sinceQueryParams,
          startRowNum,
        );
        expect(result).toEqual(new AttachmentsEntity(data));
      },
    );
  });
});
