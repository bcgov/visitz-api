import { Injectable } from '@nestjs/common';
import { SupportNetworkService } from '../../helpers/support-network/support-network.service';
import { EntityType, RecordType } from '../../common/constants/enumerations';
import {
  NestedSupportNetworkEntity,
  SupportNetworkEntity,
} from '../../entities/support-network.entity';
import {
  AdditionalInformationIdPathParams,
  AttachmentIdPathParams,
  CallInformationIdPathParams,
  ContactIdPathParams,
  IdPathParams,
  IncidentConcernIdPathParams,
  ResponseNarrativeIdPathParams,
  SafetyAssessmentIdPathParams,
  SupportNetworkIdPathParams,
} from '../../dto/id-path-params.dto';
import {
  AttachmentDetailsQueryParams,
  CheckIdQueryParams,
} from '../../dto/filter-query-params.dto';
import { AttachmentsService } from '../../helpers/attachments/attachments.service';
import { incidentsAttachmentsFieldName } from '../../common/constants/parameter-constants';
import {
  AttachmentDetailsEntity,
  NestedAttachmentsEntity,
} from '../../entities/attachments.entity';
import { Response } from 'express';
import {
  ContactsEntity,
  NestedContactsEntity,
} from '../../entities/contacts.entity';
import { ContactsService } from '../../helpers/contacts/contacts.service';
import {
  NestedSafetyAssessmentEntity,
  SafetyAssessmentEntity,
} from '../../entities/safety-assessment.entity';
import { SafetyAssessmentService } from '../../helpers/safety-assessment/safety-assessment.service';
import { PostAttachmentDto } from '../../dto/post-attachment.dto';
import {
  ResponseNarrativeEntity,
  NestedResponseNarrativeEntity,
} from '../../entities/response-narrative.entity';
import { ResponseNarrativeService } from '../../helpers/response-narrative/response-narrative.service';
import { IncidentConcernService } from '../../helpers/incident-concern/incident-concern.service';
import {
  IncidentConcernEntity,
  NestedIncidentConcernEntity,
} from '../../entities/incident-concern.entity';
import {
  CallInformationEntity,
  NestedCallInformationEntity,
} from '../../entities/call-information.entity';
import { CallInformationService } from '../../helpers/call-information/call-information.service';
import { AdditionalInformationService } from '../../helpers/additional-information/additional-information.service';
import {
  AdditionalInformationEntity,
  NestedAdditionalInformationEntity,
} from '../../entities/additional-information.entity';
import { stringNull } from '../../common/constants/upstream-constants';
import {
  PostSupportNetworkDto,
  PostSupportNetworkDtoUpstream,
} from '../../dto/post-support-network.dto';

@Injectable()
export class IncidentsService {
  constructor(
    private readonly supportNetworkService: SupportNetworkService,
    private readonly attachmentsService: AttachmentsService,
    private readonly contactsService: ContactsService,
    private readonly safetyAssessmentsService: SafetyAssessmentService,
    private readonly responseNarrativesService: ResponseNarrativeService,
    private readonly incidentConcernService: IncidentConcernService,
    private readonly callInformationService: CallInformationService,
    private readonly additionalInformationService: AdditionalInformationService,
  ) {}

  async getSingleIncidentSupportNetworkInformationRecord(
    id: SupportNetworkIdPathParams,
    res: Response,
    idir: string,
  ): Promise<SupportNetworkEntity> {
    return await this.supportNetworkService.getSingleSupportNetworkInformationRecord(
      RecordType.Incident,
      id,
      res,
      idir,
    );
  }

  async getListIncidentSupportNetworkInformationRecord(
    id: IdPathParams,
    res: Response,
    idir: string,
    filter?: CheckIdQueryParams,
  ): Promise<NestedSupportNetworkEntity> {
    return await this.supportNetworkService.getListSupportNetworkInformationRecord(
      RecordType.Incident,
      id,
      res,
      idir,
      filter,
    );
  }

  async getSingleIncidentAttachmentRecord(
    id: IdPathParams,
    res: Response,
    idir: string,
    filter?: CheckIdQueryParams,
  ): Promise<NestedAttachmentsEntity> {
    return await this.attachmentsService.getSingleAttachmentRecord(
      RecordType.Incident,
      id,
      incidentsAttachmentsFieldName,
      res,
      idir,
      filter,
    );
  }

  async getSingleIncidentAttachmentDetailsRecord(
    id: AttachmentIdPathParams,
    res: Response,
    idir: string,
    filter?: AttachmentDetailsQueryParams,
  ): Promise<AttachmentDetailsEntity> {
    return await this.attachmentsService.getSingleAttachmentDetailsRecord(
      RecordType.Incident,
      id,
      incidentsAttachmentsFieldName,
      res,
      idir,
      filter,
    );
  }

