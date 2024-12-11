import { Injectable } from '@nestjs/common';
import { RecordType } from '../../common/constants/enumerations';
import { memoAttachmentsFieldName } from '../../common/constants/parameter-constants';
import {
  AttachmentIdPathParams,
  ContactIdPathParams,
  IdPathParams,
} from '../../dto/id-path-params.dto';
import { FilterQueryParams } from '../../dto/filter-query-params.dto';
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

@Injectable()
export class MemosService {
  constructor(
    private readonly attachmentsService: AttachmentsService,
    private readonly contactsService: ContactsService,
  ) {}

  async getSingleMemoAttachmentRecord(
    id: IdPathParams,
    res: Response,
    filter?: FilterQueryParams,
  ): Promise<NestedAttachmentsEntity> {
    return await this.attachmentsService.getSingleAttachmentRecord(
      RecordType.Memo,
      id,
      memoAttachmentsFieldName,
      res,
      filter,
    );
  }

  async getSingleMemoAttachmentDetailsRecord(
    id: AttachmentIdPathParams,
    res: Response,
    filter?: FilterQueryParams,
  ): Promise<AttachmentDetailsEntity> {
    return await this.attachmentsService.getSingleAttachmentDetailsRecord(
      RecordType.Memo,
      id,
      memoAttachmentsFieldName,
      res,
      filter,
    );
  }

  async getSingleMemoContactRecord(
    id: ContactIdPathParams,
    res: Response,
  ): Promise<ContactsEntity> {
    return await this.contactsService.getSingleContactRecord(
      RecordType.Memo,
      id,
      res,
    );
  }

  async getListMemoContactRecord(
    id: IdPathParams,
    res: Response,
    filter?: FilterQueryParams,
  ): Promise<NestedContactsEntity> {
    return await this.contactsService.getListContactRecord(
      RecordType.Memo,
      id,
      res,
      filter,
    );
  }
}
