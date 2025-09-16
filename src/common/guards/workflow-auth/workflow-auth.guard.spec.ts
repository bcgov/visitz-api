import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Controller, ExecutionContext, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TestingModule, Test } from '@nestjs/testing';
import { TokenRefresherService } from '../../../external-api/token-refresher/token-refresher.service';
import { UtilitiesService } from '../../../helpers/utilities/utilities.service';
import { WorkflowAuthGuard } from './workflow-auth.guard';
import { WorkflowAuthService } from './workflow-auth.service';
import { getMockReq } from '@jest-mock/express';
import { AuthService } from '../auth/auth.service';

describe('WorkflowAuthGuard', () => {
  let service: WorkflowAuthService;
  let configService: ConfigService;
  let guard;

  @Controller()
  class TestController {
    @UseGuards(WorkflowAuthGuard)
    async example() {
      return true;
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: WorkflowAuthService,
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
                skipAuthGuard: true,
              };
              return lookup[key];
            }),
          },
        },
        { provide: HttpService, useValue: { get: jest.fn() } },
      ],
      imports: [JwtModule.register({ global: true })],
      controllers: [TestController],
    }).compile();

    service = module.get<WorkflowAuthService>(WorkflowAuthService);
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
    expect(guard).toBeInstanceOf(WorkflowAuthGuard);
  });

  describe('canActivate tests', () => {
    it('should always return true when skipping', async () => {
      const authSpy = jest
        .spyOn(service, 'getRecordAndValidate')
        .mockResolvedValueOnce(false);
      const guardSpy = jest.spyOn(WorkflowAuthGuard.prototype, 'canActivate');
      const execContext = {
        switchToHttp: () => ({
          getRequest: () => getMockReq(),
        }),
        getClass: () => {
          return TestController;
        },
      };
      const isAuthed = await guard.canActivate(execContext as ExecutionContext);
      expect(authSpy).toHaveBeenCalledTimes(0);
      expect(guardSpy).toHaveBeenCalledTimes(1);
      expect(isAuthed).toBe(true);
    });

    it.each([[true], [false]])(
      'should return the result of getRecordAndValidate when not skipping',
      async (result) => {
        const module: TestingModule = await Test.createTestingModule({
          providers: [
            AuthService,
            WorkflowAuthService,
            TokenRefresherService,
            { provide: CACHE_MANAGER, useValue: {} },
            UtilitiesService,
            {
              provide: ConfigService,
              useValue: {
                get: jest.fn((key: string) => {
                  const lookup = {
                    skipAuthGuard: false,
                  };
                  return lookup[key];
                }),
              },
            },

            { provide: HttpService, useValue: { get: jest.fn() } },
          ],
          imports: [JwtModule.register({ global: true })],
        }).compile();
        service = module.get<WorkflowAuthService>(WorkflowAuthService);
        configService = module.get<ConfigService>(ConfigService);
        const guards = Reflect.getMetadata(
          '__guards__',
          TestController.prototype.example,
        );
        guard = new guards[0](service, configService);

        const authSpy = jest
          .spyOn(service, 'getRecordAndValidate')
          .mockResolvedValueOnce(result);
        const guardSpy = jest.spyOn(WorkflowAuthGuard.prototype, 'canActivate');
        const execContext = {
          switchToHttp: () => ({
            getRequest: () => getMockReq(),
          }),
          getClass: () => {
            return TestController;
          },
        };
        const isAuthed = await guard.canActivate(execContext);
        expect(authSpy).toHaveBeenCalledTimes(1);
        expect(guardSpy).toHaveBeenCalledTimes(1);
        expect(isAuthed).toBe(result);
      },
    );
  });
});
