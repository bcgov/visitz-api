import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { RecordType, YNEnum } from '../../common/constants/enumerations';
import { CheckIdQueryParams } from '../../dto/filter-query-params.dto';
import {
  ContactIdPathParams,
  ContactLanguagesIdPathParams,
  ContactMedicalBehavioralIdPathParams,
  IdPathParams,
} from '../../dto/id-path-params.dto';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import {
  ContactsEntity,
  NestedContactsEntity,
} from '../../entities/contacts.entity';
import {
  contactIdName,
  contactLanguageIdName,
  contactMedicalBehavioralIdName,
  CONTENT_TYPE,
  UNIFORM_RESPONSE,
  uniformResponseParamName,
} from '../../common/constants/parameter-constants';
import { UtilitiesService } from '../utilities/utilities.service';
import {
  ContactLanguagesEntity,
  NestedContactLanguagesEntity,
} from '../../entities/contact-languages.entity';
import { PostContactLanguagesDtoUpstream } from '../../dto/post-contact-languages.dto';
import {
  caseChildServices,
  trustedIdirHeaderName,
} from '../../common/constants/upstream-constants';
import {
  ContactMedicalBehavioralEntity,
  NestedContactMedicalBehavioralEntity,
} from '../../entities/contact-medical-behavioral.entity';
import { PostContactMedicalBehavioralDtoUpstream } from '../../dto/post-contact-medical-behavioral.dto';
import { childServicesMedBehavTypeError } from '../../common/constants/error-constants';

@Injectable()
export class ContactsService {
  baseUrl: string;
  caseUrl: string;
  endpointUrls: object;
  contactLanguagesUrl: string;
  contactMedicalBehavioralUrl: string;
  postContactLanguagesUrl: string;
  postContactMedicalBehavioralUrl: string;
  workspace: string | undefined;
  caseWorkspace: string | undefined;
  contactLanguagesWorkspace: string | undefined;
  contactMedicalBehavioralWorkspace: string | undefined;
  postContactLanguagesWorkspace: string | undefined;
  postContactMedicalBehavioralWorkspace: string | undefined;
  afterFieldName: string | undefined;
  contactLanguagesAfterFieldName: string | undefined;
  contactMedicalBehavioralAfterFieldName: string | undefined;
  caseTypeFieldName: string | undefined;

  private readonly logger = new Logger(ContactsService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly requestPreparerService: RequestPreparerService,
    private readonly utilitiesService: UtilitiesService,
  ) {
    this.baseUrl = encodeURI(
      this.configService.get<string>('endpointUrls.baseUrl'),
    );
    this.caseUrl = encodeURI(
      this.configService.get<string>('endpointUrls.baseUrl') +
        this.configService.get<string>('upstreamAuth.case.endpoint'),
    );
    this.endpointUrls = {
      [RecordType.Case]: encodeURI(
        this.configService.get<string>('endpointUrls.caseContacts'),
      ),
      [RecordType.Incident]: encodeURI(
        this.configService.get<string>('endpointUrls.incidentContacts'),
      ),
      [RecordType.SR]: encodeURI(
        this.configService.get<string>('endpointUrls.srContacts'),
      ),
      [RecordType.Memo]: encodeURI(
        this.configService.get<string>('endpointUrls.memoContacts'),
      ),
    };
    this.contactLanguagesUrl = encodeURI(
      this.configService.get<string>('endpointUrls.contactLanguages'),
    );
    this.contactMedicalBehavioralUrl = encodeURI(
      this.configService.get<string>('endpointUrls.contactMedicalBehavioral'),
    );
    this.postContactLanguagesUrl = encodeURI(
      this.configService.get<string>('endpointUrls.postContactLanguages'),
    );
    this.postContactMedicalBehavioralUrl = encodeURI(
      this.configService.get<string>(
        'endpointUrls.postContactMedicalBehavioral',
      ),
    );
    this.workspace = this.configService.get('workspaces.contacts');
    this.caseWorkspace = this.configService.get('upstreamAuth.case.workspace');

    this.contactLanguagesWorkspace = this.configService.get(
      'workspaces.contactLanguages',
    );
    this.contactMedicalBehavioralWorkspace = this.configService.get(
      'workspaces.contactMedicalBehavioral',
    );
    this.postContactLanguagesWorkspace = this.configService.get(
      'workspaces.postContactLanguages',
    );
    this.postContactMedicalBehavioralWorkspace = this.configService.get(
      'workspaces.postContactMedicalBehavioral',
    );
    this.afterFieldName = this.configService.get('afterFieldName.contacts');
    this.contactLanguagesAfterFieldName = this.configService.get(
      'afterFieldName.contactLanguages',
    );
    this.contactMedicalBehavioralAfterFieldName = this.configService.get(
      'afterFieldName.contactMedicalBehavioral',
    );
    this.caseTypeFieldName = this.configService.get(
      'upstreamAuth.case.typeField',
    );
  }

