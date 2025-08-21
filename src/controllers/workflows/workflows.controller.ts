import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { CONTENT_TYPE } from '../../common/constants/parameter-constants';
import { ApiUnprocessableEntityErrorEntity } from '../../entities/api-unprocessable-entity-error.entity';
import { WorkflowsService } from './workflows.service';
import { versionInfo } from '../../common/constants/swagger-constants';
import {
  SubmitNotesResponseExample,
  SubmitNotesWorkflowEntity,
} from '../../entities/submit-notes-workflow.entity';
import { SubmitNotesWorkflowDto } from '../../dto/workflow-submit-notes.dto';
import { idirUsernameHeaderField } from '../../common/constants/upstream-constants';
import { WorkflowAuthGuard } from '../../common/guards/workflow-auth/workflow-auth.guard';
import { ApiBadRequestErrorEntity } from '../../entities/api-bad-request-error.entity';
import { ApiForbiddenErrorEntity } from '../../entities/api-forbidden-error.entity';
import { ApiInternalServerErrorEntity } from '../../entities/api-internal-server-error.entity';
import { ApiUnauthorizedErrorEntity } from '../../entities/api-unauthorized-error.entity';

@Controller('wf')
@ApiParam(versionInfo)
@ApiBadRequestResponse({ type: ApiBadRequestErrorEntity })
@ApiUnauthorizedResponse({ type: ApiUnauthorizedErrorEntity })
@ApiForbiddenResponse({ type: ApiForbiddenErrorEntity })
@ApiInternalServerErrorResponse({ type: ApiInternalServerErrorEntity })
@UseGuards(WorkflowAuthGuard)
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post(`submit-notes`)
  @ApiOperation({
    description: 'Submit a note using DIONA workflow',
  })
  @ApiBody({
    description: `Notes information.`,
    type: SubmitNotesWorkflowDto,
  })
  @ApiCreatedResponse({
    content: {
      [CONTENT_TYPE]: {
        examples: {
          NoteCreatedResponse: {
            value: SubmitNotesResponseExample,
          },
        },
      },
    },
  })
  @ApiUnprocessableEntityResponse({ type: ApiUnprocessableEntityErrorEntity })
  async postWorkflowNotes(
    @Req() req: Request,
    @Body(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        whitelist: true,
      }),
    )
    notesDto: SubmitNotesWorkflowDto,
  ): Promise<SubmitNotesWorkflowEntity> {
    return await this.workflowsService.submitNotesWorkflow(
      notesDto,
      req.headers[idirUsernameHeaderField] as string,
    );
  }
}
