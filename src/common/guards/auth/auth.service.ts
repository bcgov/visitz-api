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
  UNIFORM_RESPONSE,
  uniformResponseParamName,
  VIEW_MODE,
} from '../../../common/constants/parameter-constants';
import { AxiosError } from 'axios';
import { TokenRefresherService } from '../../../external-api/token-refresher/token-refresher.service';
import {
  idirUsernameHeaderField,
  trustedIdirHeaderName,
} from '../../../common/constants/upstream-constants';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  cacheTime: number;
  baseUrl: string;
  buildNumber: string;
  employeeWorkspace: string;
  employeeEndpoint: string;
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
    let upstreamResult: number | null | undefined =
      await this.cacheManager.get(key);
    let employeeActive: boolean | null = await this.cacheManager.get(idir);

    if (upstreamResult === null && employeeActive === null) {
      this.logger.log(
        `Cache not hit for record type and active status, going upstream...`,
      );
      let upstreamIdir: string | undefined, searchspec: string;
      [[upstreamIdir, searchspec], employeeActive] = await Promise.all([
        this.getAssignedIdirUpstream(id, recordType, idir),
        this.getEmployeeActiveUpstream(idir),
      ]);
      upstreamResult = await this.evaluateUpstreamResult(
        upstreamIdir,
        idir,
        key,
        searchspec,
      );
    } else if (upstreamResult === null) {
      this.logger.log(`Cache not hit for record type, going upstream...`);
      const [upstreamIdir, searchspec] = await this.getAssignedIdirUpstream(
        id,
        recordType,
        idir,
      );
      upstreamResult = await this.evaluateUpstreamResult(
        upstreamIdir,
        idir,
        key,
        searchspec,
      );
    } else if (employeeActive === null) {
      this.logger.log(`Cache not hit for active status, going upstream...`);
      employeeActive = await this.getEmployeeActiveUpstream(idir);
    } else {
      this.logger.log(
        `Cache hit for record type! Key: ${key} Result: ${upstreamResult}`,
      );
      this.logger.log(
        `Cache hit for employee status! Key: ${idir} Result: ${employeeActive}`,
      );
    }
    if (upstreamResult === 403 || employeeActive === false) {
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
    upstreamIdir: string | undefined,
    idir: string,
    key: string,
    searchspec: string,
  ) {
    const authStatus = upstreamIdir === idir ? 200 : 403;
    if (upstreamIdir !== undefined) {
      await this.cacheManager.set(key, authStatus, this.cacheTime);
      this.logger.log(
        `Assigned To check: user '${upstreamIdir}' is assigned to record`,
      );
    } else {
      this.logger.log(
        `Assigned To check: failed with searchspec '${searchspec}'`,
      );
    }
    const upstreamResult = authStatus;
    return upstreamResult;
  }

  async getAssignedIdirUpstream(
    id: string,
    recordType: RecordType,
    idir: string,
  ): Promise<[string | undefined, string]> {
    let workspace;
    const fieldName = this.configService.get<string>(
      `upstreamAuth.${recordType}.searchspecIdirField`,
    );
    let searchspec = ``;
    if (recordType === RecordType.Case || recordType == RecordType.Incident) {
      searchspec = `EXISTS `;
    }
    searchspec = searchspec + `([${fieldName}]='${idir}')`;
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
      return [idir, searchspec];
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error({
          msg: error.message,
          errorDetails: error.response?.data,
          stack: error.stack,
          cause: error.cause,
          buildNumber: this.buildNumber,
          function: this.getAssignedIdirUpstream.name,
        });
      } else {
        this.logger.error({ error, buildNumber: this.buildNumber });
      }
    }
    return [undefined, searchspec];
  }

  async getEmployeeActiveUpstream(idir: string): Promise<boolean> {
    const params = {
      ViewMode: 'Catalog',
      ChildLinks: CHILD_LINKS,
      [uniformResponseParamName]: UNIFORM_RESPONSE,
      fields: 'Login Name,Employment Status',
      excludeEmptyFieldsInResponse: 'true',
      searchspec: `([Login Name]="${idir}" AND [Employment Status]="Active")`,
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
      const employmentStatus = response.data['items'][0]['Employment Status'];
      if (employmentStatus === undefined) {
        this.logger.error(`${idir} is not an active user`);
        await this.cacheManager.set(idir, false, this.cacheTime);
        return false;
      }
      await this.cacheManager.set(idir, true, this.cacheTime);
      return true;
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
        await this.cacheManager.set(idir, false, this.cacheTime);
      } else {
        this.logger.error({ error, buildNumber: this.buildNumber });
      }
    }
    return false;
  }
}
