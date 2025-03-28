import { Module } from '@nestjs/common';
import { SafetyAssessmentService } from './safety-assessment.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import { TokenRefresherService } from '../../external-api/token-refresher/token-refresher.service';
import { UtilitiesService } from '../utilities/utilities.service';

@Module({
  imports: [HttpModule],
  providers: [
    SafetyAssessmentService,
    ConfigService,
    RequestPreparerService,
    UtilitiesService,
    TokenRefresherService,
  ],
  exports: [SafetyAssessmentService],
})
export class SafetyAssessmentModule {}
