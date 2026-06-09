import { Injectable } from '@nestjs/common';
import { SupportNetworkService } from '../../helpers/support-network/support-network.service';
import { EntityType, RecordType } from '../../common/constants/enumerations';
import {
  NestedSupportNetworkEntity,
  SupportNetworkEntity,
} from '../../entities/support-network.entity';
import {
  ActivityIdPathParams,
  AdditionalInformationIdPathParams,
  AttachmentIdPathParams,
  CallInformationIdPathParams,
  ContactEducationIdPathParams,
  ContactIdPathParams,
  ContactLanguagesIdPathParams,
  ContactLegalAuthorityIdPathParams,
  ContactMedicalBehavioralIdPathParams,
  IdPathParams,
  ResponseNarrativeIdPathParams,
  SupportNetworkIdPathParams,
} from '../../dto/id-path-params.dto';
import {
  AttachmentDetailsQueryParams,
  CheckIdQueryParams,
} from '../../dto/filter-query-params.dto';
import { AttachmentsService } from '../../helpers/attachments/attachments.service';
import { srAttachmentsFieldName } from '../../common/constants/parameter-constants';
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
import { PostAttachmentDto } from '../../dto/post-attachment.dto';
import {
  ResponseNarrativeEntity,
  NestedResponseNarrativeEntity,
} from '../../entities/response-narrative.entity';
import { ResponseNarrativeService } from '../../helpers/response-narrative/response-narrative.service';
import {
  CallInformationEntity,
  NestedCallInformationEntity,
} from '../../entities/call-information.entity';
import {
  AdditionalInformationEntity,
  NestedAdditionalInformationEntity,
} from '../../entities/additional-information.entity';
import { AdditionalInformationService } from '../../helpers/additional-information/additional-information.service';
import { CallInformationService } from '../../helpers/call-information/call-information.service';
import {
  contactLanguagesType,
  stringNull,
} from '../../common/constants/upstream-constants';
import {
  PostSupportNetworkDto,
  PostSupportNetworkDtoUpstream,
} from '../../dto/post-support-network.dto';
import {
  ContactLanguagesEntity,
  NestedContactLanguagesEntity,
} from '../../entities/contact-languages.entity';
import {
  PostContactLanguagesDto,
  PostContactLanguagesDtoUpstream,
} from '../../dto/post-contact-languages.dto';
import {
  ContactMedicalBehavioralEntity,
  NestedContactMedicalBehavioralEntity,
} from '../../entities/contact-medical-behavioral.entity';
import {
  ContactEducationEntity,
  NestedContactEducationEntity,
} from '../../entities/contact-education.entity';
import {
  ContactLegalAuthorityEntity,
  NestedContactLegalAuthorityEntity,
} from '../../entities/contact-legals.entity';
import {
  ActivitiesEntity,
  NestedActivitiesEntity,
} from '../../entities/activities.entity';
import { ActivitiesService } from '../../helpers/activities/activities.service';
import {
  PostActivityDto,
  PostActivityDtoUpstream,
} from '../../dto/post-activity.dto';
import {
  PostContactEducationDto,
  PostContactEducationDtoUpstream,
} from '../../dto/post-contact-education.dto';

@Injectable()
export class ServiceRequestsService {
  constructor(
    private readonly supportNetworkService: SupportNetworkService,
    private readonly attachmentsService: AttachmentsService,
    private readonly contactsService: ContactsService,
    private readonly responseNarrativesService: ResponseNarrativeService,
    private readonly callInformationService: CallInformationService,
    private readonly additionalInformationService: AdditionalInformationService,
    private readonly activitiesService: ActivitiesService,
  ) {}

  async getSingleSRSupportNetworkInformationRecord(
    id: SupportNetworkIdPathParams,
    res: Response,
    idir: string,
  ): Promise<SupportNetworkEntity> {
    return await this.supportNetworkService.getSingleSupportNetworkInformationRecord(
      RecordType.SR,
      id,
      res,
      idir,
    );
  }

  async getListSRSupportNetworkInformationRecord(
    id: IdPathParams,
    res: Response,
    idir: string,
    filter?: CheckIdQueryParams,
  ): Promise<NestedSupportNetworkEntity> {
    return await this.supportNetworkService.getListSupportNetworkInformationRecord(
      RecordType.SR,
      id,
      res,
      idir,
      filter,
    );
  }

  async getSingleSRAttachmentRecord(
    id: IdPathParams,
    res: Response,
    idir: string,
    filter?: CheckIdQueryParams,
  ): Promise<NestedAttachmentsEntity> {
    return await this.attachmentsService.getSingleAttachmentRecord(
      RecordType.SR,
      id,
      srAttachmentsFieldName,
      res,
      idir,
      filter,
    );
  }

