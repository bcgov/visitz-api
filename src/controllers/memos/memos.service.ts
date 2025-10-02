import { Injectable } from '@nestjs/common';
import { RecordType } from '../../common/constants/enumerations';
import { memoAttachmentsFieldName } from '../../common/constants/parameter-constants';
import {
  AttachmentIdPathParams,
  ContactIdPathParams,
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

@Injectable()
export class MemosService {
  constructor(
    private readonly attachmentsService: AttachmentsService,
    private readonly contactsService: ContactsService,
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
}
