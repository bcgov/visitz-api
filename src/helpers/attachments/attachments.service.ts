import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  AttachmentParentIdFieldMap,
  EntityStatus,
  RecordType,
  RestrictedRecordEnum,
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
import { restrictedNotOpenPostError } from '../../common/constants/error-constants';

@Injectable()
export class AttachmentsService {
  url: string;
  postUrl: string;
  workspace: string | undefined;
  postWorkspace: string | undefined;
  afterFieldName: string | undefined;
  caseRestrictedFieldName: string;
  incidentRestrictedFieldName: string;
  srRestrictedFieldName: string;
  memoRestrictedFieldName: string;
  caseStatusFieldName: string;
  incidentStatusFieldName: string;
  srStatusFieldName: string;
  memoStatusFieldName: string;
  caseWorkspace: string;
  incidentWorkspace: string;
  srWorkspace: string;
  memoWorkspace: string;
  caseURL: string;
  incidentURL: string;
  srURL: string;
  memoURL: string;

  private readonly logger = new Logger(AttachmentsService.name);

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
    this.caseRestrictedFieldName = this.configService.get<string>(
      `upstreamAuth.case.restrictedField`,
    );
    this.incidentRestrictedFieldName = this.configService.get<string>(
      `upstreamAuth.incident.restrictedField`,
    );
    this.srRestrictedFieldName = this.configService.get<string>(
      `upstreamAuth.sr.restrictedField`,
    );
    this.memoRestrictedFieldName = this.configService.get<string>(
      `upstreamAuth.memo.restrictedField`,
    );
    this.caseStatusFieldName = this.configService.get<string>(
      `upstreamAuth.case.statusField`,
    );
    this.incidentStatusFieldName = this.configService.get<string>(
      `upstreamAuth.incident.statusField`,
    );
    this.srStatusFieldName = this.configService.get<string>(
      `upstreamAuth.sr.statusField`,
    );
    this.memoStatusFieldName = this.configService.get<string>(
      `upstreamAuth.memo.statusField`,
    );
    this.caseWorkspace = this.configService.get<string>(
      `upstreamAuth.case.workspace`,
    );
    this.incidentWorkspace = this.configService.get<string>(
      `upstreamAuth.incident.workspace`,
    );
    this.srWorkspace = this.configService.get<string>(
      `upstreamAuth.sr.workspace`,
    );
    this.memoWorkspace = this.configService.get<string>(
      `upstreamAuth.memo.workspace`,
    );
    this.caseURL = encodeURI(
      this.configService.get<string>('endpointUrls.baseUrl') +
        this.configService.get<string>(`upstreamAuth.case.endpoint`),
    );
    this.incidentURL = encodeURI(
      this.configService.get<string>('endpointUrls.baseUrl') +
        this.configService.get<string>(`upstreamAuth.incident.endpoint`),
    );
    this.srURL = encodeURI(
      this.configService.get<string>('endpointUrls.baseUrl') +
        this.configService.get<string>(`upstreamAuth.sr.endpoint`),
    );
    this.memoURL = encodeURI(
      this.configService.get<string>('endpointUrls.baseUrl') +
        this.configService.get<string>(`upstreamAuth.memo.endpoint`),
    );
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
    await this.isEligibleForPost(id[idName], idir, type);
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

  async isEligibleForPost(
    parentId: string,
    idir: string,
    recordType: RecordType,
  ): Promise<void> {
    const recordRestrictedFieldName = `${recordType}RestrictedFieldName`;
    const recordStatusFieldName = `${recordType}StatusFieldName`;
    const recordWorkspace = this[`${recordType}Workspace`];
    const recordURL = this[`${recordType}URL`];
    const baseSearchSpec =
      `([Id]="${parentId}" AND ` +
      `[${this[recordRestrictedFieldName]}]="${RestrictedRecordEnum.False}" ` +
      `AND [${this[recordStatusFieldName]}]="${EntityStatus.Open}"`;
    const [headers, params] =
      this.requestPreparerService.prepareHeadersAndParams(
        baseSearchSpec,
        recordWorkspace,
        undefined,
        true,
        idir,
      );
    let response;
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      response = await this.requestPreparerService.sendGetRequest(
        recordURL,
        headers,
        undefined,
        params,
      );
    } catch {
      this.logger.error(
        `Parent ${recordType} record with id '${parentId}' is not open or is restricted`,
      );
      throw new BadRequestException([restrictedNotOpenPostError]);
    }
  }
}