  async getSingleSRAttachmentDetailsRecord(
    id: AttachmentIdPathParams,
    res: Response,
    idir: string,
    filter?: AttachmentDetailsQueryParams,
  ): Promise<AttachmentDetailsEntity> {
    return await this.attachmentsService.getSingleAttachmentDetailsRecord(
      RecordType.SR,
      id,
      srAttachmentsFieldName,
      res,
      idir,
      filter,
    );
  }

  async postSingleSRAttachmentRecord(
    attachmentsDto: PostAttachmentDto,
    idir: string,
    id: IdPathParams,
    file: Express.Multer.File,
  ): Promise<NestedAttachmentsEntity> {
    return await this.attachmentsService.postSingleAttachmentRecord(
      RecordType.SR,
      attachmentsDto,
      idir,
      id,
      file,
    );
  }

  async getSingleSRContactRecord(
    id: ContactIdPathParams,
    res: Response,
    idir: string,
  ): Promise<ContactsEntity> {
    return await this.contactsService.getSingleContactRecord(
      RecordType.SR,
      id,
      res,
      idir,
    );
  }

  async getListSRContactRecord(
    id: IdPathParams,
    res: Response,
    idir: string,
    filter?: CheckIdQueryParams,
  ): Promise<NestedContactsEntity> {
    return await this.contactsService.getListContactRecord(
      RecordType.SR,
      id,
      res,
      idir,
      filter,
    );
  }

  async getSingleSRResponseNarrativeRecord(
    id: ResponseNarrativeIdPathParams,
    res: Response,
    idir: string,
  ): Promise<ResponseNarrativeEntity> {
    return await this.responseNarrativesService.getSingleResponseNarrativeRecord(
      RecordType.SR,
      id,
      res,
      idir,
    );
  }

  async getListSRResponseNarrativeRecord(
    id: IdPathParams,
    res: Response,
    idir: string,
    filter?: CheckIdQueryParams,
  ): Promise<NestedResponseNarrativeEntity> {
    return await this.responseNarrativesService.getListResponseNarrativeRecord(
      RecordType.SR,
      id,
      res,
      idir,
      filter,
    );
  }

  async getSingleSRCallInformationRecord(
    id: CallInformationIdPathParams,
    res: Response,
    idir: string,
  ): Promise<CallInformationEntity> {
    return await this.callInformationService.getSingleCallInformationRecord(
      RecordType.SR,
      id,
      res,
      idir,
    );
  }

  async getListSRCallInformationRecord(
    id: IdPathParams,
    res: Response,
    idir: string,
    filter?: CheckIdQueryParams,
  ): Promise<NestedCallInformationEntity> {
    return await this.callInformationService.getListCallInformationRecord(
      RecordType.SR,
      id,
      res,
      idir,
      filter,
    );
  }

  async getSingleSRAdditionalInformationRecord(
    id: AdditionalInformationIdPathParams,
    res: Response,
    idir: string,
  ): Promise<AdditionalInformationEntity> {
    return await this.additionalInformationService.getSingleAdditionalInformationRecord(
      RecordType.SR,
      id,
      res,
      idir,
    );
  }

  async getListSRAdditionalInformationRecord(
    id: IdPathParams,
    res: Response,
    idir: string,
    filter?: CheckIdQueryParams,
  ): Promise<NestedAdditionalInformationEntity> {
    return await this.additionalInformationService.getListAdditionalInformationRecord(
      RecordType.SR,
      id,
      res,
      idir,
      filter,
    );
  }

  async postSingleSRSupportNetworkRecord(
    supportNetworkDto: PostSupportNetworkDto,
    idir: string,
    id: IdPathParams,
  ): Promise<NestedSupportNetworkEntity> {
    const baseObject = {
      ...supportNetworkDto,
      Id: stringNull,
      'Entity Id': id.rowId,
      'Entity Name': EntityType.SR,
    };
    const body = new PostSupportNetworkDtoUpstream(baseObject);
    return await this.supportNetworkService.postSingleSupportNetworkRecord(
      RecordType.SR,
      body,
      idir,
    );
  }

  async getSingleSRContactLanguagesRecord(
    id: ContactLanguagesIdPathParams,
    res: Response,
    idir: string,
  ): Promise<ContactLanguagesEntity> {
    return await this.contactsService.getSingleContactLanguagesRecord(
      RecordType.SR,
      id,
      res,
      idir,
    );
  }

