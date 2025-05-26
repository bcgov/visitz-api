import { Injectable } from '@nestjs/common';
import { SupportNetworkService } from '../../helpers/support-network/support-network.service';
import { RecordType } from '../../common/constants/enumerations';
import {
  NestedSupportNetworkEntity,
  SupportNetworkEntity,
} from '../../entities/support-network.entity';
import {
  AttachmentIdPathParams,
  CaseNotesIdPathParams,
  ContactIdPathParams,
  IdPathParams,
  SupportNetworkIdPathParams,
  VisitIdPathParams,
} from '../../dto/id-path-params.dto';
import {
  AttachmentDetailsQueryParams,
  FilterQueryParams,
  VisitDetailsQueryParams,
} from '../../dto/filter-query-params.dto';
import { InPersonVisitsService } from '../../helpers/in-person-visits/in-person-visits.service';
import {
  InPersonVisitsEntityMultiValue,
  InPersonVisitsEntityNoMultiValue,
  NestedInPersonVisitsMultiValueEntity,
  NestedInPersonVisitsNoMultiValueEntity,
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
  VisitDetail,
} from '../../dto/post-in-person-visit.dto';
import {
  childVisitEntityIdFieldName,
  childVisitType,
  upstreamVisitConstraintNull,
} from '../../common/constants/upstream-constants';
import { Response } from 'express';
import { ContactsService } from '../../helpers/contacts/contacts.service';
import {
  ContactsEntity,
  NestedContactsEntity,
} from '../../entities/contacts.entity';
import { PostAttachmentDto } from '../../dto/post-attachment.dto';
import { CaseNotesService } from '../../helpers/case-notes/case-notes.service';
import {
  CaseNotesEntity,
  NestedCaseNotesEntity,
} from '../../entities/case-notes.entity';

@Injectable()
export class CasesService {
  constructor(
    private readonly supportNetworkService: SupportNetworkService,
    private readonly inPersonVisitsService: InPersonVisitsService,
    private readonly attachmentsService: AttachmentsService,
    private readonly contactsService: ContactsService,
    private readonly caseNotesService: CaseNotesService,
  ) {}

  async getSingleCaseSupportNetworkInformationRecord(
    id: SupportNetworkIdPathParams,
    res: Response,
    idir: string,
  ): Promise<SupportNetworkEntity> {
    return await this.supportNetworkService.getSingleSupportNetworkInformationRecord(
      RecordType.Case,
      id,
      res,
      idir,
    );
  }

  async getListCaseSupportNetworkInformationRecord(
    id: IdPathParams,
    res: Response,
    idir: string,
    filter?: FilterQueryParams,
  ): Promise<NestedSupportNetworkEntity> {
    return await this.supportNetworkService.getListSupportNetworkInformationRecord(
      RecordType.Case,
      id,
      res,
      idir,
      filter,
    );
  }

  async getSingleCaseInPersonVisitRecord(
    id: VisitIdPathParams,
    res: Response,
    idir: string,
    filter?: VisitDetailsQueryParams,
  ): Promise<
    InPersonVisitsEntityMultiValue | InPersonVisitsEntityNoMultiValue
  > {
    return await this.inPersonVisitsService.getSingleInPersonVisitRecord(
      RecordType.Case,
      id,
      res,
      idir,
      filter,
    );
  }

  async getListCaseInPersonVisitRecord(
    id: IdPathParams,
    res: Response,
    idir: string,
    filter?: VisitDetailsQueryParams,
  ): Promise<
    | NestedInPersonVisitsMultiValueEntity
    | NestedInPersonVisitsNoMultiValueEntity
  > {
    return await this.inPersonVisitsService.getListInPersonVisitRecord(
      RecordType.Case,
      id,
      res,
      idir,
      filter,
    );
  }

  async postSingleCaseInPersonVisitRecord(
    inPersonVisitsDto: PostInPersonVisitDto,
    idir: string,
    id: IdPathParams,
  ): Promise<NestedInPersonVisitsMultiValueEntity> {
    const { ['Visit Details Value']: visitDetailValue, ...baseObject } = {
      ...inPersonVisitsDto,
      [childVisitEntityIdFieldName]: id[idName],
      Id: upstreamVisitConstraintNull,
      Type: childVisitType,
      VisitDetails: new Array<VisitDetail>(),
    };
    if (typeof inPersonVisitsDto.VisitDetails !== 'undefined') {
      for (const detail of inPersonVisitsDto.VisitDetails) {
        baseObject.VisitDetails.push(
          new VisitDetail({
            'Visit Detail Value': detail['Visit Detail Value'],
          }),
        );
      }
    } else {
      baseObject.VisitDetails.push(
        new VisitDetail({
          'Visit Detail Value': visitDetailValue,
        }),
      );
    }
    const body = new PostInPersonVisitDtoUpstream(baseObject);
    return await this.inPersonVisitsService.postSingleInPersonVisitRecord(
      RecordType.Case,
      body,
      idir,
    );
  }

  async getSingleCaseAttachmentRecord(
    id: IdPathParams,
    res: Response,
    idir: string,
    filter?: FilterQueryParams,
  ): Promise<NestedAttachmentsEntity> {
    return await this.attachmentsService.getSingleAttachmentRecord(
      RecordType.Case,
      id,
      casesAttachmentsFieldName,
      res,
      idir,
      filter,
    );
  }

  async getSingleCaseAttachmentDetailsRecord(
    id: AttachmentIdPathParams,
    res: Response,
    idir: string,
    filter?: AttachmentDetailsQueryParams,
  ): Promise<AttachmentDetailsEntity> {
    return await this.attachmentsService.getSingleAttachmentDetailsRecord(
      RecordType.Case,
      id,
      casesAttachmentsFieldName,
      res,
      idir,
      filter,
    );
  }

  async postSingleCaseAttachmentRecord(
    attachmentsDto: PostAttachmentDto,
    idir: string,
    id: IdPathParams,
    file: Express.Multer.File,
  ): Promise<NestedAttachmentsEntity> {
    return await this.attachmentsService.postSingleAttachmentRecord(
      RecordType.Case,
      attachmentsDto,
      idir,
      id,
      file,
    );
  }

  async getSingleCaseContactRecord(
    id: ContactIdPathParams,
    res: Response,
    idir: string,
  ): Promise<ContactsEntity> {
    return await this.contactsService.getSingleContactRecord(
      RecordType.Case,
      id,
      res,
      idir,
    );
  }

  async getListCaseContactRecord(
    id: IdPathParams,
    res: Response,
    idir: string,
    filter?: FilterQueryParams,
  ): Promise<NestedContactsEntity> {
    return await this.contactsService.getListContactRecord(
      RecordType.Case,
      id,
      res,
      idir,
      filter,
    );
  }

  async getSingleCaseNotesRecord(
    id: CaseNotesIdPathParams,
    res: Response,
    idir: string,
  ): Promise<CaseNotesEntity> {
    return await this.caseNotesService.getSingleCaseNotesRecord(
      RecordType.Case,
      id,
      res,
      idir,
    );
  }

  async getListCaseNotesRecord(
    id: IdPathParams,
    res: Response,
    idir: string,
    filter?: FilterQueryParams,
  ): Promise<NestedCaseNotesEntity> {
    return await this.caseNotesService.getListCaseNotesRecord(
      RecordType.Case,
      id,
      res,
      idir,
      filter,
    );
  }
}
