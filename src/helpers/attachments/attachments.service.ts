import { Injectable } from '@nestjs/common';
import { RecordType } from '../../common/constants/enumerations';
import { IdPathParams } from '../../dto/id-path-params.dto';
import { SinceQueryParams } from '../../dto/since-query-params.dto';
import { ConfigService } from '@nestjs/config';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import {
  NestedAttachmentsEntity,
  AttachmentsEntity,
} from '../../entities/attachments.entity';
import {
  baseUrlEnvVarName,
  attachmentsEndpointEnvVarName,
} from '../../common/constants/upstream-constants';
import { idName } from '../../common/constants/parameter-constants';

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
    since?: SinceQueryParams,
  ): Promise<AttachmentsEntity | NestedAttachmentsEntity> {
    const baseSearchSpec = `([${typeFieldName}]="${id[idName]}"`;
    const [headers, params] =
      this.requestPreparerService.prepareHeadersAndParams(
        baseSearchSpec,
        this.workspace,
        this.sinceFieldName,
        since,
      );
    const response = await this.requestPreparerService.sendGetRequest(
      this.url,
      headers,
      params,
    );
    if ((response.data as object).hasOwnProperty('items')) {
      return new NestedAttachmentsEntity(response.data);
    }
    return new AttachmentsEntity(response.data);
  }
}
