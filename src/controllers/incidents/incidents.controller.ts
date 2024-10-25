import { Controller, Get, Param, Query } from '@nestjs/common';
import { IncidentsService } from './incidents.service';

@Controller('incident')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Get(':id/supportnetwork')
  getSingleCaseSupportNetworkInformationRecord(
    @Param('id') id: string,
    @Query('since') since: string,
  ) {
    return this.incidentsService.getSingleIncidentSupportNetworkInformationRecord(
      id,
      since,
    );
  }
}
