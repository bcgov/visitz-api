import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SupportNetworkService } from './support-network.service';
import { ConfigModule } from '@nestjs/config';
import { UtilitiesModule } from '../../helpers/utilities/utilities.module';
import { UtilitiesService } from '../utilities/utilities.service';

@Module({
  imports: [HttpModule, ConfigModule, UtilitiesModule],
  providers: [SupportNetworkService, UtilitiesService],
  exports: [SupportNetworkService],
})
export class SupportNetworkModule {}
