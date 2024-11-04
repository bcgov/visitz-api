import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
    LoggerModule.forRoot(),
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
