import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import {
  NestedSupportNetworkEntity,
  SupportNetworkEntity,
} from '../../entities/support-network.entity';

@Controller('incident')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id/supportnetwork')
  async getSingleCaseSupportNetworkInformationRecord(
    @Param('id') id: string,
    @Query('since') since: string,
  ): Promise<SupportNetworkEntity | NestedSupportNetworkEntity> {
    return this.incidentsService.getSingleIncidentSupportNetworkInformationRecord(
      id,
      since,
    );
  }
}