  async getSingleContactRecord(
    type: RecordType,
    id: ContactIdPathParams,
    res: Response,
    idir: string,
  ): Promise<ContactsEntity> {
    const baseSearchSpec = `([Id]="${id[contactIdName]}"`;
    const upstreamUrl = this.utilitiesService.constructUpstreamUrl(
      type,
      id,
      this.baseUrl,
      this.endpointUrls,
    );
    const [headers, params] =
      this.requestPreparerService.prepareHeadersAndParams(
        baseSearchSpec,
        this.workspace,
        this.afterFieldName,
        false,
        idir,
      );
    const response = await this.requestPreparerService.sendGetRequest(
      upstreamUrl,
      headers,
      res,
      params,
    );
    return new ContactsEntity(response.data);
  }

  async getListContactRecord(
    type: RecordType,
    id: IdPathParams,
    res: Response,
    idir: string,
    filter?: CheckIdQueryParams,
  ): Promise<NestedContactsEntity> {
    const baseSearchSpec = ``;
    const upstreamUrl = this.utilitiesService.constructUpstreamUrl(
      type,
      id,
      this.baseUrl,
      this.endpointUrls,
    );
    const [headers, params] =
      this.requestPreparerService.prepareHeadersAndParams(
        baseSearchSpec,
        this.workspace,
        this.afterFieldName,
        true,
        idir,
        filter,
      );
    const response = await this.requestPreparerService.checkIdsGetRequest(
      upstreamUrl,
      this.workspace,
      headers,
      params,
      baseSearchSpec,
      'Id',
      res,
      filter,
    );
    return new NestedContactsEntity(response.data);
  }

  async getSingleContactLanguagesRecord(
    type: RecordType,
    id: ContactLanguagesIdPathParams,
    res: Response,
    idir: string,
  ): Promise<ContactLanguagesEntity> {
    const baseSearchSpec = `([Id]="${id[contactLanguageIdName]}"`;
    const upstreamUrl =
      this.utilitiesService.constructContactSubtypeUpstreamUrl(
        id,
        this.baseUrl,
        this.contactLanguagesUrl,
      );
    const [headers, params] =
      this.requestPreparerService.prepareHeadersAndParams(
        baseSearchSpec,
        this.contactLanguagesWorkspace,
        this.contactLanguagesAfterFieldName,
        true,
        idir,
      );
    const response = await this.requestPreparerService.sendGetRequest(
      upstreamUrl,
      headers,
      res,
      params,
    );
    return new ContactLanguagesEntity(response.data);
  }

  async getListContactLanguagesRecord(
    type: RecordType,
    id: ContactIdPathParams,
    res: Response,
    idir: string,
    filter?: CheckIdQueryParams,
  ): Promise<NestedContactLanguagesEntity> {
    const baseSearchSpec = ``;
    const upstreamUrl =
      this.utilitiesService.constructContactSubtypeUpstreamUrl(
        id,
        this.baseUrl,
        this.contactLanguagesUrl,
      );
    const [headers, params] =
      this.requestPreparerService.prepareHeadersAndParams(
        baseSearchSpec,
        this.contactLanguagesWorkspace,
        this.contactLanguagesAfterFieldName,
        true,
        idir,
        filter,
      );
    const response = await this.requestPreparerService.checkIdsGetRequest(
      upstreamUrl,
      this.contactLanguagesWorkspace,
      headers,
      params,
      baseSearchSpec,
      'Id',
      res,
      filter,
    );
    return new NestedContactLanguagesEntity(response.data);
  }

  async checkExistingLanguages(
    id: ContactIdPathParams,
    idir: string,
    body: PostContactLanguagesDtoUpstream,
  ) {
    const baseSearchSpec = ``;
    const upstreamUrl =
      this.utilitiesService.constructContactSubtypeUpstreamUrl(
        id,
        this.baseUrl,
        this.contactLanguagesUrl,
      );
    const [headers, params] =
      this.requestPreparerService.prepareHeadersAndParams(
        baseSearchSpec,
        this.contactLanguagesWorkspace,
        this.contactLanguagesAfterFieldName,
        true,
        idir,
      );
    try {
      await this.requestPreparerService.sendGetRequest(
        upstreamUrl,
        headers,
        undefined,
        params,
      );
    } catch (error) {
      if (
        error instanceof HttpException &&
        error.getStatus() == HttpStatus.NO_CONTENT
      ) {
        // must set as primary
        body['SSA Primary Field'] = YNEnum.True;
        return;
      } else {
        throw error; // throws a HTTP Exception from request
      }
    }
    body['SSA Primary Field'] = YNEnum.False;
  }

