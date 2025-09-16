import { Module } from '@nestjs/common';
import { WorkflowAuthService } from './workflow-auth.service';

@Module({
  providers: [WorkflowAuthService],
})
export class WorkflowAuthModule {}
