import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SupportNetworkService } from './support-network.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import { RequestPreparerModule } from '../../external-api/request-preparer/request-preparer.module';
import { UtilitiesService } from '../utilities/utilities.service';
import { TokenRefresherService } from '../../external-api/token-refresher/token-refresher.service';

@Module({
  imports: [HttpModule, ConfigModule, RequestPreparerModule],
  providers: [
    SupportNetworkService,
    RequestPreparerService,
    UtilitiesService,
    TokenRefresherService,
    ConfigService,
  ],
  exports: [SupportNetworkService],
})
export class SupportNetworkModule {}