  async postSingleContactLanguagesRecord(
    _type: RecordType,
    body: PostContactLanguagesDtoUpstream,
    idir: string,
    id: ContactIdPathParams,
  ): Promise<NestedContactLanguagesEntity> {
    await this.checkExistingLanguages(id, idir, body);
    const upstreamUrl =
      this.utilitiesService.constructContactSubtypeUpstreamUrl(
        id,
        this.baseUrl,
        this.postContactLanguagesUrl,
      );
    const headers = {
      Accept: CONTENT_TYPE,
      'Content-Type': CONTENT_TYPE,
      'Accept-Encoding': '*',
      [trustedIdirHeaderName]: idir,
    };
    const params = {
      [uniformResponseParamName]: UNIFORM_RESPONSE,
    };
    if (this.postContactLanguagesWorkspace !== undefined) {
      params['workspace'] = this.postContactLanguagesWorkspace;
    }
    const response = await this.requestPreparerService.sendPutRequest(
      upstreamUrl,
      body,
      headers,
      params,
    );
    const responseBody = {
      items: [
        new ContactLanguagesEntity({
          Id: response.data?.items[0]?.Id,
        }),
      ],
    };
    return new NestedContactLanguagesEntity(responseBody);
  }

  async getSingleContactMedicalBehavioralRecord(
    type: RecordType,
    id: ContactMedicalBehavioralIdPathParams,
    res: Response,
    idir: string,
  ): Promise<ContactMedicalBehavioralEntity> {
    const baseSearchSpec = `([Case Id]="${id.rowId}" AND [Id]="${id[contactMedicalBehavioralIdName]}"`;
    const upstreamUrl =
      this.utilitiesService.constructContactSubtypeUpstreamUrl(
        id,
        this.baseUrl,
        this.contactMedicalBehavioralUrl,
      );
    const [headers, params] =
      this.requestPreparerService.prepareHeadersAndParams(
        baseSearchSpec,
        this.contactMedicalBehavioralWorkspace,
        this.contactMedicalBehavioralAfterFieldName,
        true,
        idir,
      );
    const response = await this.requestPreparerService.sendGetRequest(
      upstreamUrl,
      headers,
      res,
      params,
    );
    return new ContactMedicalBehavioralEntity(response.data);
  }

  async getListContactMedicalBehavioralRecord(
    type: RecordType,
    id: ContactIdPathParams,
    res: Response,
    idir: string,
    filter?: CheckIdQueryParams,
  ): Promise<NestedContactMedicalBehavioralEntity> {
    const baseSearchSpec = `([Case Id]="${id.rowId}"`;
    const upstreamUrl =
      this.utilitiesService.constructContactSubtypeUpstreamUrl(
        id,
        this.baseUrl,
        this.contactMedicalBehavioralUrl,
      );
    const [headers, params] =
      this.requestPreparerService.prepareHeadersAndParams(
        baseSearchSpec,
        this.contactMedicalBehavioralWorkspace,
        this.contactMedicalBehavioralAfterFieldName,
        true,
        idir,
        filter,
      );
    const response = await this.requestPreparerService.checkIdsGetRequest(
      upstreamUrl,
      this.contactMedicalBehavioralWorkspace,
      headers,
      params,
      baseSearchSpec,
      'Id',
      res,
      filter,
    );
    return new NestedContactMedicalBehavioralEntity(response.data);
  }

  async isChildCaseType(caseId: string, idir: string): Promise<boolean> {
    const baseSearchSpec = `([Id]="${caseId}"`;
    const [headers, params] =
      this.requestPreparerService.prepareHeadersAndParams(
        baseSearchSpec,
        this.caseWorkspace,
        undefined,
        true,
        idir,
      );
    let response;
    try {
      response = await this.requestPreparerService.sendGetRequest(
        this.caseUrl,
        headers,
        undefined,
        params,
      );
    } catch {
      return false;
    }
    return this.childCaseTypeCheck(response);
  }

  private childCaseTypeCheck(response): boolean {
    const type = response.data['items'][0][`${this.caseTypeFieldName}`];
    if (type === undefined) {
      this.logger.error(`${this.caseTypeFieldName} field not found in request`);
      return false;
    }
    return type === caseChildServices;
  }

  async postSingleContactMedicalBehavioralRecord(
    _type: RecordType,
    body: PostContactMedicalBehavioralDtoUpstream,
    idir: string,
    id: ContactIdPathParams,
  ): Promise<NestedContactMedicalBehavioralEntity> {
    const parentId = id.rowId;
    const isValidChildCase = await this.isChildCaseType(parentId, idir);
    if (!isValidChildCase) {
      throw new BadRequestException([childServicesMedBehavTypeError]);
    }
    const upstreamUrl =
      this.utilitiesService.constructContactSubtypeUpstreamUrl(
        id,
        this.baseUrl,
        this.postContactMedicalBehavioralUrl,
      );
    const headers = {
      Accept: CONTENT_TYPE,
      'Content-Type': CONTENT_TYPE,
      'Accept-Encoding': '*',
      [trustedIdirHeaderName]: idir,
    };
    const params = {
      [uniformResponseParamName]: UNIFORM_RESPONSE,
    };
    if (this.postContactMedicalBehavioralWorkspace !== undefined) {
      params['workspace'] = this.postContactMedicalBehavioralWorkspace;
    }
    const response = await this.requestPreparerService.sendPutRequest(
      upstreamUrl,
      body,
      headers,
      params,
    );
    return new NestedContactMedicalBehavioralEntity(response.data);
  }
}
