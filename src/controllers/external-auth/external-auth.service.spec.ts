import { Test, TestingModule } from '@nestjs/testing';
import { ExternalAuthService } from './external-auth.service';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import configuration from '../../configuration/configuration';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import { TokenRefresherService } from '../../external-api/token-refresher/token-refresher.service';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';
import { CaseloadService } from '../caseload/caseload.service';
import { AuthService } from '../../common/guards/auth/auth.service';
import { HttpException } from '@nestjs/common';
import { idirJWTFieldName } from '../../common/constants/upstream-constants';
import { getMockReq } from '@jest-mock/express';

describe('ExternalAuthService', () => {
  let service: ExternalAuthService;
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        ConfigModule.forRoot({ load: [configuration] }),
        CacheModule.register({ isGlobal: true }),
      ],
      providers: [
        CaseloadService,
        UtilitiesService,
        JwtService,
        TokenRefresherService,
        RequestPreparerService,
        ExternalAuthService,
        AuthService,
      ],
    }).compile();

    service = module.get<ExternalAuthService>(ExternalAuthService);
    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkEmployeeStatusUpstream tests', () => {
    it.each([['idirHere']])(
      'should return void given good input',
      async (idir) => {
        const jwt = jwtService.sign(`{"${idirJWTFieldName}":"${idir}"}`, {
          secret: 'aTotalSecret',
        });
        const req = getMockReq({
          header: jest.fn((headerName) => {
            const lookup = { authorization: `Bearer ${jwt}` };
            return lookup[headerName];
          }),
        });
        const authSpy = jest
          .spyOn(authService, 'getEmployeeActiveUpstream')
          .mockReturnValueOnce(Promise.resolve([true, 'officeNames']));
        const spy = jest.spyOn(service, 'checkEmployeeStatusUpstream');

        await service.checkEmployeeStatusUpstream(req);
        expect(authSpy).toHaveBeenCalledWith(idir);
        expect(spy).toHaveBeenCalledTimes(1);
      },
    );

    it.each([['idirHere']])('should throw error on bad input', async (idir) => {
      const jwt = jwtService.sign(`{"${idirJWTFieldName}":"${idir}"}`, {
        secret: 'aTotalSecret',
      });
      const req = getMockReq({
        header: jest.fn((headerName) => {
          const lookup = { authorization: `Bearer ${jwt}` };
          return lookup[headerName];
        }),
      });
      const authSpy = jest
        .spyOn(authService, 'getEmployeeActiveUpstream')
        .mockReturnValueOnce(Promise.resolve([false, null]));

      await expect(service.checkEmployeeStatusUpstream(req)).rejects.toThrow(
        HttpException,
      );
      expect(authSpy).toHaveBeenCalledWith(idir);
    });
  });
});
