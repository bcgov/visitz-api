import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import { TokenRefresherService } from '../../external-api/token-refresher/token-refresher.service';
import { UtilitiesService } from '../utilities/utilities.service';
import { CallInformationService } from './call-information.service';

@Module({
  imports: [HttpModule],
  providers: [
    CallInformationService,
    ConfigService,
    RequestPreparerService,
    UtilitiesService,
    TokenRefresherService,
  ],
  exports: [CallInformationService],
})
export class CallInformationModule {}
