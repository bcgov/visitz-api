import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { IncidentsService } from './incidents.service';
import { IncidentsController } from './incidents.controller';
import { HelpersModule } from '../../helpers/helpers.module';
import { AuthModule } from '../../common/guards/auth/auth.module';
import { AuthService } from '../../common/guards/auth/auth.service';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';

@Module({
  providers: [IncidentsService, AuthService, ConfigService, UtilitiesService],
  controllers: [IncidentsController],
  imports: [HelpersModule, AuthModule, HttpModule],
})
export class IncidentsModule {}
