import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { Request } from 'express';
import { RecordType } from '../../../common/constants/enumerations';
import { EnumTypeError } from '../../../common/errors/errors';
import { UtilitiesService } from '../../../helpers/utilities/utilities.service';
import {
  CHILD_LINKS,
  CONTENT_TYPE,
  idName,
  officeNamesSeparator,
  queryHierarchyEmployeeChildClassName,
  queryHierarchyEmployeeParentClassName,
  UNIFORM_RESPONSE,
  uniformResponseParamName,
  VIEW_MODE,
} from '../../../common/constants/parameter-constants';
import { AxiosError } from 'axios';
import { TokenRefresherService } from '../../../external-api/token-refresher/token-refresher.service';
import {
  idirUsernameHeaderField,
  queryHierarchyParamName,
  trustedIdirHeaderName,
} from '../../../common/constants/upstream-constants';
import { firstValueFrom } from 'rxjs';
import { QueryHierarchyComponent } from '../../../dto/query-hierarchy-component.dto';
import { PositionExample } from '../../../entities/position.entity';
import { EmployeeExample } from '../../../entities/employee.entity';

@Injectable()
export class AuthService {
  cacheTime: number;
  baseUrl: string;
  buildNumber: string;
  employeeWorkspace: string;
  employeeEndpoint: string;
  restrictToOrganization: string | undefined;
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly utilitiesService: UtilitiesService,
    private readonly httpService: HttpService,
    private readonly tokenRefresherService: TokenRefresherService,
  ) {
    this.cacheTime = this.configService.get<number>('recordCache.cacheTtlMs');
    this.baseUrl = encodeURI(
      this.configService.get<string>('endpointUrls.baseUrl'),
    );
    this.buildNumber = this.configService.get<string>('buildInfo.buildNumber');
    this.employeeWorkspace = this.configService.get<string>(
      'upstreamAuth.employee.workspace',
    );
    this.employeeEndpoint = this.configService.get<string>(
      'upstreamAuth.employee.endpoint',
    );
    this.restrictToOrganization = this.configService.get<string | undefined>(
      'upstreamAuth.employee.restrictToOrg',
    );
  }

  async getRecordAndValidate(
    req: Request,
    controllerPath: string,
  ): Promise<boolean> {
    let idir: string, jti: string, id: string, recordType: RecordType;
    try {
      idir = this.utilitiesService.grabIdir(req);
      req.headers[idirUsernameHeaderField] = idir; // set header to jwt idir for future use
    } catch {
      this.logger.error(`Idir username not found`);
      return false;
    }
    try {
      jti = this.utilitiesService.grabJTI(req);
      [id, recordType] = this.grabRecordInfo(req, controllerPath);
    } catch (error: any) {
      this.logger.error({ error });
      return false;
    }
    const key = this.utilitiesService.cacheKeyPreparer(
      idir,
      recordType,
      id,
      jti,
    );
    const officeNamesKey =
      this.utilitiesService.officeNamesCacheKeyPreparer(idir);
    let upstreamResult: number | null | undefined =
      await this.cacheManager.get(key);
    let employeeActive: boolean | null = await this.cacheManager.get(idir);
    let officeNames: string | null =
      await this.cacheManager.get(officeNamesKey);

    if (employeeActive === null || officeNames === null) {
      this.logger.log(
        `Cache not hit for record type and active status, going upstream...`,
      );
      let isAssignedToOffice: boolean = false,
        searchspec: string = 'Not Set';
      [employeeActive, officeNames] =
        await this.getEmployeeActiveUpstream(idir);
      if (employeeActive === true && officeNames !== null) {
        [isAssignedToOffice, searchspec] =
          await this.getIsAssignedToOfficeUpstream(
            id,
            recordType,
            idir,
            officeNames,
          );
      }
      upstreamResult = await this.evaluateUpstreamResult(
        isAssignedToOffice,
        idir,
        key,
        searchspec,
      );
    } else if (upstreamResult === null) {
      this.logger.log(`Cache not hit for record type, going upstream...`);
      const [upstreamIdir, searchspec] =
        await this.getIsAssignedToOfficeUpstream(
          id,
          recordType,
          idir,
          officeNames,
        );
      upstreamResult = await this.evaluateUpstreamResult(
        upstreamIdir,
        idir,
        key,
        searchspec,
      );
    } else {
      this.logger.log(
        `Cache hit for record type! Key: ${key} Result: ${upstreamResult}`,
      );
      this.logger.log(
        `Cache hit for employee status! Key: ${idir} Result: ${employeeActive}`,
      );
      const readableOfficeNames =
        typeof officeNames === 'string'
          ? `["` + officeNames.replace(officeNamesSeparator, `","`) + `"]`
          : officeNames;
      this.logger.log(
        `Cache hit for employee offices! Key: ${officeNamesKey} Result: ${readableOfficeNames}`,
      );
    }
    if (
      upstreamResult === 403 ||
      employeeActive === false ||
      officeNames === undefined
    ) {
      return false;
    }
    return true;
  }

  grabRecordInfo(req: Request, controllerPath: string): [string, RecordType] {
    if (!this.utilitiesService.enumTypeGuard(RecordType, controllerPath)) {
      throw new EnumTypeError(controllerPath);
    }
    const rowId = req.params[idName];
    if (rowId === undefined) {
      const error = `Id not found in path`;
      this.logger.error(error);
      throw new Error(error);
    }
    return [rowId, controllerPath as RecordType];
  }

  async evaluateUpstreamResult(
    isAssignedToOffice: boolean,
    idir: string,
    key: string,
    searchspec: string,
  ) {
    const authStatus = isAssignedToOffice ? 200 : 403;
    if (isAssignedToOffice === true) {
      await this.cacheManager.set(key, authStatus, this.cacheTime);
      this.logger.log(
        `Assigned To Office check: user '${idir}' is assigned to an office with this record`,
      );
    } else {
      this.logger.log(
        `Assigned To Office check: failed with searchspec '${searchspec}'`,
      );
    }
    const upstreamResult = authStatus;
    return upstreamResult;
  }

  async positionCheck(
    idir: string,
    response,
  ): Promise<[boolean, string | null]> {
    const officeNames = [];
    const officeNamesKey =
      this.utilitiesService.officeNamesCacheKeyPreparer(idir);
    if (this.restrictToOrganization !== undefined) {
      const primaryOrganizationId =
        response.data['items'][0]['Primary Organization Id'];
      let foundPositionOrganization: boolean = false;
      for (const position of response.data['items'][0][
        queryHierarchyEmployeeChildClassName
      ]) {
        if (position['Organization Id'] === primaryOrganizationId) {
          foundPositionOrganization = true;
          if (position['Organization'] !== this.restrictToOrganization) {
            this.logger.error({
              msg: `Employees with primary organization '${position['Organization']}' are restricted from using this API.`,
              buildNumber: this.buildNumber,
              function: this.getEmployeeActiveUpstream.name,
            });
            await this.cacheManager.set(
              officeNamesKey,
              undefined,
              this.cacheTime,
            );
            await this.cacheManager.set(idir, false, this.cacheTime);
            return [false, null];
          }
        }
        officeNames.push(position['Division']);
      }
      if (foundPositionOrganization === false) {
        this.logger.error({
          msg: `Primary organization with id '${primaryOrganizationId}' not found in Employee Position array.`,
          buildNumber: this.buildNumber,
          function: this.getEmployeeActiveUpstream.name,
        });
        await this.cacheManager.set(officeNamesKey, undefined, this.cacheTime);
        await this.cacheManager.set(idir, false, this.cacheTime);
        return [false, null];
      }
    }
    const officeNamesString = officeNames.join(officeNamesSeparator);
    await this.cacheManager.set(
      officeNamesKey,
      officeNamesString,
      this.cacheTime,
    );
    await this.cacheManager.set(idir, true, this.cacheTime);
    return [true, officeNamesString];
  }

  async getIsAssignedToOfficeUpstream(
    id: string,
    recordType: RecordType,
    idir: string,
    officeNames: string,
  ): Promise<[boolean | undefined, string]> {
    let workspace;
    const idirFieldName = this.configService.get<string>(
      `upstreamAuth.${recordType}.searchspecIdirField`,
    );
    const officeFieldName = this.configService.get<string>(
      `upstreamAuth.${recordType}.officeField`,
    );
    let searchspec = this.utilitiesService.officeNamesStringToSearchSpec(
      officeNames,
      officeFieldName,
    );
    searchspec = searchspec.substring(0, searchspec.length - 1) + `) OR `;
    if (recordType === RecordType.Case || recordType == RecordType.Incident) {
      searchspec = searchspec + `EXISTS `;
    }
    searchspec = searchspec + `([${idirFieldName}]='${idir}')`;
    const params = {
      ViewMode: VIEW_MODE,
      ChildLinks: CHILD_LINKS,
      [uniformResponseParamName]: UNIFORM_RESPONSE,
      searchspec,
    };
    if (
      (workspace = this.configService.get(
        `upstreamAuth.${recordType}.workspace`,
      )) !== undefined
    ) {
      params['workspace'] = workspace;
    }
    const headers = {
      Accept: CONTENT_TYPE,
      'Accept-Encoding': '*',
      [trustedIdirHeaderName]: idir,
    };
    const url =
      this.baseUrl +
      this.configService.get<string>(`upstreamAuth.${recordType}.endpoint`) +
      id;

    let response;
    try {
      const token =
        await this.tokenRefresherService.refreshUpstreamBearerToken();
      if (token === undefined) {
        throw new Error('Upstream auth failed');
      }
      headers['Authorization'] = token;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      response = await firstValueFrom(
        this.httpService.get(url, { params, headers }),
      );
      return [true, searchspec];
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error({
          msg: error.message,
          errorDetails: error.response?.data,
          stack: error.stack,
          cause: error.cause,
          buildNumber: this.buildNumber,
          function: this.getIsAssignedToOfficeUpstream.name,
        });
      } else {
        this.logger.error({ error, buildNumber: this.buildNumber });
      }
    }
    return [false, searchspec];
  }

  async getEmployeeActiveUpstream(
    idir: string,
  ): Promise<[boolean, string | null]> {
    const officeNamesKey =
      this.utilitiesService.officeNamesCacheKeyPreparer(idir);
    const params = {
      ViewMode: 'Catalog',
      ChildLinks: CHILD_LINKS,
      [uniformResponseParamName]: UNIFORM_RESPONSE,
      excludeEmptyFieldsInResponse: 'true',
      [queryHierarchyParamName]: this.utilitiesService.constructQueryHierarchy(
        new QueryHierarchyComponent({
          classExample: EmployeeExample,
          name: queryHierarchyEmployeeParentClassName,
          searchspec: `([Login Name]="${idir}" AND [Employment Status]="Active")`,
          childComponents: [
            new QueryHierarchyComponent({
              classExample: PositionExample,
              name: queryHierarchyEmployeeChildClassName,
            }),
          ],
        }),
      ),
    };
    if (this.employeeWorkspace !== undefined) {
      params['workspace'] = this.employeeWorkspace;
    }
    const headers = {
      Accept: CONTENT_TYPE,
      'Accept-Encoding': '*',
      [trustedIdirHeaderName]: idir,
    };
    const url = this.baseUrl + this.employeeEndpoint;

    let response;
    try {
      const token =
        await this.tokenRefresherService.refreshUpstreamBearerToken();
      if (token === undefined) {
        throw new Error('Upstream auth failed');
      }
      headers['Authorization'] = token;
      response = await firstValueFrom(
        this.httpService.get(url, { params, headers }),
      );
      return await this.positionCheck(idir, response);
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error({
          msg: error.message,
          errorDetails: error.response?.data,
          stack: error.stack,
          cause: error.cause,
          buildNumber: this.buildNumber,
          function: this.getEmployeeActiveUpstream.name,
        });
        await this.cacheManager.set(officeNamesKey, undefined, this.cacheTime);
        await this.cacheManager.set(idir, false, this.cacheTime);
      } else {
        this.logger.error({ error, buildNumber: this.buildNumber });
      }
    }
    return [false, undefined];
  }
}
