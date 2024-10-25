import { Controller, Get, Param, Query } from '@nestjs/common';
import { ServiceRequestsService } from './service-requests.service';

@Controller('sr')
export class ServiceRequestsController {
  constructor(private readonly serviceRequestService: ServiceRequestsService) {}

  @Get(':id/supportnetwork')
  getSingleCaseSupportNetworkInformationRecord(
    @Param('id') id: string,
    @Query('since') since: string,
  ) {
    return this.serviceRequestService.getSingleSRSupportNetworkInformationRecord(
      id,
      since,
    );
  }
}
