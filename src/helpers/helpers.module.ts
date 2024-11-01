import { Module } from '@nestjs/common';
import { SupportNetworkService } from './support-network/support-network.service';
import { SupportNetworkModule } from './support-network/support-network.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { UtilitiesModule } from './utilities/utilities.module';
import { UtilitiesService } from './utilities/utilities.service';
import { TokenRefresherModule } from './token-refresher/token-refresher.module';
import { TokenRefresherService } from './token-refresher/token-refresher.service';
import { InPersonVisitsModule } from './in-person-visits/in-person-visits.module';
import { InPersonVisitsService } from './in-person-visits/in-person-visits.service';

@Module({
  imports: [
    SupportNetworkModule,
    HttpModule,
    ConfigModule,
    UtilitiesModule,
    TokenRefresherModule,
    InPersonVisitsModule,
  ],
  providers: [
    SupportNetworkService,
    UtilitiesService,
    TokenRefresherService,
    InPersonVisitsService,
  ],
  exports: [
    SupportNetworkService,
    UtilitiesService,
    TokenRefresherService,
    InPersonVisitsService,
  ],
})
export class HelpersModule {}
