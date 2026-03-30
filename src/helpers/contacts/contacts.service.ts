import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { RecordType } from '../../common/constants/enumerations';
import { CheckIdQueryParams } from '../../dto/filter-query-params.dto';
import {
  ContactIdPathParams,
  ContactLanguagesIdPathParams,
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
} from '../../common/constants/parameter-constants';
import { UtilitiesService } from '../utilities/utilities.service';
import {
  ContactLanguagesEntity,
  NestedContactLanguagesEntity,
} from '../../entities/contact-languages.entity';

@Injectable()
export class ContactsService {
  baseUrl: string;
  endpointUrls: object;
  contactLanguagesUrl: string;
  workspace: string | undefined;
  contactLanguagesWorkspace: string | undefined;
  afterFieldName: string | undefined;
  contactLanguagesAfterFieldName: string | undefined;
  constructor(
    private readonly configService: ConfigService,
    private readonly requestPreparerService: RequestPreparerService,
    private readonly utilitiesService: UtilitiesService,
  ) {
    this.baseUrl = encodeURI(
      this.configService.get<string>('endpointUrls.baseUrl'),
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
    this.workspace = this.configService.get('workspaces.contacts');
    this.contactLanguagesWorkspace = this.configService.get(
      'workspaces.contactLanguages',
    );
    this.afterFieldName = this.configService.get('afterFieldName.contacts');
    this.contactLanguagesAfterFieldName = this.configService.get(
      'afterFieldName.contactLanguages',
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
}
