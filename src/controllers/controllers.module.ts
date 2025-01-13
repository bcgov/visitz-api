import { Module } from '@nestjs/common';
import { CasesModule } from './cases/cases.module';
import { IncidentsModule } from './incidents/incidents.module';
import { ServiceRequestsModule } from './service-requests/service-requests.module';
import { MemosModule } from './memos/memos.module';
import { CaseloadModule } from './caseload/caseload.module';

@Module({
  imports: [
    CasesModule,
    IncidentsModule,
    ServiceRequestsModule,
    MemosModule,
    CaseloadModule,
  ],
})
export class ControllersModule {}
