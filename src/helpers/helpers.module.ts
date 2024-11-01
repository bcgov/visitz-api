import { Module } from '@nestjs/common';
import { SupportNetworkService } from './support-network/support-network.service';
import { SupportNetworkModule } from './support-network/support-network.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { UtilitiesModule } from './utilities/utilities.module';
import { UtilitiesService } from './utilities/utilities.service';
import { TokenRefresherModule } from './token-refresher/token-refresher.module';
import { TokenRefresherService } from './token-refresher/token-refresher.service';

@Module({
  imports: [
    SupportNetworkModule,
    HttpModule,
    ConfigModule,
    UtilitiesModule,
    TokenRefresherModule,
  ],
  providers: [SupportNetworkService, UtilitiesService, TokenRefresherService],
  exports: [SupportNetworkService, UtilitiesService, TokenRefresherService],
})
export class HelpersModule {}