  async getListSRContactLanguagesRecord(
    id: ContactIdPathParams,
    res: Response,
    idir: string,
    filter?: CheckIdQueryParams,
  ): Promise<NestedContactLanguagesEntity> {
    return await this.contactsService.getListContactLanguagesRecord(
      RecordType.SR,
      id,
      res,
      idir,
      filter,
    );
  }

  async postSingleSRContactLanguagesRecord(
    contactLanguagesDto: PostContactLanguagesDto,
    idir: string,
    id: ContactIdPathParams,
  ): Promise<NestedContactLanguagesEntity> {
    const baseObject = {
      ...contactLanguagesDto,
      Id: stringNull,
      Type: contactLanguagesType,
    };
    const body = new PostContactLanguagesDtoUpstream(baseObject);
    return await this.contactsService.postSingleContactLanguagesRecord(
      RecordType.SR,
      body,
      idir,
      id,
    );
  }

  async getSingleSRContactMedicalBehavioralRecord(
    id: ContactMedicalBehavioralIdPathParams,
    res: Response,
    idir: string,
  ): Promise<ContactMedicalBehavioralEntity> {
    return await this.contactsService.getSingleContactMedicalBehavioralRecord(
      RecordType.SR,
      id,
      res,
      idir,
    );
  }

  async getListSRContactMedicalBehavioralRecord(
    id: ContactIdPathParams,
    res: Response,
    idir: string,
    filter?: CheckIdQueryParams,
  ): Promise<NestedContactMedicalBehavioralEntity> {
    return await this.contactsService.getListContactMedicalBehavioralRecord(
      RecordType.SR,
      id,
      res,
      idir,
      filter,
    );
  }

  async getSingleSRContactEducationRecord(
    id: ContactEducationIdPathParams,
    res: Response,
    idir: string,
  ): Promise<ContactEducationEntity> {
    return await this.contactsService.getSingleContactEducationRecord(
      RecordType.SR,
      id,
      res,
      idir,
    );
  }

  async getListSRContactEducationRecord(
    id: ContactIdPathParams,
    res: Response,
    idir: string,
    filter?: CheckIdQueryParams,
  ): Promise<NestedContactEducationEntity> {
    return await this.contactsService.getListContactEducationRecord(
      RecordType.SR,
      id,
      res,
      idir,
      filter,
    );
  }

  async postSingleSRContactEducationRecord(
    contactEducationDto: PostContactEducationDto,
    idir: string,
    id: ContactIdPathParams,
  ): Promise<ContactEducationEntity> {
    const baseObject = {
      ...contactEducationDto,
      Id: stringNull,
    };
    const body = new PostContactEducationDtoUpstream(baseObject);
    return await this.contactsService.postSingleContactEducationRecord(
      RecordType.SR,
      body,
      idir,
      id,
    );
  }

  async getSingleSRContactLegalAuthorityRecord(
    id: ContactLegalAuthorityIdPathParams,
    res: Response,
    idir: string,
  ): Promise<ContactLegalAuthorityEntity> {
    return await this.contactsService.getSingleContactLegalAuthorityRecord(
      RecordType.SR,
      id,
      res,
      idir,
    );
  }

  async getListSRContactLegalAuthorityRecord(
    id: ContactIdPathParams,
    res: Response,
    idir: string,
    filter?: CheckIdQueryParams,
  ): Promise<NestedContactLegalAuthorityEntity> {
    return await this.contactsService.getListContactLegalAuthorityRecord(
      RecordType.SR,
      id,
      res,
      idir,
      filter,
    );
  }

  async getSingleSRActivityRecord(
    id: ActivityIdPathParams,
    res: Response,
    idir: string,
  ): Promise<ActivitiesEntity> {
    return await this.activitiesService.getSingleActivityRecord(
      RecordType.SR,
      id,
      res,
      idir,
    );
  }

  async getListSRActivityRecord(
    id: IdPathParams,
    res: Response,
    idir: string,
    filter?: CheckIdQueryParams,
  ): Promise<NestedActivitiesEntity> {
    return await this.activitiesService.getListActivityRecord(
      RecordType.SR,
      id,
      res,
      idir,
      filter,
    );
  }

  async postSingleSRActivityRecord(
    activityDto: PostActivityDto,
    idir: string,
    id: IdPathParams,
  ): Promise<ActivitiesEntity> {
    const baseObject = {
      ...activityDto,
      Id: stringNull,
      'ICM Type': EntityType.SR,
      'Activity SR Id': id.rowId,
      'Primary Owned By': idir,
    };
    const body = new PostActivityDtoUpstream(baseObject);
    return await this.activitiesService.postSingleActivityRecord(
      RecordType.SR,
      id,
      body,
      idir,
    );
  }
}
