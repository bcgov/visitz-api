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
  ],
  providers: [
    SupportNetworkService,
    UtilitiesService,
    TokenRefresherService,
    InPersonVisitsService,
    RequestPreparerService,
    AttachmentsService,
  ],
  exports: [
    SupportNetworkService,
    UtilitiesService,
    InPersonVisitsService,
    AttachmentsService,
  ],
})
export class HelpersModule {}
