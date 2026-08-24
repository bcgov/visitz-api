import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { AppLogLevel } from '../../common/constants/enumerations';
import { PostAppLogEntry, PostAppLogsDto } from '../../dto/post-app-logs.dto';

// The raw pino instance backing PinoLogger, used to bypass the app's configured log level.
type RawPinoLogger = PinoLogger['logger'];

@Injectable()
export class AppLogsService {
  constructor(
    @InjectPinoLogger(AppLogsService.name)
    private readonly pinoLogger: PinoLogger,
  ) {}

  logAppLogs(appLogs: PostAppLogsDto): void {
    // Only the level is overridden here; pino's child() inherits everything else
    // from the parent.
    const logger = this.pinoLogger.logger.child({}, { level: 'trace' });
    appLogs.forEach((appLog) => this.logAppLog(logger, appLog));
  }

  private logAppLog(logger: RawPinoLogger, appLog: PostAppLogEntry): void {
    switch (appLog.level) {
      case AppLogLevel.Fatal:
        logger.fatal(appLog);
        break;
      case AppLogLevel.Error:
        logger.error(appLog);
        break;
      case AppLogLevel.Warn:
        logger.warn(appLog);
        break;
      case AppLogLevel.Debug:
        logger.debug(appLog);
        break;
      case AppLogLevel.Verbose:
        logger.trace(appLog);
        break;
      case AppLogLevel.Log:
      default:
        logger.info(appLog);
        break;
    }
  }
}
