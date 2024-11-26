import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { RecordType } from '../../common/constants/enumerations';
import { FilterQueryParams } from '../../dto/filter-query-params.dto';
import { IdPathParams } from '../../dto/id-path-params.dto';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import { NestedContactsEntity } from '../../entities/contacts.entity';

@Injectable()
export class ContactsService {
  baseUrl: string;
  endpointUrls: object;
  workspace: string | undefined;
  sinceFieldName: string | undefined;
  constructor(
    private readonly configService: ConfigService,
    private readonly requestPreparerService: RequestPreparerService,
  ) {
    this.baseUrl = this.configService
      .get<string>('endpointUrls.baseUrl')
      .replace(/\s/g, '%20');
    this.endpointUrls = {
      [RecordType.Case]: this.configService
        .get<string>('endpointUrls.caseContacts')
        .replace(/\s/g, '%20'),
      [RecordType.Incident]: this.configService
        .get<string>('endpointUrls.incidentContacts')
        .replace(/\s/g, '%20'),
      [RecordType.SR]: this.configService
        .get<string>('endpointUrls.srContacts')
        .replace(/\s/g, '%20'),
      [RecordType.Memo]: this.configService
        .get<string>('endpointUrls.memoContacts')
        .replace(/\s/g, '%20'),
    };
    this.workspace = this.configService.get('workspaces.contacts');
    this.sinceFieldName = this.configService.get('sinceFieldName.contacts');
  }

  async getSingleContactRecord(
    type: RecordType,
    id: IdPathParams,
    res: Response,
    filter?: FilterQueryParams,
  ): Promise<NestedContactsEntity> {
    const baseSearchSpec = ``;
    const upstreamUrl =
      this.baseUrl + this.endpointUrls[type].replace('{rowId}', id.rowId);
    const [headers, params] =
      this.requestPreparerService.prepareHeadersAndParams(
        baseSearchSpec,
        this.workspace,
        this.sinceFieldName,
        filter,
      );
    const response = await this.requestPreparerService.sendGetRequest(
      upstreamUrl,
      headers,
      res,
      params,
    );
    return new NestedContactsEntity(response.data);
  }
}
