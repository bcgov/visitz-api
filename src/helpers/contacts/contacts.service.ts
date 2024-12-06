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
    const upstreamUrl = this.constructUpstreamUrl(type, id);
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

  constructUpstreamUrl(type: RecordType, id: IdPathParams): string {
    return this.baseUrl + this.endpointUrls[type].replace('rowId', id.rowId);
  }
}
