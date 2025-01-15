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
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { TokenRefresherService } from '../../../external-api/token-refresher/token-refresher.service';
import {
  idirUsernameHeaderField,
  trustedIdirHeaderName,
} from '../../../common/constants/upstream-constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  skipJWT: boolean;
  cacheTime: number;
  baseUrl: string;
  buildNumber: string;
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly utilitiesService: UtilitiesService,
    private readonly httpService: HttpService,
    private readonly tokenRefresherService: TokenRefresherService,
    private readonly jwtService: JwtService,
  ) {
    this.cacheTime = this.configService.get<number>('recordCache.cacheTtlMs');
    this.baseUrl = encodeURI(
      this.configService.get<string>('endpointUrls.baseUrl'),
    );
    this.buildNumber = this.configService.get<string>('buildInfo.buildNumber');
    this.skipJWT = this.configService.get<boolean>('skipJWTCache');
  }

  async getRecordAndValidate(
    req: Request,
    controllerPath: string,
  ): Promise<boolean> {
    let idir: string, jti: string, id: string, recordType: RecordType;
    try {
      idir = req.header(idirUsernameHeaderField).trim();
      if (this.skipJWT) {
        jti = 'local'; // we won't have a JWT locally
      } else {
        jti = this.grabJTI(req);
      }
      [id, recordType] = this.grabRecordInfo(req, controllerPath);
    } catch (error: any) {
      this.logger.error({ error });
      return false;
    }
    const key = `${idir}|${recordType}|${id}|${jti}`;
    let upstreamResult: number | null | undefined =
      await this.cacheManager.get(key);

    if (upstreamResult === undefined) {
      this.logger.log(`Cache not hit, going upstream...`);
      const upstreamIdir = await this.getAssignedIdirUpstream(
        id,
        recordType,
        idir,
      );
      const authStatus = upstreamIdir === idir ? 200 : 403;
      if (upstreamIdir !== null) {
        await this.cacheManager.set(key, authStatus, this.cacheTime);
      }
      upstreamResult = authStatus;
      this.logger.log(
        `Upstream idir: '${upstreamIdir}' Result: ${upstreamResult}`,
      );
    } else {
      this.logger.log(`Cache hit! Key: ${key} Result: ${upstreamResult}`);
    }
    if (upstreamResult === 403) {
      return false;
    }
    return true;
  }

  grabJTI(req: Request): string {
    const authToken = req.header('authorization').split(/\s+/)[1];
    const decoded = this.jwtService.decode(authToken);
    const jti = decoded['jti'];
    if (typeof jti !== 'string' || jti.length !== 36) {
      // uuid, so length should always be 36
      throw new Error(`Invalid JWT`);
    }
    return jti;
  }

  grabRecordInfo(req: Request, controllerPath: string): [string, RecordType] {
    if (!this.utilitiesService.enumTypeGuard(RecordType, controllerPath)) {
      throw new EnumTypeError(controllerPath);
    }
    const rowId = req.params[idName];
    if (rowId === undefined) {
      throw new Error(`Id not found in path`);
    }
    return [rowId, controllerPath as RecordType];
  }

  async getAssignedIdirUpstream(
    id: string,
    recordType: RecordType,
    idir: string,
  ): Promise<string | null> {
    let workspace;
    const params = {
      ViewMode: VIEW_MODE,
      ChildLinks: CHILD_LINKS,
      [uniformResponseParamName]: UNIFORM_RESPONSE,
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
      response = await firstValueFrom(
        this.httpService.get(url, { params, headers }),
      );
      const fieldName = this.configService.get<string>(
        `upstreamAuth.${recordType}.idirField`,
      );
      const idir = response.data['items'][0][`${fieldName}`];
      if (idir === undefined) {
        this.logger.error(`${fieldName} field not found in request`);
        return null;
      }
      return idir;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error({
          msg: error.message,
          errorDetails: error.response?.data,
          stack: error.stack,
          cause: error.cause,
          buildNumber: this.buildNumber,
        });
      } else {
        this.logger.error({ error, buildNumber: this.buildNumber });
      }
    }
    return null;
  }
}
