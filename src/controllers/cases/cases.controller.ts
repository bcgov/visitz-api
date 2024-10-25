import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CasesService } from './cases.service';
import {
  NestedSupportNetworkEntity,
  SupportNetworkEntity,
} from '../../entities/support-network.entity';

@Controller('case')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id/supportnetwork')
  getSingleCaseSupportNetworkInformationRecord(
    @Param('id') id: string,
    @Query('since') since: string,
  ): Promise<SupportNetworkEntity | NestedSupportNetworkEntity> {
    return this.casesService.getSingleCaseSupportNetworkInformationRecord(
      id,
      since,
    );
  }
}
