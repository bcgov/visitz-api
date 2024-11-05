import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { UtilitiesModule } from '../helpers/utilities/utilities.module';
import { UtilitiesService } from '../helpers/utilities/utilities.service';
import { AuthService } from './guards/auth/auth.service';
import { AuthModule } from './guards/auth/auth.module';
import { TokenRefresherModule } from '../helpers/token-refresher/token-refresher.module';

@Module({
  providers: [UtilitiesService, AuthService, UtilitiesService, ConfigService],
  imports: [UtilitiesModule, AuthModule, HttpModule, TokenRefresherModule],
  exports: [AuthService],
})
export class CommonModule {}
