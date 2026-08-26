import { Test, TestingModule } from '@nestjs/testing';
import { AppLogsController } from './app-logs.controller';
import { AppLogsService } from './app-logs.service';
import { AppLogLevel } from '../../common/constants/enumerations';
import { PostAppLogsDto } from '../../dto/post-app-logs.dto';

describe('AppLogsController', () => {
  let controller: AppLogsController;
  let appLogsService: AppLogsService;

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
      ],
    }).compile();

    controller = module.get<AppLogsController>(AppLogsController);
    appLogsService = module.get<AppLogsService>(AppLogsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('logs the app logs', () => {
    controller.postAppLogs(appLogs);

    expect(appLogsService.logAppLogs).toHaveBeenCalledWith(appLogs);
  });
});
