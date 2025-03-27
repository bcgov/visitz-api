import { Module } from '@nestjs/common';
import { VirusScanService } from './virus-scan.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [VirusScanService, ConfigService],
  exports: [VirusScanService],
})
export class VirusScanModule {}
