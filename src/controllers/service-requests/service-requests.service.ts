import { Injectable } from '@nestjs/common';
import { SupportNetworkService } from '../../helpers/support-network/support-network.service';
import { RecordType } from '../../common/constants/enumerations';
import { NestedSupportNetworkEntity } from '../../entities/support-network.entity';
import { IdPathParams } from '../../dto/id-path-params.dto';
import { FilterQueryParams } from '../../dto/filter-query-params.dto';
import { AttachmentsService } from '../../helpers/attachments/attachments.service';
import { srAttachmentsFieldName } from '../../common/constants/parameter-constants';
import { NestedAttachmentsEntity } from '../../entities/attachments.entity';
import { Response } from 'express';

@Injectable()
export class ServiceRequestsService {
  constructor(
    private readonly supportNetworkService: SupportNetworkService,
    private readonly attachmentsService: AttachmentsService,
  ) {}

  async getSingleSRSupportNetworkInformationRecord(
    id: IdPathParams,
    res: Response,
    filter?: FilterQueryParams,
  ): Promise<NestedSupportNetworkEntity> {
    return await this.supportNetworkService.getSingleSupportNetworkInformationRecord(
      RecordType.SR,
      id,
      res,
      filter,
    );
  }

  async getSingleSRAttachmentRecord(
    id: IdPathParams,
    res: Response,
    filter?: FilterQueryParams,
  ): Promise<NestedAttachmentsEntity> {
    return await this.attachmentsService.getSingleAttachmentRecord(
      RecordType.SR,
      id,
      srAttachmentsFieldName,
      res,
      filter,
    );
  }
}
