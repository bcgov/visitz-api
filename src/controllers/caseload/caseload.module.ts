import { Module } from '@nestjs/common';
import { CaseloadService } from './caseload.service';
import { CaseloadController } from './caseload.controller';

@Module({
  providers: [CaseloadService],
  controllers: [CaseloadController],
})
export class CaseloadModule {}
