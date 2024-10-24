import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './configuration/configuration';
import { CommonModule } from './common/common.module';
import { ControllersModule } from './controllers/controllers.module';
import { HelpersModule } from './helpers/helpers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    CommonModule,
    ControllersModule,
    HelpersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
