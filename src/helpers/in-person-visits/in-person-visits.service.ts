import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  EntityStatus,
  RecordType,
  YNEnum,
} from '../../common/constants/enumerations';
import { IdPathParams, VisitIdPathParams } from '../../dto/id-path-params.dto';
import { VisitDetailsQueryParams } from '../../dto/filter-query-params.dto';
import { ConfigService } from '@nestjs/config';
import { RequestPreparerService } from '../../external-api/request-preparer/request-preparer.service';
import {
  InPersonVisitsEntityMultiValue,
  InPersonVisitsEntityNoMultiValue,
  InPersonVisitsSingleResponseCaseExample,
  NestedInPersonVisitsMultiValueEntity,
  NestedInPersonVisitsNoMultiValueEntity,
} from '../../entities/in-person-visits.entity';
import {
  CONTENT_TYPE,
  GET_CHILDREN,
  idName,
  queryHierarchyVisitChildClassName,
  queryHierarchyVisitParentClassName,
  UNIFORM_RESPONSE,
  uniformResponseParamName,
  visitIdName,
} from '../../common/constants/parameter-constants';
import { PostInPersonVisitDtoUpstream } from '../../dto/post-in-person-visit.dto';
import { Response } from 'express';
import {
  caseChildServices,
  childVisitEntityIdFieldName,
  createdByFieldName,
  createdDateFieldName,
  getChildrenParamName,
  queryHierarchyParamName,
  trustedIdirHeaderName,
  updatedByFieldName,
  updatedDateFieldName,
} from '../../common/constants/upstream-constants';
import {
  childServicesTypeError,
  restrictedNotOpenPostError,
} from '../../common/constants/error-constants';
import { UtilitiesService } from '../utilities/utilities.service';
import { QueryHierarchyComponent } from '../../dto/query-hierarchy-component.dto';

@Injectable()
export class InPersonVisitsService {
  buildNumber: string;
  url: string;
  postUrl: string;
  caseUrl: string;
  workspace: string | undefined;
  postWorkspace: string | undefined;
  caseWorkspace: string | undefined;
  afterFieldName: string | undefined;
  typeFieldName: string | undefined;
  statusFieldName: string | undefined;
  restrictedFieldName: string | undefined;

  private readonly logger = new Logger(InPersonVisitsService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly requestPreparerService: RequestPreparerService,
    private readonly utilitiesService: UtilitiesService,
  ) {
    this.buildNumber = this.configService.get<string>('buildInfo.buildNumber');
    this.url = encodeURI(
      this.configService.get<string>('endpointUrls.baseUrl') +
        this.configService.get<string>('endpointUrls.inPersonVisits'),
    );
    this.postUrl = encodeURI(
      this.configService.get<string>('endpointUrls.baseUrl') +
        this.configService.get<string>('endpointUrls.postInPersonVisits'),
    );
    this.caseUrl = encodeURI(
      this.configService.get<string>('endpointUrls.baseUrl') +
        this.configService.get<string>('upstreamAuth.case.endpoint'),
    );
    this.workspace = this.configService.get('workspaces.inPersonVisits');
    this.postWorkspace = this.configService.get(
      'workspaces.postInPersonVisits',
    );
    this.caseWorkspace = this.configService.get('upstreamAuth.case.workspace');
    this.afterFieldName = this.configService.get(
      'afterFieldName.inPersonVisits',
    );
    this.typeFieldName = this.configService.get('upstreamAuth.case.typeField');
    this.statusFieldName = this.configService.get(
      'upstreamAuth.case.statusField',
    );
    this.restrictedFieldName = this.configService.get(
      'upstreamAuth.case.restrictedField',
    );
  }

  async getSingleInPersonVisitRecord(
    _type: RecordType,
    id: VisitIdPathParams,
    res: Response,
    idir: string,
    filter?: VisitDetailsQueryParams,
  ): Promise<
    InPersonVisitsEntityMultiValue | InPersonVisitsEntityNoMultiValue
  > {
    const parentId = id[idName];
    const isValidChildCase = await this.isChildCaseType(parentId, idir);
    if (!isValidChildCase) {
      throw new BadRequestException([childServicesTypeError]);
    }
    const baseSearchSpec = `([Parent Id]="${parentId}" AND [Id]="${id[visitIdName]}"`;
    const [headers, baseParams] =
      this.requestPreparerService.prepareHeadersAndParams(
        baseSearchSpec,
        this.workspace,
        this.afterFieldName,
        false,
        idir,
      );
    let response;
    // This conditional is always true, this is here for TypeScript to ignore the other
    // union type from the prepareHeadersAndParams function return
    if ('searchspec' in baseParams) {
      const { searchspec, ...params } = baseParams;
      params[getChildrenParamName] = GET_CHILDREN;
      params[queryHierarchyParamName] =
        this.utilitiesService.constructQueryHierarchy(
          new QueryHierarchyComponent({
            classExample: InPersonVisitsSingleResponseCaseExample,
            name: queryHierarchyVisitParentClassName,
            searchspec: searchspec,
            exclude: [
              queryHierarchyVisitChildClassName,
              updatedByFieldName,
              createdByFieldName,
              'Created',
              'Updated',
            ],
            childComponents: [
              new QueryHierarchyComponent({
                classExample:
                  InPersonVisitsSingleResponseCaseExample.VisitDetails[0],
                name: queryHierarchyVisitChildClassName,
              }),
            ],
          }),
        );
      response = await this.requestPreparerService.sendGetRequest(
        this.url,
        headers,
        res,
        params,
      );
    }
    const returnItems = this.duplicateResponseFields(response.data.items);

    if (filter && filter.multivalue === 'true') {
      return new InPersonVisitsEntityMultiValue(returnItems);
    }
    return new InPersonVisitsEntityNoMultiValue(returnItems);
  }

