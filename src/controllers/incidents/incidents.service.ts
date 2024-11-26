import { Injectable } from '@nestjs/common';
import { SupportNetworkService } from '../../helpers/support-network/support-network.service';
import { RecordType } from '../../common/constants/enumerations';
import { NestedSupportNetworkEntity } from '../../entities/support-network.entity';
import { IdPathParams } from '../../dto/id-path-params.dto';
import { FilterQueryParams } from '../../dto/filter-query-params.dto';
import { AttachmentsService } from '../../helpers/attachments/attachments.service';
import { incidentsAttachmentsFieldName } from '../../common/constants/parameter-constants';
import { NestedAttachmentsEntity } from '../../entities/attachments.entity';
import { Response } from 'express';
import { NestedContactsEntity } from '../../entities/contacts.entity';
import { ContactsService } from '../../helpers/contacts/contacts.service';

@Injectable()
export class IncidentsService {
  constructor(
    private readonly supportNetworkService: SupportNetworkService,
    private readonly attachmentsService: AttachmentsService,
    private readonly contactsService: ContactsService,
  ) {}

  async getSingleIncidentSupportNetworkInformationRecord(
    id: IdPathParams,
    res: Response,
    filter?: FilterQueryParams,
  ): Promise<NestedSupportNetworkEntity> {
    return await this.supportNetworkService.getSingleSupportNetworkInformationRecord(
      RecordType.Incident,
      id,
      res,
      filter,
    );
  }

  async getSingleIncidentAttachmentRecord(
    id: IdPathParams,
    res: Response,
    filter?: FilterQueryParams,
  ): Promise<NestedAttachmentsEntity> {
    return await this.attachmentsService.getSingleAttachmentRecord(
      RecordType.Incident,
      id,
      incidentsAttachmentsFieldName,
      res,
      filter,
    );
  }

  async getSingleIncidentContactRecord(
    id: IdPathParams,
    res: Response,
    filter?: FilterQueryParams,
  ): Promise<NestedContactsEntity> {
    return await this.contactsService.getSingleAttachmentRecord(
      RecordType.Incident,
      id,
      res,
      filter,
    );
  }
}
