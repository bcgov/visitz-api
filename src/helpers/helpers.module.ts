import { Module } from '@nestjs/common';
import { SupportNetworkService } from './support-network/support-network.service';
import { SupportNetworkModule } from './support-network/support-network.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { UtilitiesModule } from './utilities/utilities.module';
import { UtilitiesService } from './utilities/utilities.service';
import { TokenRefresherModule } from '../external-api/token-refresher/token-refresher.module';
import { TokenRefresherService } from '../external-api/token-refresher/token-refresher.service';
import { InPersonVisitsModule } from './in-person-visits/in-person-visits.module';
import { InPersonVisitsService } from './in-person-visits/in-person-visits.service';
import { RequestPreparerModule } from '../external-api/request-preparer/request-preparer.module';
import { RequestPreparerService } from '../external-api/request-preparer/request-preparer.service';
import { AttachmentsModule } from './attachments/attachments.module';
import { AttachmentsService } from './attachments/attachments.service';
import { ContactsModule } from './contacts/contacts.module';
import { ContactsService } from './contacts/contacts.service';
import { SafetyAssessmentModule } from './safety-assessment/safety-assessment.module';
import { SafetyAssessmentService } from './safety-assessment/safety-assessment.service';
import { VirusScanModule } from './virus-scan/virus-scan.module';
import { ResponseNarrativeModule } from './response-narrative/response-narrative.module';
import { ResponseNarrativeService } from './response-narrative/response-narrative.service';

@Module({
  imports: [
    SupportNetworkModule,
    HttpModule,
    ConfigModule,
    UtilitiesModule,
    TokenRefresherModule,
    InPersonVisitsModule,
    RequestPreparerModule,
    AttachmentsModule,
    ContactsModule,
    SafetyAssessmentModule,
    VirusScanModule,
    ResponseNarrativeModule,
  ],
  providers: [
    SupportNetworkService,
    UtilitiesService,
    TokenRefresherService,
    InPersonVisitsService,
    RequestPreparerService,
    AttachmentsService,
    ContactsService,
    SafetyAssessmentService,
    ResponseNarrativeService,
  ],
  exports: [
    SupportNetworkService,
    UtilitiesService,
    InPersonVisitsService,
    AttachmentsService,
    ContactsService,
    SafetyAssessmentService,
    ResponseNarrativeService,
  ],
})
export class HelpersModule {}
