import { Injectable } from '@nestjs/common';
import { RecordType } from '../../common/constants/enumerations';
import {
  AttachmentIdPathParams,
  IdPathParams,
} from '../../dto/id-path-params.dto';
import {
  AttachmentDetailsQueryParams,
  FilterQueryParams,
} from '../../dto/filter-query-params.dto';
import { ConfigService } from '@nestjs/config';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import {
  AttachmentDetailsEntity,
  NestedAttachmentsEntity,
} from '../../entities/attachments.entity';
import {
  attachmentIdName,
  idName,
  INLINE_ATTACHMENT,
  inlineAttachmentParamName,
  uniformResponseParamName,
} from '../../common/constants/parameter-constants';
import { Response } from 'express';

@Injectable()
export class AttachmentsService {
  url: string;
  workspace: string | undefined;
  sinceFieldName: string | undefined;
  constructor(
    private readonly configService: ConfigService,
    private readonly requestPreparerService: RequestPreparerService,
  ) {
    this.url = encodeURI(
      this.configService.get<string>('endpointUrls.baseUrl') +
        this.configService.get<string>('endpointUrls.attachments'),
    );
    this.workspace = this.configService.get('workspaces.attachments');
    this.sinceFieldName = this.configService.get('sinceFieldName.attachments');
  }

  async getSingleAttachmentRecord(
    _type: RecordType,
    id: IdPathParams,
    typeFieldName: string,
    res: Response,
    filter?: FilterQueryParams,
  ): Promise<NestedAttachmentsEntity> {
    const baseSearchSpec = `([${typeFieldName}]="${id[idName]}"`;
    const [headers, params] =
      this.requestPreparerService.prepareHeadersAndParams(
        baseSearchSpec,
        this.workspace,
        this.sinceFieldName,
        true,
        filter,
      );
    const response = await this.requestPreparerService.sendGetRequest(
      this.url,
      headers,
      res,
      params,
    );
    return new NestedAttachmentsEntity(response.data);
  }

  async getSingleAttachmentDetailsRecord(
    _type: RecordType,
    id: AttachmentIdPathParams,
    typeFieldName: string,
    res: Response,
    filter?: AttachmentDetailsQueryParams,
  ): Promise<AttachmentDetailsEntity> {
    const baseSearchSpec = `([${typeFieldName}]="${id[idName]}"`;
    const [headers, params] =
      this.requestPreparerService.prepareHeadersAndParams(
        baseSearchSpec,
        this.workspace,
        this.sinceFieldName,
        true,
        filter,
      );
    if (id[inlineAttachmentParamName] !== false) {
      params[inlineAttachmentParamName] = INLINE_ATTACHMENT;
    }
    params[uniformResponseParamName] = undefined;
    const response = await this.requestPreparerService.sendGetRequest(
      this.url + `/${id[attachmentIdName]}`,
      headers,
      res,
      params,
    );
    if (id[inlineAttachmentParamName] === false) {
      delete response.data[`${attachmentIdName}`]; // prevents exposing url in this field when not a download
    }
    return new AttachmentDetailsEntity(response.data);
  }
}
