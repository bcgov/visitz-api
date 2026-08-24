import { Test, TestingModule } from '@nestjs/testing';
import { getMockReq } from '@jest-mock/express';
import { AppLogsController } from './app-logs.controller';
import { AppLogsService } from './app-logs.service';
import { ExternalAuthService } from '../external-auth/external-auth.service';
import { AppLogLevel } from '../../common/constants/enumerations';
import { PostAppLogsDto } from '../../dto/post-app-logs.dto';

describe('AppLogsController', () => {
  let controller: AppLogsController;
  let appLogsService: AppLogsService;
  let externalAuthService: ExternalAuthService;
  const req = getMockReq();

  const appLogs: PostAppLogsDto = [
    {
      level: AppLogLevel.Log,
      'app-timestamp': 1970000000,
      'dotnet-runtime': '8.0.1',
      'app-version': '1.0.0',
      'source-name': 'ClassNameHere',
      device: {
        model: 'iPhone 15',
        manufacturer: 'Apple',
        'os-version': '17.4.1',
        idiom: 'phone',
        platform: 'ios',
      },
      message: { detail: 'test message' },
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppLogsController],
      providers: [
        { provide: AppLogsService, useValue: { logAppLogs: jest.fn() } },
        {
          provide: ExternalAuthService,
          useValue: { checkEmployeeStatusUpstream: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<AppLogsController>(AppLogsController);
    appLogsService = module.get<AppLogsService>(AppLogsService);
    externalAuthService = module.get<ExternalAuthService>(ExternalAuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('checks employee status upstream before logging the app logs', async () => {
    await controller.postAppLogs(req, appLogs);

    expect(
      externalAuthService.checkEmployeeStatusUpstream,
    ).toHaveBeenCalledWith(req);
    expect(appLogsService.logAppLogs).toHaveBeenCalledWith(appLogs);
  });

  it('propagates errors from the employee status check without logging', async () => {
    (
      externalAuthService.checkEmployeeStatusUpstream as jest.Mock
    ).mockRejectedValueOnce(new Error('Forbidden'));

    await expect(controller.postAppLogs(req, appLogs)).rejects.toThrow(
      'Forbidden',
    );
    expect(appLogsService.logAppLogs).not.toHaveBeenCalled();
  });
});
