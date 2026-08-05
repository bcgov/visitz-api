import { Injectable } from '@nestjs/common';
import { RecordType } from '../../common/constants/enumerations';
import { memoAttachmentsFieldName } from '../../common/constants/parameter-constants';
import {
  ActivityIdPathParams,
  ActivityPlanIdPathParams,
  AdditionalInformationIdPathParams,
  AttachmentIdPathParams,
  CallInformationIdPathParams,
  ContactEducationIdPathParams,
  ContactIdPathParams,
  ContactLanguagesIdPathParams,
  ContactLegalAuthorityIdPathParams,
  ContactMedicalBehavioralIdPathParams,
  IdPathParams,
} from '../../dto/id-path-params.dto';
import {
  AttachmentDetailsQueryParams,
  CheckIdQueryParams,
} from '../../dto/filter-query-params.dto';
import {
  AttachmentDetailsEntity,
  NestedAttachmentsEntity,
} from '../../entities/attachments.entity';
import { AttachmentsService } from '../../helpers/attachments/attachments.service';
import { Response } from 'express';
import { ContactsService } from '../../helpers/contacts/contacts.service';
import {
  ContactsEntity,
  NestedContactsEntity,
} from '../../entities/contacts.entity';
import { PostAttachmentDto } from '../../dto/post-attachment.dto';
import { AdditionalInformationService } from '../../helpers/additional-information/additional-information.service';
import { CallInformationService } from '../../helpers/call-information/call-information.service';
import {
  CallInformationEntity,
  NestedCallInformationEntity,
} from '../../entities/call-information.entity';
import {
  AdditionalInformationEntity,
  NestedAdditionalInformationEntity,
} from '../../entities/additional-information.entity';
import {
  ContactLanguagesEntity,
  NestedContactLanguagesEntity,
} from '../../entities/contact-languages.entity';
import {
  stringNull,
  contactLanguagesType,
} from '../../common/constants/upstream-constants';
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
import { ActivityPlanService } from '../../helpers/activity-plan/activity-plan.service';
import {
  ActivityPlanEntity,
  NestedActivityPlanEntity,
} from '../../entities/activity-plan.entity';

@Injectable()
export class MemosService {
  constructor(
    private readonly attachmentsService: AttachmentsService,
    private readonly contactsService: ContactsService,
    private readonly callInformationService: CallInformationService,
    private readonly additionalInformationService: AdditionalInformationService,
    private readonly activitiesService: ActivitiesService,
    private readonly activityPlanService: ActivityPlanService,
  ) {}

  async getSingleMemoAttachmentRecord(
    id: IdPathParams,
    res: Response,
    idir: string,
    filter?: CheckIdQueryParams,
  ): Promise<NestedAttachmentsEntity> {
    return await this.attachmentsService.getSingleAttachmentRecord(
      RecordType.Memo,
      id,
      memoAttachmentsFieldName,
      res,
      idir,
      filter,
    );
  }

  async getSingleMemoAttachmentDetailsRecord(
    id: AttachmentIdPathParams,
    res: Response,
    idir: string,
    filter?: AttachmentDetailsQueryParams,
  ): Promise<AttachmentDetailsEntity> {
    return await this.attachmentsService.getSingleAttachmentDetailsRecord(
      RecordType.Memo,
      id,
      memoAttachmentsFieldName,
      res,
      idir,
      filter,
    );
  }

  async getSingleMemoContactRecord(
    id: ContactIdPathParams,
    res: Response,
    idir: string,
  ): Promise<ContactsEntity> {
    return await this.contactsService.getSingleContactRecord(
      RecordType.Memo,
      id,
      res,
      idir,
    );
  }

  async postSingleMemoAttachmentRecord(
    attachmentsDto: PostAttachmentDto,
    idir: string,
    id: IdPathParams,
    file: Express.Multer.File,
  ): Promise<NestedAttachmentsEntity> {
    return await this.attachmentsService.postSingleAttachmentRecord(
      RecordType.Memo,
      attachmentsDto,
      idir,
      id,
      file,
    );
  }

  async getListMemoContactRecord(
    id: IdPathParams,
    res: Response,
    idir: string,
    filter?: CheckIdQueryParams,
  ): Promise<NestedContactsEntity> {
    return await this.contactsService.getListContactRecord(
      RecordType.Memo,
      id,
      res,
      idir,
      filter,
    );
  }

  async getSingleMemoCallInformationRecord(
    id: CallInformationIdPathParams,
    res: Response,
    idir: string,
  ): Promise<CallInformationEntity> {
    return await this.callInformationService.getSingleCallInformationRecord(
      RecordType.Memo,
      id,
      res,
      idir,
    );
  }

  async getListMemoCallInformationRecord(
    id: IdPathParams,
    res: Response,
    idir: string,
    filter?: CheckIdQueryParams,
  ): Promise<NestedCallInformationEntity> {
    return await this.callInformationService.getListCallInformationRecord(
      RecordType.Memo,
      id,
      res,
      idir,
      filter,
    );
  }

  async getSingleMemoAdditionalInformationRecord(
    id: AdditionalInformationIdPathParams,
    res: Response,
    idir: string,
  ): Promise<AdditionalInformationEntity> {
    return await this.additionalInformationService.getSingleAdditionalInformationRecord(
      RecordType.Memo,
      id,
      res,
      idir,
    );
  }

