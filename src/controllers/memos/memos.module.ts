import { Module } from '@nestjs/common';
import { MemosService } from './memos.service';
import { MemosController } from './memos.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from '../../common/guards/auth/auth.service';
import { TokenRefresherService } from '../../external-api/token-refresher/token-refresher.service';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from '../../common/guards/auth/auth.module';
import { HelpersModule } from '../../helpers/helpers.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  providers: [
    MemosService,
    AuthService,
    ConfigService,
    UtilitiesService,
    TokenRefresherService,
  ],
  controllers: [MemosController],
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
export class MemosModule {}
