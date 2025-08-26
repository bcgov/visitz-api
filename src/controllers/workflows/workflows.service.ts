import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import { SubmitNotesWorkflowEntity } from '../../entities/submit-notes-workflow.entity';
import { SubmitNotesWorkflowDto } from '../../dto/workflow-submit-notes.dto';
import { CONTENT_TYPE } from '../../common/constants/parameter-constants';
import {
  trustedIdirHeaderName,
  stringNull,
} from '../../common/constants/upstream-constants';
import { SafetyAssessmentWorkflowDto } from '../../dto/workflow-submit-safety-assessment.dto';
import { SubmitSafetyAssessmentWorkflowEntity } from '../../entities/submit-safety-assessment.entity';

@Injectable()
export class WorkflowsService {
  submitNotesMessageType: string;
  submitNotesIntObjectName: string;
  submitNotesIntObjectFormat: string;
  submitNotesRequestParentFieldName: string;
  submitNotesWorkspace: string | undefined;
  submitNotesUrl: string;

  safetyAssesmentOperation: string;
  safetyAssessmentMessageType: string;
  safetyAssessmentIntObjectName: string;
  safetyAssessmentIntObjectFormat: string;
  safetyAssessmentRequestParentFieldListName: string;
  safetyAssessmentRequestParentFieldName: string;
  safetyAssessmentWorkspace: string | undefined;
  safetyAssessmentUrl: string;

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
      this.configService.get<string>('endpointUrls.workflowBaseUrl') +
        this.configService.get<string>('endpointUrls.submitNotesWorkflow'),
    );
    this.submitNotesWorkspace = this.configService.get(
      'workspaces.submitNotesWorkflow',
    );

    this.safetyAssesmentOperation = this.configService.get<string>(
      'workflowParameters.safetyAssessment.operation',
    );
    this.safetyAssessmentMessageType = this.configService.get<string>(
      'workflowParameters.safetyAssessment.messageType',
    );
    this.safetyAssessmentIntObjectName = this.configService.get<string>(
      'workflowParameters.safetyAssessment.intObjectName',
    );
    this.safetyAssessmentIntObjectFormat = this.configService.get<string>(
      'workflowParameters.safetyAssessment.intObjectFormat',
    );
    this.safetyAssessmentRequestParentFieldListName =
      this.configService.get<string>(
        'workflowParameters.safetyAssessment.requestParentFieldListName',
      );
    this.safetyAssessmentRequestParentFieldName =
      this.configService.get<string>(
        'workflowParameters.safetyAssessment.requestParentFieldName',
      );
    this.safetyAssessmentUrl = encodeURI(
      this.configService.get<string>('endpointUrls.workflowBaseUrl') +
        this.configService.get<string>('endpointUrls.safetyAssessmentWorkflow'),
    );
    this.safetyAssessmentWorkspace = this.configService.get(
      'workspaces.safetyAssessmentWorkflow',
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

  async submitSafetyAssessmentWorkflow(
    assessmentDto: SafetyAssessmentWorkflowDto,
    idir: string,
  ): Promise<SubmitSafetyAssessmentWorkflowEntity> {
    for (const payloadObj of assessmentDto.Payload) {
      payloadObj['workerId'] = idir;
      payloadObj['operation'] = this.safetyAssesmentOperation;
    }
    assessmentDto['ListOfPayload'] = { Payload: assessmentDto.Payload };
    delete assessmentDto.Payload;

    assessmentDto['ListOffactorInfluence'] = {
      factorInfluence: assessmentDto.factorInfluence,
    };
    delete assessmentDto.factorInfluence;

    assessmentDto['ListOfsafetyFactors'] = {
      safetyFactors: assessmentDto.safetyFactors,
    };
    delete assessmentDto.safetyFactors;

    assessmentDto['ListOfprotectiveCapacity'] = {
      protectiveCapacity: assessmentDto.protectiveCapacity,
    };
    delete assessmentDto.protectiveCapacity;

    assessmentDto['ListOfsafetyInterventions'] = {
      safetyInterventions: assessmentDto.safetyInterventions,
    };
    delete assessmentDto.safetyInterventions;

    assessmentDto['ListOfsafetyDecisions'] = {
      safetyDecisions: assessmentDto.safetyDecisions,
    };
    delete assessmentDto.safetyDecisions;

    if (assessmentDto.childsInOutCare !== undefined) {
      assessmentDto['ListOfchildsInOutCare'] = {
        childsInOutCare: assessmentDto.childsInOutCare,
      };
      delete assessmentDto.childsInOutCare;
    }

    const body = {
      InputMessage: {
        MessageId: stringNull,
        MessageType: this.safetyAssessmentMessageType,
        IntObjectName: this.safetyAssessmentIntObjectName,
        IntObjectFormat: this.safetyAssessmentIntObjectFormat,
        [this.safetyAssessmentRequestParentFieldListName]: {
          [this.safetyAssessmentRequestParentFieldName]: [{ ...assessmentDto }],
        },
      },
    };
    const headers = {
      'Content-Type': CONTENT_TYPE,
      [trustedIdirHeaderName]: idir,
    };
    const params = {};
    if (this.safetyAssessmentWorkspace !== undefined) {
      params['workspace'] = this.safetyAssessmentWorkspace;
    }
    const response = await this.requestPreparerService.sendPostRequest(
      this.safetyAssessmentUrl,
      body,
      headers,
      params,
    );
    return new SubmitSafetyAssessmentWorkflowEntity(response.data);
  }
}
