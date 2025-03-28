import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServiceRequestsService } from './service-requests.service';
import { ServiceRequestsController } from './service-requests.controller';
import { HelpersModule } from '../../helpers/helpers.module';
import { AuthModule } from '../../common/guards/auth/auth.module';
import { AuthService } from '../../common/guards/auth/auth.service';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';
import { TokenRefresherService } from '../../external-api/token-refresher/token-refresher.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  providers: [
    ServiceRequestsService,
    AuthService,
    ConfigService,
    UtilitiesService,
    TokenRefresherService,
  ],
  controllers: [ServiceRequestsController],
  imports: [
    HelpersModule,
    AuthModule,
    HttpModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        limits: {
          fileSize: configService.get<number>('fileUpload.maxFileSizeBytes'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class ServiceRequestsModule {}
