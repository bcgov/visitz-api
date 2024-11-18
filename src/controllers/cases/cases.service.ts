import { Injectable } from '@nestjs/common';
import { SupportNetworkService } from '../../helpers/support-network/support-network.service';
import { RecordType } from '../../common/constants/enumerations';
import {
  NestedSupportNetworkEntity,
  SupportNetworkEntity,
} from '../../entities/support-network.entity';
import { IdPathParams } from '../../dto/id-path-params.dto';
import { SinceQueryParams } from '../../dto/since-query-params.dto';
import { InPersonVisitsService } from '../../helpers/in-person-visits/in-person-visits.service';
import {
  InPersonVisitsEntity,
  NestedInPersonVisitsEntity,
} from '../../entities/in-person-visits.entity';
import { AttachmentsService } from '../../helpers/attachments/attachments.service';
import {
  AttachmentsEntity,
  NestedAttachmentsEntity,
} from '../../entities/attachments.entity';
import {
  casesAttachmentsFieldName,
  idName,
} from '../../common/constants/parameter-constants';
import {
  PostInPersonVisitDto,
  PostInPersonVisitDtoUpstream,
} from '../../dto/post-in-person-visit.dto';
import {
  childVisitEntityIdFieldName,
  childVisitIdirFieldName,
} from '../../common/constants/upstream-constants';
import { Response } from 'express';
import { StartRowNumQueryParams } from '../../dto/start-row-num-query-params.dto';

@Injectable()
export class CasesService {
  constructor(
    private readonly supportNetworkService: SupportNetworkService,
    private readonly inPersonVisitsService: InPersonVisitsService,
    private readonly attachmentsService: AttachmentsService,
  ) {}

  async getSingleCaseSupportNetworkInformationRecord(
    id: IdPathParams,
    res: Response,
    since?: SinceQueryParams,
    startRowNum?: StartRowNumQueryParams,
  ): Promise<SupportNetworkEntity | NestedSupportNetworkEntity> {
    return await this.supportNetworkService.getSingleSupportNetworkInformationRecord(
      RecordType.Case,
      id,
      res,
      since,
      startRowNum,
    );
  }

  async getSingleCaseInPersonVisitRecord(
    id: IdPathParams,
    res: Response,
    since?: SinceQueryParams,
    startRowNum?: StartRowNumQueryParams,
  ): Promise<InPersonVisitsEntity | NestedInPersonVisitsEntity> {
    return await this.inPersonVisitsService.getSingleInPersonVisitRecord(
      RecordType.Case,
      id,
      res,
      since,
      startRowNum,
    );
  }

  async postSingleCaseInPersonVisitRecord(
    inPersonVisitsDto: PostInPersonVisitDto,
    idir: string,
    id: IdPathParams,
  ): Promise<NestedInPersonVisitsEntity> {
    const body = new PostInPersonVisitDtoUpstream({
      ...inPersonVisitsDto,
      [childVisitIdirFieldName]: idir,
      [childVisitEntityIdFieldName]: id[idName],
    });
    return await this.inPersonVisitsService.postSingleInPersonVisitRecord(
      RecordType.Case,
      body,
    );
  }

  async getSingleCaseAttachmentRecord(
    id: IdPathParams,
    res: Response,
    since?: SinceQueryParams,
    startRowNum?: StartRowNumQueryParams,
  ): Promise<AttachmentsEntity | NestedAttachmentsEntity> {
    return await this.attachmentsService.getSingleAttachmentRecord(
      RecordType.Case,
      id,
      casesAttachmentsFieldName,
      res,
      since,
      startRowNum,
    );
  }
}
