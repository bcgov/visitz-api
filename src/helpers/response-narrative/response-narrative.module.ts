import { Module } from '@nestjs/common';
import { ResponseNarrativeService } from './response-narrative.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import { TokenRefresherService } from '../../external-api/token-refresher/token-refresher.service';
import { UtilitiesService } from '../utilities/utilities.service';

@Module({
  imports: [HttpModule],
  providers: [
    ResponseNarrativeService,
    ConfigService,
    RequestPreparerService,
    UtilitiesService,
    TokenRefresherService,
  ],
  exports: [ResponseNarrativeService],
})
export class ResponseNarrativeModule {}
