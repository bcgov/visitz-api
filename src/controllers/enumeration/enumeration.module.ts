import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnumerationService } from './enumeration.service';
import { EnumerationController } from './enumeration.controller';
import { ExternalApiModule } from '../../external-api/external-api.module';
import { UtilitiesModule } from '../../helpers/utilities/utilities.module';

@Module({
  providers: [EnumerationService, ConfigService],
  controllers: [EnumerationController],
  imports: [ExternalApiModule, UtilitiesModule],
})
export class EnumerationModule {}