  async postSingleIncidentAttachmentRecord(
    attachmentsDto: PostAttachmentDto,
    idir: string,
    id: IdPathParams,
    file: Express.Multer.File,
  ): Promise<NestedAttachmentsEntity> {
    return await this.attachmentsService.postSingleAttachmentRecord(
      RecordType.Incident,
      attachmentsDto,
      idir,
      id,
      file,
    );
  }

  async getSingleIncidentContactRecord(
    id: ContactIdPathParams,
    res: Response,
    idir: string,
  ): Promise<ContactsEntity> {
    return await this.contactsService.getSingleContactRecord(
      RecordType.Incident,
      id,
      res,
      idir,
    );
  }

  async getListIncidentContactRecord(
    id: IdPathParams,
    res: Response,
    idir: string,
    filter?: CheckIdQueryParams,
  ): Promise<NestedContactsEntity> {
    return await this.contactsService.getListContactRecord(
      RecordType.Incident,
      id,
      res,
      idir,
      filter,
    );
  }

  async getSingleIncidentSafetyAssessmentRecord(
    id: SafetyAssessmentIdPathParams,
    res: Response,
    idir: string,
  ): Promise<SafetyAssessmentEntity> {
    return await this.safetyAssessmentsService.getSingleSafetyAssessmentRecord(
      RecordType.Incident,
      id,
      res,
      idir,
    );
  }

  async getListIncidentSafetyAssessmentRecord(
    id: IdPathParams,
    res: Response,
    idir: string,
    filter?: CheckIdQueryParams,
  ): Promise<NestedSafetyAssessmentEntity> {
    return await this.safetyAssessmentsService.getListSafetyAssessmentRecord(
      RecordType.Incident,
      id,
      res,
      idir,
      filter,
    );
  }

  async getSingleIncidentResponseNarrativeRecord(
    id: ResponseNarrativeIdPathParams,
    res: Response,
    idir: string,
  ): Promise<ResponseNarrativeEntity> {
    return await this.responseNarrativesService.getSingleResponseNarrativeRecord(
      RecordType.Incident,
      id,
      res,
      idir,
    );
  }

  async getListIncidentResponseNarrativeRecord(
    id: IdPathParams,
    res: Response,
    idir: string,
    filter?: CheckIdQueryParams,
  ): Promise<NestedResponseNarrativeEntity> {
    return await this.responseNarrativesService.getListResponseNarrativeRecord(
      RecordType.Incident,
      id,
      res,
      idir,
      filter,
    );
  }

  async getSingleIncidentConcernRecord(
    id: IncidentConcernIdPathParams,
    res: Response,
    idir: string,
  ): Promise<IncidentConcernEntity> {
    return await this.incidentConcernService.getSingleIncidentConcernRecord(
      RecordType.Incident,
      id,
      res,
      idir,
    );
  }

  async getListIncidentConcernRecord(
    id: IdPathParams,
    res: Response,
    idir: string,
    filter?: CheckIdQueryParams,
  ): Promise<NestedIncidentConcernEntity> {
    return await this.incidentConcernService.getListIncidentConcernRecord(
      RecordType.Incident,
      id,
      res,
      idir,
      filter,
    );
  }

  async getSingleIncidentCallInformationRecord(
    id: CallInformationIdPathParams,
    res: Response,
    idir: string,
  ): Promise<CallInformationEntity> {
    return await this.callInformationService.getSingleCallInformationRecord(
      RecordType.Incident,
      id,
      res,
      idir,
    );
  }

  async getListIncidentCallInformationRecord(
    id: IdPathParams,
    res: Response,
    idir: string,
    filter?: CheckIdQueryParams,
  ): Promise<NestedCallInformationEntity> {
    return await this.callInformationService.getListCallInformationRecord(
      RecordType.Incident,
      id,
      res,
      idir,
      filter,
    );
  }

  async getSingleIncidentAdditionalInformationRecord(
    id: AdditionalInformationIdPathParams,
    res: Response,
    idir: string,
  ): Promise<AdditionalInformationEntity> {
    return await this.additionalInformationService.getSingleAdditionalInformationRecord(
      RecordType.Incident,
      id,
      res,
      idir,
    );
  }

  async getListIncidentAdditionalInformationRecord(
    id: IdPathParams,
    res: Response,
    idir: string,
    filter?: CheckIdQueryParams,
  ): Promise<NestedAdditionalInformationEntity> {
    return await this.additionalInformationService.getListAdditionalInformationRecord(
      RecordType.Incident,
      id,
      res,
      idir,
      filter,
    );
  }

  async postSingleIncidentSupportNetworkRecord(
    supportNetworkDto: PostSupportNetworkDto,
    idir: string,
    id: IdPathParams,
  ): Promise<NestedSupportNetworkEntity> {
    const baseObject = {
      ...supportNetworkDto,
      Id: stringNull,
      'Entity Id': id.rowId,
      'Entity Name': EntityType.Incident,
    };
    const body = new PostSupportNetworkDtoUpstream(baseObject);
    return await this.supportNetworkService.postSingleSupportNetworkRecord(
      RecordType.Incident,
      body,
      idir,
    );
  }
}
