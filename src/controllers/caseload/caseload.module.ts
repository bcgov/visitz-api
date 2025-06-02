import { Module } from '@nestjs/common';
import { CaseloadService } from './caseload.service';
import { CaseloadController } from './caseload.controller';
import { ExternalApiModule } from '../../external-api/external-api.module';
import { ConfigService } from '@nestjs/config';
import { UtilitiesModule } from '../../helpers/utilities/utilities.module';
import { ExternalAuthService } from '../external-auth/external-auth.service';
import { ExternalAuthModule } from '../external-auth/external-auth.module';
import { AuthModule } from '../../common/guards/auth/auth.module';

@Module({
  providers: [CaseloadService, ConfigService, ExternalAuthService],
  controllers: [CaseloadController],
  imports: [ExternalApiModule, UtilitiesModule, ExternalAuthModule, AuthModule],
})
export class CaseloadModule {}