  async getListInPersonVisitRecord(
    _type: RecordType,
    id: IdPathParams,
    res: Response,
    idir: string,
    filter?: VisitDetailsQueryParams,
  ): Promise<
    | NestedInPersonVisitsMultiValueEntity
    | NestedInPersonVisitsNoMultiValueEntity
  > {
    const parentId = id[idName];
    const isValidChildCase = await this.isChildCaseType(parentId, idir);
    if (!isValidChildCase) {
      throw new BadRequestException([childServicesTypeError]);
    }
    const baseSearchSpec = `([Parent Id]="${parentId}"`;
    const [headers, baseParams] =
      this.requestPreparerService.prepareHeadersAndParams(
        baseSearchSpec,
        this.workspace,
        this.afterFieldName,
        true,
        idir,
        filter,
      );
    let response;
    // This conditional is always true, this is here for TypeScript to ignore the other
    // union type from the prepareHeadersAndParams function return
    if ('searchspec' in baseParams) {
      const { searchspec, ...params } = baseParams;
      params[queryHierarchyParamName] =
        this.utilitiesService.constructQueryHierarchy(
          new QueryHierarchyComponent({
            classExample: InPersonVisitsSingleResponseCaseExample,
            name: queryHierarchyVisitParentClassName,
            searchspec: searchspec,
            exclude: [
              queryHierarchyVisitChildClassName,
              updatedByFieldName,
              createdByFieldName,
              'Created',
              'Updated',
            ],
            childComponents: [
              new QueryHierarchyComponent({
                classExample:
                  InPersonVisitsSingleResponseCaseExample.VisitDetails[0],
                name: queryHierarchyVisitChildClassName,
              }),
            ],
          }),
        );
      response = await this.requestPreparerService.checkIdsGetRequest(
        this.url,
        this.workspace,
        headers,
        params,
        baseSearchSpec,
        'Parent Id,Id',
        res,
        filter,
      );
    }
    const itemsArray = response.data.items;
    const responseArray = [];
    for (const item of itemsArray) {
      responseArray.push(this.duplicateResponseFields(item));
    }
    if (filter && filter.multivalue === 'true') {
      return new NestedInPersonVisitsMultiValueEntity({ items: responseArray });
    }
    return new NestedInPersonVisitsNoMultiValueEntity({ items: responseArray });
  }

  async postSingleInPersonVisitRecord(
    _type: RecordType,
    body: PostInPersonVisitDtoUpstream,
    idir: string,
  ): Promise<NestedInPersonVisitsMultiValueEntity> {
    const parentId = body[childVisitEntityIdFieldName];
    const isEligible = await this.isEligibleForPost(parentId, idir);
    if (!isEligible) {
      throw new BadRequestException([childServicesTypeError]);
    }
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
    const response = await this.requestPreparerService.sendPutRequest(
      this.postUrl,
      body,
      headers,
      params,
    );
    return new NestedInPersonVisitsMultiValueEntity(response.data);
  }

  async isEligibleForPost(parentId: string, idir: string): Promise<boolean> {
    const baseSearchSpec =
      `([Id]="${parentId}" AND ` +
      `[${this.restrictedFieldName}]="${YNEnum.False}" ` +
      `AND [${this.statusFieldName}]="${EntityStatus.Open}"`;
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
      this.logger.error(
        `Parent case record with id '${parentId}' is not open or is restricted`,
      );
      throw new BadRequestException([restrictedNotOpenPostError]);
    }
    return this.childCaseTypeCheck(response);
  }

  async isChildCaseType(parentId: string, idir: string): Promise<boolean> {
    const baseSearchSpec = `([Id]="${parentId}"`;
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
    const type = response.data['items'][0][`${this.typeFieldName}`];
    if (type === undefined) {
      this.logger.error(`${this.typeFieldName} field not found in request`);
      return false;
    }
    return type === caseChildServices;
  }

  duplicateResponseFields(item) {
    const returnItems = item;
    returnItems[createdByFieldName] = returnItems['Created By Name'];
    returnItems['Created'] = returnItems[createdDateFieldName];
    returnItems[updatedByFieldName] = returnItems['Updated By Name'];
    returnItems['Updated'] = returnItems[updatedDateFieldName];
    return returnItems;
  }
}
