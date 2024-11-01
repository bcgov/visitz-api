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
  VIEW_MODE,
} from '../../../common/constants/parameter-constants';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class AuthService {
  cacheTime: number;
  baseUrl: string;
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly utilitiesService: UtilitiesService,
    private readonly httpService: HttpService,
  ) {
    this.cacheTime = this.configService.get<number>('recordCache.cacheTtlMs');
    this.baseUrl = this.configService.get<string>('UPSTREAM_BASE_URL');
  }

  async getRecordAndValidate(req: Request): Promise<boolean> {
    let idir: string, id: string, recordType: RecordType;
    try {
      idir = req.header('idir_username').trim();
      [id, recordType] = this.grabRecordInfoFromPath(req.path);
    } catch (error: any) {
      this.logger.error({ error });
      return false;
    }
    const key = `${id}|${recordType}`;
    let upstreamResult: string | null | undefined =
      await this.cacheManager.get(key);
    // TODO: Remove this console log once guard is verified working
    this.logger.log(`Cache result: ${upstreamResult}`);

    if (upstreamResult === undefined) {
      upstreamResult = await this.getAssignedIdirUpstream(id, recordType);
      await this.cacheManager.set(key, upstreamResult, this.cacheTime);
    }
    if (upstreamResult !== idir) {
      return false;
    }
    return true;
  }

  grabRecordInfoFromPath(path: string): [string, RecordType] {
    const pathParts = path.trim().slice(1).split('/', 2); // slice removes the leading / in the url
    if (!this.utilitiesService.enumTypeGuard(RecordType, pathParts[0].trim())) {
      throw new EnumTypeError(pathParts[0]);
    }
    if (pathParts.length < 2) {
      throw new Error(`Id not found in path: '${path}'`);
    }
    return [pathParts[1].trim(), pathParts[0].trim() as RecordType];
  }

  async getAssignedIdirUpstream(
    id: string,
    recordType: RecordType,
  ): Promise<string | null> {
    let workspace;
    const params = {
      ViewMode: VIEW_MODE,
      ChildLinks: CHILD_LINKS,
    };
    if (
      (workspace = this.configService.get(
        `upstreamAuth.${recordType}.workspace`,
      )) !== undefined
    ) {
      params['workspace'] = workspace;
    }
    const headers = {
      // TODO: Change the authorization to service account
      Cookie: this.configService.get<string>('SIEBEL_COOKIE'),
      Authorization: this.configService.get<string>('SIEBEL_BEARER_AUTH'),
      Accept: CONTENT_TYPE,
    };
    const url =
      this.baseUrl +
      this.configService.get<string>(`upstreamAuth.${recordType}.endpoint`) +
      id;

    let response;
    try {
      response = await firstValueFrom(
        this.httpService.get(url, { params, headers }),
      );
      const idir =
        response.data[
          this.configService.get<string>(`upstreamAuth.${recordType}.idirField`)
        ];
      if (idir === undefined) {
        return null;
      }
      return idir;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.status >= 500) {
          this.logger.error(error.message, error.stack, error.cause);
        }
      }
    }
    return null;
  }
}
