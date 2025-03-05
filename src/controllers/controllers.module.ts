import { Module } from '@nestjs/common';
import { CasesModule } from './cases/cases.module';
import { IncidentsModule } from './incidents/incidents.module';
import { ServiceRequestsModule } from './service-requests/service-requests.module';
import { MemosModule } from './memos/memos.module';
import { CaseloadModule } from './caseload/caseload.module';
import { ExternalAuthModule } from './external-auth/external-auth.module';

@Module({
  imports: [
    CasesModule,
    IncidentsModule,
    ServiceRequestsModule,
    MemosModule,
    CaseloadModule,
    ExternalAuthModule,
  ],
})
export class ControllersModule {}
