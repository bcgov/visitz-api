import { Injectable } from '@nestjs/common';
import { RecordType } from '../../common/constants/enumerations';
import { memoAttachmentsFieldName } from '../../common/constants/parameter-constants';
import { IdPathParams } from '../../dto/id-path-params.dto';
import { SinceQueryParams } from '../../dto/since-query-params.dto';
import {
  AttachmentsEntity,
  NestedAttachmentsEntity,
} from '../../entities/attachments.entity';
import { AttachmentsService } from '../../helpers/attachments/attachments.service';

@Injectable()
export class MemosService {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  async getSingleMemoAttachmentRecord(
    id: IdPathParams,
    since?: SinceQueryParams,
  ): Promise<AttachmentsEntity | NestedAttachmentsEntity> {
    return await this.attachmentsService.getSingleAttachmentRecord(
      RecordType.Memo,
      id,
      memoAttachmentsFieldName,
      since,
    );
  }
}
