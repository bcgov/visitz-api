import { Module } from '@nestjs/common';
import { UtilitiesService } from './utilities.service';

@Module({
  providers: [UtilitiesService],
})
export class UtilitiesModule {}
