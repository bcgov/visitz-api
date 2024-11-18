import { Injectable } from '@nestjs/common';
import { SupportNetworkService } from '../../helpers/support-network/support-network.service';
import { RecordType } from '../../common/constants/enumerations';
import {
  NestedSupportNetworkEntity,
  SupportNetworkEntity,
} from '../../entities/support-network.entity';
import { IdPathParams } from '../../dto/id-path-params.dto';
import { SinceQueryParams } from '../../dto/since-query-params.dto';
import { AttachmentsService } from '../../helpers/attachments/attachments.service';
import { srAttachmentsFieldName } from '../../common/constants/parameter-constants';
import {
  AttachmentsEntity,
  NestedAttachmentsEntity,
} from '../../entities/attachments.entity';
import { Response } from 'express';
import { StartRowNumQueryParams } from '../../dto/start-row-num-query-params.dto';

@Injectable()
export class ServiceRequestsService {
  constructor(
    private readonly supportNetworkService: SupportNetworkService,
    private readonly attachmentsService: AttachmentsService,
  ) {}

  async getSingleSRSupportNetworkInformationRecord(
    id: IdPathParams,
    res: Response,
    since?: SinceQueryParams,
    startRowNum?: StartRowNumQueryParams,
  ): Promise<SupportNetworkEntity | NestedSupportNetworkEntity> {
    return await this.supportNetworkService.getSingleSupportNetworkInformationRecord(
      RecordType.SR,
      id,
      res,
      since,
      startRowNum,
    );
  }

  async getSingleSRAttachmentRecord(
    id: IdPathParams,
    res: Response,
    since?: SinceQueryParams,
    startRowNum?: StartRowNumQueryParams,
  ): Promise<AttachmentsEntity | NestedAttachmentsEntity> {
    return await this.attachmentsService.getSingleAttachmentRecord(
      RecordType.SR,
      id,
      srAttachmentsFieldName,
      res,
      since,
      startRowNum,
    );
  }
}
