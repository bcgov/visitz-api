import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { BooleanStringEnum, YNEnum } from '../../common/constants/enumerations';
import { ListOfValuesQueryParams } from '../../dto/filter-query-params.dto';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import { NestedListOfValuesEntity } from '../../entities/list-of-values.entity';
import {
  CATALOG_VIEW_MODE,
  CHILD_LINKS,
  CONTENT_TYPE,
  excludeEmptyFieldsParamName,
  typeParamName,
  UNIFORM_RESPONSE,
  uniformResponseParamName,
} from '../../common/constants/parameter-constants';
import {
  pageSizeMax,
  pageSizeParamName,
  recordCountNeededParamName,
  startRowNumParamName,
  trustedIdirHeaderName,
} from '../../common/constants/upstream-constants';

@Injectable()
export class EnumerationService {
  url: string;
  workspace: string | undefined;

  constructor(
    private readonly configService: ConfigService,
    private readonly requestPreparerService: RequestPreparerService,
  ) {
    this.url = encodeURI(
      this.configService.get<string>('endpointUrls.baseUrl') +
        this.configService.get<string>('endpointUrls.listOfValues'),
    );
    this.workspace = this.configService.get('workspaces.listOfValues');
  }

  async getListOfValues(
    idir: string,
    res: Response,
    filter: ListOfValuesQueryParams,
  ): Promise<NestedListOfValuesEntity> {
    const searchspec = `([Active]="${YNEnum.True}" AND [Type]="${filter[typeParamName]}")`;
    /* 
		Setting up the headers and params here because using Catalog mode would require a 
		method signature change, which I didn't feel was worth the refactor.
	*/
    const headers = {
      Accept: CONTENT_TYPE,
      'Accept-Encoding': '*',
      [trustedIdirHeaderName]: idir,
    };
    const params = {
      ViewMode: CATALOG_VIEW_MODE,
      ChildLinks: CHILD_LINKS,
      searchspec,
      [uniformResponseParamName]: UNIFORM_RESPONSE,
    };
    if (this.workspace !== undefined) {
      params['workspace'] = this.workspace;
    }
    if (filter[recordCountNeededParamName] === BooleanStringEnum.True) {
      params[recordCountNeededParamName] = filter[recordCountNeededParamName];
    }
    params[pageSizeParamName] =
      typeof filter[pageSizeParamName] === 'number'
        ? filter[pageSizeParamName]
        : pageSizeMax;
    if (typeof filter[startRowNumParamName] === 'number') {
      params[startRowNumParamName] = filter[startRowNumParamName];
    }
    if (filter[excludeEmptyFieldsParamName] === YNEnum.True) {
      params[excludeEmptyFieldsParamName] = filter[excludeEmptyFieldsParamName];
    }
    const response = await this.requestPreparerService.sendGetRequest(
      this.url,
      headers,
      res,
      params,
    );
    return new NestedListOfValuesEntity(response.data);
  }
}
