import { Injectable } from '@nestjs/common';
import { SupportNetworkService } from '../../helpers/support-network/support-network.service';
import { RecordType } from '../../common/constants/enumerations';
import {
  NestedSupportNetworkEntity,
  SupportNetworkEntity,
} from '../../entities/support-network.entity';
import {
  AttachmentIdPathParams,
  ContactIdPathParams,
  IdPathParams,
  SafetyAssessmentIdPathParams,
  SupportNetworkIdPathParams,
} from '../../dto/id-path-params.dto';
import {
  AttachmentDetailsQueryParams,
  FilterQueryParams,
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

@Injectable()
export class IncidentsService {
  constructor(
    private readonly supportNetworkService: SupportNetworkService,
    private readonly attachmentsService: AttachmentsService,
    private readonly contactsService: ContactsService,
    private readonly safetyAssessmentsService: SafetyAssessmentService,
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
    filter?: FilterQueryParams,
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
    filter?: FilterQueryParams,
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
    filter?: FilterQueryParams,
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
    filter?: FilterQueryParams,
  ): Promise<NestedSafetyAssessmentEntity> {
    return await this.safetyAssessmentsService.getListSafetyAssessmentRecord(
      RecordType.Incident,
      id,
      res,
      idir,
      filter,
    );
  }
}
