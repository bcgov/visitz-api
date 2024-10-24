import { Module } from '@nestjs/common';
import { SupportNetworkService } from './support-network/support-network.service';
import { SupportNetworkModule } from './support-network/support-network.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { UtilitiesModule } from './utilities/utilities.module';

@Module({
  imports: [SupportNetworkModule, HttpModule, ConfigModule, UtilitiesModule],
  providers: [SupportNetworkService],
})
export class HelpersModule {}
