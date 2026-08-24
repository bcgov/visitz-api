import { Module } from '@nestjs/common';
import { AppLogsService } from './app-logs.service';
import { AppLogsController } from './app-logs.controller';

@Module({
  providers: [AppLogsService],
  controllers: [AppLogsController],
})
export class AppLogsModule {}
