import { Test, TestingModule } from '@nestjs/testing';
import { ExternalAuthController } from './external-auth.controller';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from '../../common/guards/auth/auth.service';
import configuration from '../../configuration/configuration';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import { TokenRefresherService } from '../../external-api/token-refresher/token-refresher.service';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';
import { ExternalAuthService } from './external-auth.service';
import { getMockReq } from '@jest-mock/express';
import { idirJWTFieldName } from '../../common/constants/upstream-constants';

describe('ExternalAuthController', () => {
  let controller: ExternalAuthController;
  let externalAuthService: ExternalAuthService;
  let jwtService: JwtService;
  const testIdir = 'idir';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ load: [configuration] }),
        JwtModule.register({ global: true }),
      ],
      providers: [
        AuthService,
        ExternalAuthService,
        TokenRefresherService,
        RequestPreparerService,
        JwtService,
        { provide: CACHE_MANAGER, useValue: {} },
        ConfigService,
        UtilitiesService,
        { provide: HttpService, useValue: { get: jest.fn() } },
      ],
      controllers: [ExternalAuthController],
    }).compile();

    controller = module.get<ExternalAuthController>(ExternalAuthController);
    externalAuthService = module.get<ExternalAuthService>(ExternalAuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('checkAuthorizationEmployeeStatus tests', () => {
    it('should return office names given good input', async () => {
      const jwt = jwtService.sign(`{"${idirJWTFieldName}":"${testIdir}"}`, {
        secret: 'aTotalSecret',
      });
      const req = getMockReq({
        header: jest.fn((headerName) => {
          const lookup = { authorization: `Bearer ${jwt}` };
          return lookup[headerName];
        }),
      });
      const externalAuthServiceSpy = jest
        .spyOn(externalAuthService, 'checkEmployeeStatusUpstream')
        .mockReturnValueOnce(Promise.resolve('officeNames'));

      await controller.checkAuthorizationEmployeeStatus(req);
      expect(externalAuthServiceSpy).toHaveBeenCalledWith(req);
    });
  });
});
