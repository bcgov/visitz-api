import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SupportNetworkService } from './support-network.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [SupportNetworkService],
  exports: [SupportNetworkService],
})
export class SupportNetworkModule {}
