import { Controller, Get, Param, Query } from '@nestjs/common';
import { CasesService } from './cases.service';

@Controller('case')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Get(':id/supportnetwork')
  getSingleCaseSupportNetworkInformationRecord(
    @Param('id') id: string,
    @Query('since') since: string,
  ) {
    return this.casesService.getSingleCaseSupportNetworkInformationRecord(
      id,
      since,
    );
  }
}
