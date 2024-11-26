import { Injectable } from '@nestjs/common';
import { RecordType } from '../../common/constants/enumerations';
import { memoAttachmentsFieldName } from '../../common/constants/parameter-constants';
import { IdPathParams } from '../../dto/id-path-params.dto';
import { FilterQueryParams } from '../../dto/filter-query-params.dto';
import { NestedAttachmentsEntity } from '../../entities/attachments.entity';
import { AttachmentsService } from '../../helpers/attachments/attachments.service';
import { Response } from 'express';
import { ContactsService } from '../../helpers/contacts/contacts.service';
import { NestedContactsEntity } from '../../entities/contacts.entity';

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

  async getSingleMemoContactRecord(
    id: IdPathParams,
    res: Response,
    filter?: FilterQueryParams,
  ): Promise<NestedContactsEntity> {
    return await this.contactsService.getSingleAttachmentRecord(
      RecordType.Memo,
      id,
      res,
      filter,
    );
  }
}
