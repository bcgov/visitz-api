import { Module } from '@nestjs/common';
import { RequestPreparerService } from './request-preparer.service';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';
import { UtilitiesModule } from '../../helpers/utilities/utilities.module';
import { TokenRefresherService } from '../token-refresher/token-refresher.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [UtilitiesModule, HttpModule],
  providers: [
    RequestPreparerService,
    UtilitiesService,
    TokenRefresherService,
    ConfigService,
  ],
  exports: [RequestPreparerService],
})
export class RequestPreparerModule {}
