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

describe('ExternalAuthService', () => {
  let service: ExternalAuthService;
  let authService: AuthService;

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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkEmployeeStatusUpstream tests', () => {
    it.each([['idirHere']])(
      'should return void given good input',
      async (idir) => {
        const authSpy = jest
          .spyOn(authService, 'getEmployeeActiveUpstream')
          .mockReturnValueOnce(Promise.resolve(true));
        const spy = jest.spyOn(service, 'checkEmployeeStatusUpstream');

        await service.checkEmployeeStatusUpstream(idir);
        expect(authSpy).toHaveBeenCalledWith(idir);
        expect(spy).toHaveBeenCalledTimes(1);
      },
    );

    it.each([['idirHere']])('should throw error on bad input', async (idir) => {
      const authSpy = jest
        .spyOn(authService, 'getEmployeeActiveUpstream')
        .mockReturnValueOnce(Promise.resolve(false));

      await expect(service.checkEmployeeStatusUpstream(idir)).rejects.toThrow(
        HttpException,
      );
      expect(authSpy).toHaveBeenCalledWith(idir);
    });
  });
});
