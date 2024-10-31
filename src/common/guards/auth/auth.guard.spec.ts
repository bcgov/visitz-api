import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TestingModule, Test } from '@nestjs/testing';
import { UtilitiesService } from '../../../helpers/utilities/utilities.service';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { getMockReq } from '@jest-mock/express';

describe('AuthGuard', () => {
  let service: AuthService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: CACHE_MANAGER, useValue: {} },
        UtilitiesService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const lookup = {
                NODE_ENV: 'test',
              };
              return lookup[key];
            }),
          },
        },

        { provide: HttpService, useValue: { get: jest.fn() } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    configService = module.get<ConfigService>(ConfigService);
    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(new AuthGuard(service, configService)).toBeDefined();
  });

  describe('canActivate tests', () => {
    it('should always return true in non-production environment', async () => {
      const authGuard = new AuthGuard(service, configService);
      const authSpy = jest
        .spyOn(service, 'getRecordAndValidate')
        .mockResolvedValueOnce(false);
      const isAuthed = await authGuard.canActivate({} as ExecutionContext);
      expect(isAuthed).toBe(true);
      expect(authSpy).toHaveBeenCalledTimes(0);
    });

    it('should return the result of getRecordAndValidate in a production environment', async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          AuthService,
          { provide: CACHE_MANAGER, useValue: {} },
          UtilitiesService,
          {
            provide: ConfigService,
            useValue: {
              get: jest.fn((key: string) => {
                const lookup = {
                  NODE_ENV: 'production',
                };
                return lookup[key];
              }),
            },
          },

          { provide: HttpService, useValue: { get: jest.fn() } },
        ],
      }).compile();

      service = module.get<AuthService>(AuthService);
      configService = module.get<ConfigService>(ConfigService);
      console.log(configService.get('NODE_ENV'));
      const authGuard = new AuthGuard(service, configService);
      const authSpy = jest
        .spyOn(service, 'getRecordAndValidate')
        .mockResolvedValueOnce(false);
      const execContext = {
        switchToHttp: () => ({
          getRequest: () => getMockReq(),
        }),
      };
      const isAuthed = await authGuard.canActivate(
        execContext as ExecutionContext,
      );
      expect(authSpy).toHaveBeenCalledTimes(1);
      expect(isAuthed).toBe(false);
    });
  });
});
