import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from './auth.service';
import { UtilitiesModule } from '../../../helpers/utilities/utilities.module';
import { UtilitiesService } from '../../../helpers/utilities/utilities.service';

@Module({
  providers: [AuthService, UtilitiesService, ConfigService],
  imports: [UtilitiesModule, HttpModule],
  exports: [AuthService],
})
export class AuthModule {}
