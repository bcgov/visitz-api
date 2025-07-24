import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import { SubmitNotesWorkflowEntity } from '../../entities/submit-notes-workflow.entity';
import { SubmitNotesWorkflowDto } from '../../dto/workflow-submit-notes.dto';
import { CONTENT_TYPE } from '../../common/constants/parameter-constants';
import { trustedIdirHeaderName } from '../../common/constants/upstream-constants';

@Injectable()
export class WorkflowsService {
  submitNotesMessageType: string;
  submitNotesIntObjectName: string;
  submitNotesIntObjectFormat: string;
  submitNotesRequestParentFieldName: string;
  submitNotesWorkspace: string | undefined;
  submitNotesUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly requestPreparerService: RequestPreparerService,
  ) {
    this.submitNotesMessageType = this.configService.get<string>(
      'workflowParameters.submitNotes.messageType',
    );
    this.submitNotesIntObjectName = this.configService.get<string>(
      'workflowParameters.submitNotes.intObjectName',
    );
    this.submitNotesIntObjectFormat = this.configService.get<string>(
      'workflowParameters.submitNotes.intObjectFormat',
    );
    this.submitNotesRequestParentFieldName = this.configService.get<string>(
      'workflowParameters.submitNotes.requestParentFieldName',
    );
    this.submitNotesUrl = encodeURI(
      this.configService.get<string>('endpointUrls.baseUrl') +
        this.configService.get<string>('endpointUrls.submitNotesWorkflow'),
    );
    this.submitNotesWorkspace = this.configService.get(
      'workspaces.submitNotesWorkflow',
    );
  }

  async submitNotesWorkflow(
    notesDto: SubmitNotesWorkflowDto,
    idir: string,
  ): Promise<SubmitNotesWorkflowEntity> {
    for (const submitNotesObj of notesDto.RequestSubmitNotes) {
      submitNotesObj['LengthOfNotes'] = submitNotesObj.notes.length.toString();
    }
    const body = {
      InboundMessage: {
        MessageType: this.submitNotesMessageType,
        IntObjectName: this.submitNotesIntObjectName,
        IntObjectFormat: this.submitNotesIntObjectFormat,
        [this.submitNotesRequestParentFieldName]: notesDto,
      },
    };
    const headers = {
      'Content-Type': CONTENT_TYPE,
      [trustedIdirHeaderName]: idir,
    };
    const params = {};
    if (this.submitNotesWorkspace !== undefined) {
      params['workspace'] = this.submitNotesWorkspace;
    }
    const response = await this.requestPreparerService.sendPostRequest(
      this.submitNotesUrl,
      body,
      headers,
      params,
    );
    return new SubmitNotesWorkflowEntity(response.data);
  }
}
