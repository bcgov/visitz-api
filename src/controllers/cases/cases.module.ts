import { Module } from '@nestjs/common';
import { CasesService } from './cases.service';
import { CasesController } from './cases.controller';
import { SupportNetworkModule } from '../../helpers/support-network/support-network.module';

@Module({
  providers: [CasesService],
  controllers: [CasesController],
  imports: [SupportNetworkModule],
})
export class CasesModule {}
