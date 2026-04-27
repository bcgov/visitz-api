import { Injectable } from '@nestjs/common';
import { RecordType } from '../../common/constants/enumerations';
import { memoAttachmentsFieldName } from '../../common/constants/parameter-constants';
import {
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

@Injectable()
export class MemosService {
  constructor(
    private readonly attachmentsService: AttachmentsService,
    private readonly contactsService: ContactsService,
    private readonly callInformationService: CallInformationService,
    private readonly additionalInformationService: AdditionalInformationService,
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
}
