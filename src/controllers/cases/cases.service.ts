import { Injectable } from '@nestjs/common';
import { SupportNetworkService } from '../../helpers/support-network/support-network.service';
import { RecordType } from '../../common/constants/enumerations';
import {
  NestedSupportNetworkEntity,
  SupportNetworkEntity,
} from '../../entities/support-network.entity';
import {
  AttachmentIdPathParams,
  ContactIdPathParams,
  IdPathParams,
  SupportNetworkIdPathParams,
  VisitIdPathParams,
} from '../../dto/id-path-params.dto';
import { FilterQueryParams } from '../../dto/filter-query-params.dto';
import { InPersonVisitsService } from '../../helpers/in-person-visits/in-person-visits.service';
import {
  InPersonVisitsEntity,
  NestedInPersonVisitsEntity,
} from '../../entities/in-person-visits.entity';
import { AttachmentsService } from '../../helpers/attachments/attachments.service';
import {
  AttachmentDetailsEntity,
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
import { ContactsService } from '../../helpers/contacts/contacts.service';
import {
  ContactsEntity,
  NestedContactsEntity,
} from '../../entities/contacts.entity';

@Injectable()
export class CasesService {
  constructor(
    private readonly supportNetworkService: SupportNetworkService,
    private readonly inPersonVisitsService: InPersonVisitsService,
    private readonly attachmentsService: AttachmentsService,
    private readonly contactsService: ContactsService,
  ) {}

  async getSingleCaseSupportNetworkInformationRecord(
    id: SupportNetworkIdPathParams,
    res: Response,
  ): Promise<SupportNetworkEntity> {
    return await this.supportNetworkService.getSingleSupportNetworkInformationRecord(
      RecordType.Case,
      id,
      res,
    );
  }

  async getListCaseSupportNetworkInformationRecord(
    id: IdPathParams,
    res: Response,
    filter?: FilterQueryParams,
  ): Promise<NestedSupportNetworkEntity> {
    return await this.supportNetworkService.getListSupportNetworkInformationRecord(
      RecordType.Case,
      id,
      res,
      filter,
    );
  }

  async getSingleCaseInPersonVisitRecord(
    id: VisitIdPathParams,
    res: Response,
  ): Promise<InPersonVisitsEntity> {
    return await this.inPersonVisitsService.getSingleInPersonVisitRecord(
      RecordType.Case,
      id,
      res,
    );
  }

  async getListCaseInPersonVisitRecord(
    id: IdPathParams,
    res: Response,
    filter?: FilterQueryParams,
  ): Promise<NestedInPersonVisitsEntity> {
    return await this.inPersonVisitsService.getListInPersonVisitRecord(
      RecordType.Case,
      id,
      res,
      filter,
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
    filter?: FilterQueryParams,
  ): Promise<NestedAttachmentsEntity> {
    return await this.attachmentsService.getSingleAttachmentRecord(
      RecordType.Case,
      id,
      casesAttachmentsFieldName,
      res,
      filter,
    );
  }

  async getSingleCaseAttachmentDetailsRecord(
    id: AttachmentIdPathParams,
    res: Response,
    filter?: FilterQueryParams,
  ): Promise<AttachmentDetailsEntity> {
    return await this.attachmentsService.getSingleAttachmentDetailsRecord(
      RecordType.Case,
      id,
      casesAttachmentsFieldName,
      res,
      filter,
    );
  }

  async getSingleCaseContactRecord(
    id: ContactIdPathParams,
    res: Response,
  ): Promise<ContactsEntity> {
    return await this.contactsService.getSingleContactRecord(
      RecordType.Case,
      id,
      res,
    );
  }

  async getListCaseContactRecord(
    id: IdPathParams,
    res: Response,
    filter?: FilterQueryParams,
  ): Promise<NestedContactsEntity> {
    return await this.contactsService.getListContactRecord(
      RecordType.Case,
      id,
      res,
      filter,
    );
  }
}
