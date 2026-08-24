import { Module } from '@nestjs/common';
import { AppLogsService } from './app-logs.service';
import { AppLogsController } from './app-logs.controller';
import { ExternalAuthModule } from '../external-auth/external-auth.module';

@Module({
  providers: [AppLogsService],
  controllers: [AppLogsController],
  imports: [ExternalAuthModule],
})
export class AppLogsModule {}
