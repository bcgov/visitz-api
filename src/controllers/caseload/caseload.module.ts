import { Module } from '@nestjs/common';
import { CaseloadService } from './caseload.service';
import { CaseloadController } from './caseload.controller';
import { ExternalApiModule } from '../../external-api/external-api.module';
import { ConfigService } from '@nestjs/config';
import { UtilitiesModule } from '../../helpers/utilities/utilities.module';

@Module({
  providers: [CaseloadService, ConfigService],
  controllers: [CaseloadController],
  imports: [ExternalApiModule, UtilitiesModule],
})
export class CaseloadModule {}
