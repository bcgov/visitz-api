import { Module } from '@nestjs/common';
import { ExternalAuthController } from './external-auth.controller';
import { ExternalAuthService } from './external-auth.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from '../../common/guards/auth/auth.module';
import { AuthService } from '../../common/guards/auth/auth.service';
import { TokenRefresherService } from '../../external-api/token-refresher/token-refresher.service';
import { HelpersModule } from '../../helpers/helpers.module';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';

@Module({
  providers: [
    ExternalAuthService,
    AuthService,
    ConfigService,
    UtilitiesService,
    TokenRefresherService,
  ],
  imports: [HelpersModule, AuthModule, HttpModule],
  controllers: [ExternalAuthController],
})
export class ExternalAuthModule {}
