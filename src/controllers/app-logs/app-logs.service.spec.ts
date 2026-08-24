import { Test, TestingModule } from '@nestjs/testing';
import { getLoggerToken } from 'nestjs-pino';
import pino from 'pino';
import { AppLogsService } from './app-logs.service';
import { AppLogLevel } from '../../common/constants/enumerations';
import { PostAppLogEntry } from '../../dto/post-app-logs.dto';

describe('AppLogsService', () => {
  let service: AppLogsService;
  let childLogger: {
    fatal: jest.Mock;
    error: jest.Mock;
    warn: jest.Mock;
    info: jest.Mock;
    debug: jest.Mock;
    trace: jest.Mock;
  };
  let child: jest.Mock;

  const buildAppLog = (level?: AppLogLevel): PostAppLogEntry =>
    ({
      level,
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
    }) as PostAppLogEntry;

  beforeEach(async () => {
    childLogger = {
      fatal: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
      debug: jest.fn(),
      trace: jest.fn(),
    };
    child = jest.fn().mockReturnValue(childLogger);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppLogsService,
        {
          provide: getLoggerToken(AppLogsService.name),
          useValue: { logger: { child } },
        },
      ],
    }).compile();

    service = module.get<AppLogsService>(AppLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('derives an unfiltered trace-level child logger, bypassing the app log level', () => {
    service.logAppLogs([buildAppLog(AppLogLevel.Log)]);

    expect(child).toHaveBeenCalledWith({}, { level: 'trace' });
  });

  it.each([
    [AppLogLevel.Fatal, 'fatal'],
    [AppLogLevel.Error, 'error'],
    [AppLogLevel.Warn, 'warn'],
    [AppLogLevel.Debug, 'debug'],
    [AppLogLevel.Verbose, 'trace'],
    [AppLogLevel.Log, 'info'],
  ] as const)(
    'logs a %s level entry using the %s pino method',
    (level, pinoMethod) => {
      const appLog = buildAppLog(level);

      service.logAppLogs([appLog]);

      expect(childLogger[pinoMethod]).toHaveBeenCalledWith(appLog);
    },
  );

  it('defaults to info when level is undefined', () => {
    const appLog = buildAppLog(undefined);

    service.logAppLogs([appLog]);

    expect(childLogger.info).toHaveBeenCalledWith(appLog);
  });

  it('logs each entry in the array individually', () => {
    const appLogs = [
      buildAppLog(AppLogLevel.Log),
      buildAppLog(AppLogLevel.Log),
    ];

    service.logAppLogs(appLogs);

    expect(childLogger.info).toHaveBeenCalledTimes(2);
  });

  describe('with a real pino instance', () => {
    // Simulates the app's configured pinoHttp options (serializers, customProps-style bindings)
    // to prove the level override doesn't drop any other configured behaviour.
    it('bypasses a restrictive parent level while keeping bindings and serializers', async () => {
      const lines: string[] = [];
      const destination = { write: (chunk: string) => lines.push(chunk) };
      const parentLogger = pino(
        {
          level: 'info', // would normally suppress debug/trace level entries
          serializers: {
            message: (message: Record<string, unknown>) => ({
              ...message,
              redacted: true,
            }),
          },
        },
        destination,
      );
      // A per-request logger with bindings, as pino-http's customProps would produce
      const requestLogger = parentLogger.child({ buildNumber: 'build-123' });

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          AppLogsService,
          {
            provide: getLoggerToken(AppLogsService.name),
            useValue: { logger: requestLogger },
          },
        ],
      }).compile();
      const realService = module.get<AppLogsService>(AppLogsService);

      realService.logAppLogs([buildAppLog(AppLogLevel.Verbose)]);

      const logged = JSON.parse(lines[0]);
      expect(logged.level).toBe(10); // pino's numeric 'trace' level, not suppressed
      expect(logged.buildNumber).toBe('build-123'); // inherited request binding
      expect(logged.message.redacted).toBe(true); // inherited serializer
    });
  });
});
