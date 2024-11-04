import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Controller, ExecutionContext, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TestingModule, Test } from '@nestjs/testing';
import { UtilitiesService } from '../../../helpers/utilities/utilities.service';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { getMockReq } from '@jest-mock/express';
import { TokenRefresherService } from '../../../external-api/token-refresher/token-refresher.service';

describe('AuthGuard', () => {
  let service: AuthService;
  let configService: ConfigService;
  let guard;

  @Controller()
  class TestController {
    @UseGuards(AuthGuard)
    async example() {
      return true;
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: { getRecordAndValidate: () => jest.fn() },
        },
        TokenRefresherService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            set: () => jest.fn(),
            get: () => jest.fn(),
          },
        },
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
      controllers: [TestController],
    }).compile();

    service = module.get<AuthService>(AuthService);
    configService = module.get<ConfigService>(ConfigService);
    const guards = Reflect.getMetadata(
      '__guards__',
      TestController.prototype.example,
    );
    guard = new guards[0](service, configService);
    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(guard).toBeDefined();
    expect(guard).toBeInstanceOf(AuthGuard);
  });

  describe('canActivate tests', () => {
    it('should always return true in non-production environment', async () => {
      const authSpy = jest
        .spyOn(service, 'getRecordAndValidate')
        .mockResolvedValueOnce(false);
      const guardSpy = jest.spyOn(AuthGuard.prototype, 'canActivate');
      const isAuthed = await guard.canActivate({} as ExecutionContext);
      expect(authSpy).toHaveBeenCalledTimes(0);
      expect(guardSpy).toHaveBeenCalledTimes(1);
      expect(isAuthed).toBe(true);
    });

    it('should return the result of getRecordAndValidate in a production environment', async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          AuthService,
          TokenRefresherService,
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
      const guards = Reflect.getMetadata(
        '__guards__',
        TestController.prototype.example,
      );
      guard = new guards[0](service, configService);

      const authSpy = jest
        .spyOn(service, 'getRecordAndValidate')
        .mockResolvedValueOnce(false);
      const guardSpy = jest.spyOn(AuthGuard.prototype, 'canActivate');
      const execContext = {
        switchToHttp: () => ({
          getRequest: () => getMockReq(),
        }),
      };

      const isAuthed = await guard.canActivate(execContext);
      expect(authSpy).toHaveBeenCalledTimes(1);
      expect(guardSpy).toHaveBeenCalledTimes(1);
      expect(isAuthed).toBe(false);
    });
  });
});
