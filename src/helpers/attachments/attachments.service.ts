import { Injectable } from '@nestjs/common';
import { RecordType } from '../../common/constants/enumerations';
import { IdPathParams } from '../../dto/id-path-params.dto';
import { FilterQueryParams } from '../../dto/filter-query-params.dto';
import { ConfigService } from '@nestjs/config';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import { NestedAttachmentsEntity } from '../../entities/attachments.entity';
import {
  baseUrlEnvVarName,
  attachmentsEndpointEnvVarName,
} from '../../common/constants/upstream-constants';
import { idName } from '../../common/constants/parameter-constants';
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
    this.url = (
      this.configService.get<string>(baseUrlEnvVarName) +
      this.configService.get<string>(attachmentsEndpointEnvVarName)
    ).replace(/\s/g, '%20');
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
}
