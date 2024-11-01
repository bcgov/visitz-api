import { Module } from '@nestjs/common';
import { ServiceRequestsService } from './service-requests.service';
import { ServiceRequestsController } from './service-requests.controller';
import { HelpersModule } from '../../helpers/helpers.module';

@Module({
  providers: [ServiceRequestsService],
  controllers: [ServiceRequestsController],
  imports: [HelpersModule],
})
export class ServiceRequestsModule {}
