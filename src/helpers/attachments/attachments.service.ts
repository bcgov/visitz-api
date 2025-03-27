import { Injectable } from '@nestjs/common';
import {
  AttachmentParentIdFieldMap,
  RecordType,
} from '../../common/constants/enumerations';
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
  attachmentIdFieldName,
  attachmentIdName,
  CONTENT_TYPE,
  fileExtensionRegex,
  idName,
  INLINE_ATTACHMENT,
  inlineAttachmentParamName,
  memoAttachmentsFieldName,
  UNIFORM_RESPONSE,
  uniformResponseParamName,
} from '../../common/constants/parameter-constants';
import { Response } from 'express';
import {
  PostAttachmentDto,
  PostAttachmentDtoUpstream,
} from '../../dto/post-attachment.dto';
import {
  trustedIdirHeaderName,
  upstreamAttachmentConstraintNull,
} from '../../common/constants/upstream-constants';
import { UtilitiesService } from '../utilities/utilities.service';
import { VirusScanService } from '../virus-scan/virus-scan.service';

@Injectable()
export class AttachmentsService {
  url: string;
  postUrl: string;
  workspace: string | undefined;
  postWorkspace: string | undefined;
  afterFieldName: string | undefined;
  constructor(
    private readonly configService: ConfigService,
    private readonly requestPreparerService: RequestPreparerService,
    private readonly utilitiesService: UtilitiesService,
    private readonly virusScanService: VirusScanService,
  ) {
    this.url = encodeURI(
      this.configService.get<string>('endpointUrls.baseUrl') +
        this.configService.get<string>('endpointUrls.attachments'),
    );
    this.postUrl = encodeURI(
      this.configService.get<string>('endpointUrls.baseUrl') +
        this.configService.get<string>('endpointUrls.postAttachments'),
    );
    this.workspace = this.configService.get('workspaces.attachments');
    this.postWorkspace = this.configService.get('workspaces.postAttachments');
    this.afterFieldName = this.configService.get('afterFieldName.attachments');
  }

  async getSingleAttachmentRecord(
    _type: RecordType,
    id: IdPathParams,
    typeFieldName: string,
    res: Response,
    idir: string,
    filter?: FilterQueryParams,
  ): Promise<NestedAttachmentsEntity> {
    const baseSearchSpec = `([${typeFieldName}]="${id[idName]}"`;
    const [headers, params] =
      this.requestPreparerService.prepareHeadersAndParams(
        baseSearchSpec,
        this.workspace,
        this.afterFieldName,
        true,
        idir,
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
    idir: string,
    filter?: AttachmentDetailsQueryParams,
  ): Promise<AttachmentDetailsEntity> {
    const baseSearchSpec = `([${typeFieldName}]="${id[idName]}"`;
    const [headers, params] =
      this.requestPreparerService.prepareHeadersAndParams(
        baseSearchSpec,
        this.workspace,
        this.afterFieldName,
        true,
        idir,
        filter,
      );
    if (filter[inlineAttachmentParamName] !== 'false') {
      params[inlineAttachmentParamName] = INLINE_ATTACHMENT;
    }
    params[uniformResponseParamName] = undefined;
    const response = await this.requestPreparerService.sendGetRequest(
      this.url + `/${id[attachmentIdName]}`,
      headers,
      res,
      params,
    );
    if (filter[inlineAttachmentParamName] === 'false') {
      delete response.data[attachmentIdFieldName]; // prevents exposing url in this field when not a download
    }
    return new AttachmentDetailsEntity(response.data);
  }

  prepareAttachmentPostBody(
    type: RecordType,
    dto: PostAttachmentDto,
    id: IdPathParams,
    file: Express.Multer.File,
  ): PostAttachmentDtoUpstream {
    let filename: string = file.originalname.trim();
    let fileSplitIndex: number;
    if ((fileSplitIndex = filename.search(fileExtensionRegex)) > -1) {
      filename = filename.substring(0, fileSplitIndex);
    }
    const upstreamBody = {
      ...dto,
      FileExt: file.mimetype.split('/').slice(-1)[0], // grabs last element
      FileName: filename,
      [AttachmentParentIdFieldMap[type]]: id[idName],
      [attachmentIdFieldName]: this.utilitiesService.convertFileBufferToBase64(
        file.buffer,
      ),
    };
    if (upstreamBody[memoAttachmentsFieldName] === undefined) {
      upstreamBody[memoAttachmentsFieldName] = upstreamAttachmentConstraintNull;
    }
    return new PostAttachmentDtoUpstream(upstreamBody);
  }

  async postSingleAttachmentRecord(
    type: RecordType,
    dto: PostAttachmentDto,
    idir: string,
    id: IdPathParams,
    file: Express.Multer.File,
  ): Promise<NestedAttachmentsEntity> {
    // Scans file before proceeding. This throws an error on infected / unscanable files
    await this.virusScanService.scanFile(file);
    const body = this.prepareAttachmentPostBody(type, dto, id, file);
    const headers = {
      Accept: CONTENT_TYPE,
      'Content-Type': CONTENT_TYPE,
      'Accept-Encoding': '*',
      [trustedIdirHeaderName]: idir,
    };
    const params = {
      [uniformResponseParamName]: UNIFORM_RESPONSE,
    };
    if (this.postWorkspace !== undefined) {
      params['workspace'] = this.postWorkspace;
    }
    const response = await this.requestPreparerService.sendPostRequest(
      this.postUrl,
      body,
      headers,
      params,
    );
    return new NestedAttachmentsEntity(response.data);
  }
}
