import { Module } from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import { IncidentsController } from './incidents.controller';
import { HelpersModule } from '../../helpers/helpers.module';

@Module({
  providers: [IncidentsService],
  controllers: [IncidentsController],
  imports: [HelpersModule],
})
export class IncidentsModule {}
