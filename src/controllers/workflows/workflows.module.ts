import { Module } from '@nestjs/common';
import { WorkflowsService } from './workflows.service';
import { WorkflowsController } from './workflows.controller';
import { ConfigService } from '@nestjs/config';
import { TokenRefresherService } from '../../external-api/token-refresher/token-refresher.service';
import { HttpModule } from '@nestjs/axios';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import { UtilitiesService } from '../../helpers/utilities/utilities.service';
import { AuthService } from '../../common/guards/auth/auth.service';
import { WorkflowAuthService } from '../../common/guards/workflow-auth/workflow-auth.service';

@Module({
  providers: [
    WorkflowsService,
    AuthService,
    WorkflowAuthService,
    ConfigService,
    TokenRefresherService,
    RequestPreparerService,
    UtilitiesService,
  ],
  controllers: [WorkflowsController],
  imports: [HttpModule],
})
export class WorkflowsModule {}
