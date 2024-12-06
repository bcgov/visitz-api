import { Module } from '@nestjs/common';
import { CasesModule } from './cases/cases.module';
import { IncidentsModule } from './incidents/incidents.module';
import { ServiceRequestsModule } from './service-requests/service-requests.module';
import { MemosModule } from './memos/memos.module';

@Module({
  imports: [CasesModule, IncidentsModule, ServiceRequestsModule, MemosModule],
})
export class ControllersModule {}
