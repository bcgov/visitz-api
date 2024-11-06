import { Module } from '@nestjs/common';
import { RequestPreparerService } from './request-preparer/request-preparer.service';
import { TokenRefresherService } from './token-refresher/token-refresher.service';
import { UtilitiesModule } from '../helpers/utilities/utilities.module';
import { HttpModule } from '@nestjs/axios';
import { TokenRefresherModule } from './token-refresher/token-refresher.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UtilitiesModule, HttpModule, TokenRefresherModule, ConfigModule],
  providers: [RequestPreparerService, TokenRefresherService],
  exports: [RequestPreparerService, TokenRefresherService],
})
export class ExternalApiModule {}
