import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SupportNetworkService } from './support-network.service';
import { ConfigModule } from '@nestjs/config';
import { UtilitiesModule } from '../../helpers/utilities/utilities.module';
import { UtilitiesService } from '../utilities/utilities.service';
import { TokenRefresherModule } from '../token-refresher/token-refresher.module';
import { TokenRefresherService } from '../token-refresher/token-refresher.service';

@Module({
  imports: [HttpModule, ConfigModule, UtilitiesModule, TokenRefresherModule],
  providers: [SupportNetworkService, UtilitiesService, TokenRefresherService],
  exports: [SupportNetworkService],
})
export class SupportNetworkModule {}
