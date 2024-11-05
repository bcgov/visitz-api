import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from './auth.service';
import { UtilitiesModule } from '../../../helpers/utilities/utilities.module';
import { UtilitiesService } from '../../../helpers/utilities/utilities.service';
import { TokenRefresherService } from '../../../helpers/token-refresher/token-refresher.service';
import { TokenRefresherModule } from '../../../helpers/token-refresher/token-refresher.module';

@Module({
  providers: [
    TokenRefresherService,
    AuthService,
    UtilitiesService,
    ConfigService,
  ],
  imports: [UtilitiesModule, HttpModule, TokenRefresherModule],
  exports: [AuthService],
})
export class AuthModule {}