  async getListMemoAdditionalInformationRecord(
    id: IdPathParams,
    res: Response,
    idir: string,
    filter?: CheckIdQueryParams,
  ): Promise<NestedAdditionalInformationEntity> {
    return await this.additionalInformationService.getListAdditionalInformationRecord(
      RecordType.Memo,
      id,
      res,
      idir,
      filter,
    );
  }

  async getSingleMemoContactLanguagesRecord(
    id: ContactLanguagesIdPathParams,
    res: Response,
    idir: string,
  ): Promise<ContactLanguagesEntity> {
    return await this.contactsService.getSingleContactLanguagesRecord(
      RecordType.Memo,
      id,
      res,
      idir,
    );
  }

  async getListMemoContactLanguagesRecord(
    id: ContactIdPathParams,
    res: Response,
    idir: string,
    filter?: CheckIdQueryParams,
  ): Promise<NestedContactLanguagesEntity> {
    return await this.contactsService.getListContactLanguagesRecord(
      RecordType.Memo,
      id,
      res,
      idir,
      filter,
    );
  }

  async postSingleMemoContactLanguagesRecord(
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
      RecordType.Memo,
      body,
      idir,
      id,
    );
  }

  async getSingleMemoContactMedicalBehavioralRecord(
    id: ContactMedicalBehavioralIdPathParams,
    res: Response,
    idir: string,
  ): Promise<ContactMedicalBehavioralEntity> {
    return await this.contactsService.getSingleContactMedicalBehavioralRecord(
      RecordType.Memo,
      id,
      res,
      idir,
    );
  }

  async getListMemoContactMedicalBehavioralRecord(
    id: ContactIdPathParams,
    res: Response,
    idir: string,
    filter?: CheckIdQueryParams,
  ): Promise<NestedContactMedicalBehavioralEntity> {
    return await this.contactsService.getListContactMedicalBehavioralRecord(
      RecordType.Memo,
      id,
      res,
      idir,
      filter,
    );
  }

  async getSingleMemoContactEducationRecord(
    id: ContactEducationIdPathParams,
    res: Response,
    idir: string,
  ): Promise<ContactEducationEntity> {
    return await this.contactsService.getSingleContactEducationRecord(
      RecordType.Memo,
      id,
      res,
      idir,
    );
  }

  async getListMemoContactEducationRecord(
    id: ContactIdPathParams,
    res: Response,
    idir: string,
    filter?: CheckIdQueryParams,
  ): Promise<NestedContactEducationEntity> {
    return await this.contactsService.getListContactEducationRecord(
      RecordType.Memo,
      id,
      res,
      idir,
      filter,
    );
  }

  async postSingleMemoContactEducationRecord(
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
      RecordType.Memo,
      body,
      idir,
      id,
    );
  }

  async getSingleMemoContactLegalAuthorityRecord(
    id: ContactLegalAuthorityIdPathParams,
    res: Response,
    idir: string,
  ): Promise<ContactLegalAuthorityEntity> {
    return await this.contactsService.getSingleContactLegalAuthorityRecord(
      RecordType.Memo,
      id,
      res,
      idir,
    );
  }

  async getListMemoContactLegalAuthorityRecord(
    id: ContactIdPathParams,
    res: Response,
    idir: string,
    filter?: CheckIdQueryParams,
  ): Promise<NestedContactLegalAuthorityEntity> {
    return await this.contactsService.getListContactLegalAuthorityRecord(
      RecordType.Memo,
      id,
      res,
      idir,
      filter,
    );
  }

  async getSingleMemoActivityRecord(
    id: ActivityIdPathParams,
    res: Response,
    idir: string,
  ): Promise<ActivitiesEntity> {
    return await this.activitiesService.getSingleActivityRecord(
      RecordType.Memo,
      id,
      res,
      idir,
    );
  }

  async getListMemoActivityRecord(
    id: IdPathParams,
    res: Response,
    idir: string,
    filter?: CheckIdQueryParams,
  ): Promise<NestedActivitiesEntity> {
    return await this.activitiesService.getListActivityRecord(
      RecordType.Memo,
      id,
      res,
      idir,
      filter,
    );
  }

  async postSingleMemoActivityRecord(
    activityDto: PostActivityDto,
    idir: string,
    id: IdPathParams,
  ): Promise<ActivitiesEntity> {
    const baseObject = {
      ...activityDto,
      Id: stringNull,
      'ICM Type': 'Memo',
      'ICM Memo Id': id.rowId,
      'Primary Owned By': idir,
    };
    const body = new PostActivityDtoUpstream(baseObject);
    return await this.activitiesService.postSingleActivityRecord(
      RecordType.Memo,
      id,
      body,
      idir,
    );
  }

  async getSingleMemoActivityPlanRecord(
    id: ActivityPlanIdPathParams,
    res: Response,
    idir: string,
  ): Promise<ActivityPlanEntity> {
    return await this.activityPlanService.getSingleActivityPlanRecord(
      RecordType.Memo,
      id,
      res,
      idir,
    );
  }

  async getListMemoActivityPlanRecord(
    id: IdPathParams,
    res: Response,
    idir: string,
    filter?: CheckIdQueryParams,
  ): Promise<NestedActivityPlanEntity> {
    return await this.activityPlanService.getListActivityPlanRecord(
      RecordType.Memo,
      id,
      res,
      idir,
      filter,
    );
  }
}
