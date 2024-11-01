import { Module } from '@nestjs/common';
import { InPersonVisitsService } from './in-person-visits.service';

@Module({
  providers: [InPersonVisitsService],
})
export class InPersonVisitsModule {}
