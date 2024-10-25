import { Module } from '@nestjs/common';
import { SupportNetworkService } from './support-network/support-network.service';
import { SupportNetworkModule } from './support-network/support-network.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { UtilitiesModule } from './utilities/utilities.module';
import { UtilitiesService } from './utilities/utilities.service';

@Module({
  imports: [SupportNetworkModule, HttpModule, ConfigModule, UtilitiesModule],
  providers: [SupportNetworkService, UtilitiesService],
  exports: [SupportNetworkService, UtilitiesService],
})
export class HelpersModule {}
