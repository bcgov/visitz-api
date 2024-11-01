import { Module } from '@nestjs/common';
import { CasesService } from './cases.service';
import { CasesController } from './cases.controller';
import { HelpersModule } from '../../helpers/helpers.module';

@Module({
  providers: [CasesService],
  controllers: [CasesController],
  imports: [HelpersModule],
})
export class CasesModule {}
