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
  ResponseNarrativeIdPathParams,
  SupportNetworkIdPathParams,
} from '../../dto/id-path-params.dto';
import {
  AttachmentDetailsQueryParams,
  FilterQueryParams,
} from '../../dto/filter-query-params.dto';
import { AttachmentsService } from '../../helpers/attachments/attachments.service';
import { srAttachmentsFieldName } from '../../common/constants/parameter-constants';
import {
  AttachmentDetailsEntity,
  NestedAttachmentsEntity,
} from '../../entities/attachments.entity';
import { Response } from 'express';
import {
  ContactsEntity,
  NestedContactsEntity,
} from '../../entities/contacts.entity';
import { ContactsService } from '../../helpers/contacts/contacts.service';
import { PostAttachmentDto } from '../../dto/post-attachment.dto';
import {
  ResponseNarrativeEntity,
  NestedResponseNarrativeEntity,
} from '../../entities/response-narrative.entity';
import { ResponseNarrativeService } from '../../helpers/response-narrative/response-narrative.service';

@Injectable()
export class ServiceRequestsService {
  constructor(
    private readonly supportNetworkService: SupportNetworkService,
    private readonly attachmentsService: AttachmentsService,
    private readonly contactsService: ContactsService,
    private readonly responseNarrativesService: ResponseNarrativeService,
  ) {}

  async getSingleSRSupportNetworkInformationRecord(
    id: SupportNetworkIdPathParams,
    res: Response,
    idir: string,
  ): Promise<SupportNetworkEntity> {
    return await this.supportNetworkService.getSingleSupportNetworkInformationRecord(
      RecordType.SR,
      id,
      res,
      idir,
    );
  }

  async getListSRSupportNetworkInformationRecord(
    id: IdPathParams,
    res: Response,
    idir: string,
    filter?: FilterQueryParams,
  ): Promise<NestedSupportNetworkEntity> {
    return await this.supportNetworkService.getListSupportNetworkInformationRecord(
      RecordType.SR,
      id,
      res,
      idir,
      filter,
    );
  }

  async getSingleSRAttachmentRecord(
    id: IdPathParams,
    res: Response,
    idir: string,
    filter?: FilterQueryParams,
  ): Promise<NestedAttachmentsEntity> {
    return await this.attachmentsService.getSingleAttachmentRecord(
      RecordType.SR,
      id,
      srAttachmentsFieldName,
      res,
      idir,
      filter,
    );
  }

  async getSingleSRAttachmentDetailsRecord(
    id: AttachmentIdPathParams,
    res: Response,
    idir: string,
    filter?: AttachmentDetailsQueryParams,
  ): Promise<AttachmentDetailsEntity> {
    return await this.attachmentsService.getSingleAttachmentDetailsRecord(
      RecordType.SR,
      id,
      srAttachmentsFieldName,
      res,
      idir,
      filter,
    );
  }

  async postSingleSRAttachmentRecord(
    attachmentsDto: PostAttachmentDto,
    idir: string,
    id: IdPathParams,
    file: Express.Multer.File,
  ): Promise<NestedAttachmentsEntity> {
    return await this.attachmentsService.postSingleAttachmentRecord(
      RecordType.SR,
      attachmentsDto,
      idir,
      id,
      file,
    );
  }

  async getSingleSRContactRecord(
    id: ContactIdPathParams,
    res: Response,
    idir: string,
  ): Promise<ContactsEntity> {
    return await this.contactsService.getSingleContactRecord(
      RecordType.SR,
      id,
      res,
      idir,
    );
  }

  async getListSRContactRecord(
    id: IdPathParams,
    res: Response,
    idir: string,
    filter?: FilterQueryParams,
  ): Promise<NestedContactsEntity> {
    return await this.contactsService.getListContactRecord(
      RecordType.SR,
      id,
      res,
      idir,
      filter,
    );
  }

  async getSingleSRResponseNarrativeRecord(
    id: ResponseNarrativeIdPathParams,
    res: Response,
    idir: string,
  ): Promise<ResponseNarrativeEntity> {
    return await this.responseNarrativesService.getSingleResponseNarrativeRecord(
      RecordType.SR,
      id,
      res,
      idir,
    );
  }

  async getListSRResponseNarrativeRecord(
    id: IdPathParams,
    res: Response,
    idir: string,
    filter?: FilterQueryParams,
  ): Promise<NestedResponseNarrativeEntity> {
    return await this.responseNarrativesService.getListResponseNarrativeRecord(
      RecordType.SR,
      id,
      res,
      idir,
      filter,
    );
  }
}
