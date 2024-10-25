import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ServiceRequestsService } from './service-requests.service';
import {
  NestedSupportNetworkEntity,
  SupportNetworkEntity,
} from '../../entities/support-network.entity';

@Controller('sr')
export class ServiceRequestsController {
  constructor(private readonly serviceRequestService: ServiceRequestsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id/supportnetwork')
  getSingleCaseSupportNetworkInformationRecord(
    @Param('id') id: string,
    @Query('since') since: string,
  ): Promise<SupportNetworkEntity | NestedSupportNetworkEntity> {
    return this.serviceRequestService.getSingleSRSupportNetworkInformationRecord(
      id,
      since,
    );
  }
}
