import { Module } from '@nestjs/common';
import { CasesService } from './cases.service';
import { CasesController } from './cases.controller';
import { HelpersModule } from '../../helpers/helpers.module';
import { AuthModule } from '../../common/guards/auth/auth.module';
import { AuthService } from '../../common/guards/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [CasesService, AuthService, ConfigService, UtilitiesService],
  controllers: [CasesController],
  imports: [HelpersModule, AuthModule, HttpModule],
})
export class CasesModule {}
