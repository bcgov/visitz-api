import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './configuration/configuration';
import { CommonModule } from './common/common.module';
import { ControllersModule } from './controllers/controllers.module';
import { HelpersModule } from './helpers/helpers.module';
import { LoggerModule } from 'nestjs-pino';
import { CacheModule } from '@nestjs/cache-manager';
import { ExternalApiModule } from './external-api/external-api.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        pinoHttp: {
          customSuccessObject: (req, res, loggableObject) => {
            return {
              ...loggableObject,
              buildNumber: configService.get('buildInfo.buildNumber'),
            };
          },
          customErrorObject: (req, res, loggableObject) => {
            return {
              ...loggableObject,
              buildNumber: configService.get('buildInfo.buildNumber'),
            };
          },
        },
      }),
    }),
    CacheModule.register({ isGlobal: true }),
    CommonModule,
    ControllersModule,
    HelpersModule,
    ExternalApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
