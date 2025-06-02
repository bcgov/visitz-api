import { Test, TestingModule } from '@nestjs/testing';
import { CaseloadController } from './caseload.controller';
import { CaseloadService } from './caseload.service';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';
import configuration from '../../configuration/configuration';
import { TokenRefresherService } from '../../external-api/token-refresher/token-refresher.service';
import { JwtService } from '@nestjs/jwt';
import {
  CaseloadCompleteResponseExample,
  CaseloadEntity,
} from '../../entities/caseload.entity';
import { AfterQueryParams } from '../../dto/filter-query-params.dto';
import { plainToInstance } from 'class-transformer';
import { getMockReq } from '@jest-mock/express';
import { afterParamName } from '../../common/constants/parameter-constants';
import { idirUsernameHeaderField } from '../../common/constants/upstream-constants';
import { AuthService } from '../../common/guards/auth/auth.service';
import { ExternalAuthService } from '../external-auth/external-auth.service';

describe('CaseloadController', () => {
  let controller: CaseloadController;
  let caseloadService: CaseloadService;
  let externalAuthService: ExternalAuthService;
  const req = getMockReq({ headers: { [idirUsernameHeaderField]: 'idir' } });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CaseloadController],
      imports: [ConfigModule.forRoot({ load: [configuration] })],
      providers: [
        CaseloadService,
        TokenRefresherService,
        RequestPreparerService,
        AuthService,
        ExternalAuthService,
        { provide: CACHE_MANAGER, useValue: {} },
        ConfigService,
        UtilitiesService,
        JwtService,
        { provide: HttpService, useValue: { get: jest.fn(), post: jest.fn() } },
      ],
    }).compile();

    controller = module.get<CaseloadController>(CaseloadController);
    caseloadService = module.get<CaseloadService>(CaseloadService);
    externalAuthService = module.get<ExternalAuthService>(ExternalAuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCaseload tests', () => {
    it.each([
      [
        CaseloadCompleteResponseExample,
        {
          [afterParamName]: '1900-01-01',
        } as AfterQueryParams,
      ],
    ])(
      'should return nested values given good input',
      async (data, filterQueryParams) => {
        const externalAuthServiceSpy = jest
          .spyOn(externalAuthService, 'checkEmployeeStatusUpstream')
          .mockImplementationOnce(() => {
            return Promise.resolve();
          });
        const caseloadServiceSpy = jest
          .spyOn(caseloadService, 'getCaseload')
          .mockReturnValueOnce(
            Promise.resolve(
              plainToInstance(CaseloadEntity, data, {
                enableImplicitConversion: true,
              }),
            ),
          );

        const result = await controller.getCaseload(req, filterQueryParams);
        expect(externalAuthServiceSpy).toHaveBeenCalledTimes(1);
        expect(caseloadServiceSpy).toHaveBeenCalledWith(
          'idir',
          req,
          filterQueryParams,
        );
        expect(result).toEqual(
          plainToInstance(CaseloadEntity, data, {
            enableImplicitConversion: true,
          }),
        );
      },
    );
  });
});
