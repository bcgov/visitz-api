import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Request } from 'express';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenRefresherService } from '../../../external-api/token-refresher/token-refresher.service';
import { UtilitiesService } from '../../../helpers/utilities/utilities.service';
import { idirUsernameHeaderField } from '../../../common/constants/upstream-constants';
import {
  EntityRecordMap,
  EntityType,
  RecordType,
} from '../../../common/constants/enumerations';
import { AuthService } from '../auth/auth.service';
import { officeNamesSeparator } from '../../../common/constants/parameter-constants';

@Injectable()
export class WorkflowAuthService {
  private readonly logger = new Logger(WorkflowAuthService.name);

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly utilitiesService: UtilitiesService,
    private readonly httpService: HttpService,
    private readonly tokenRefresherService: TokenRefresherService,
    private readonly authService: AuthService,
  ) {}

  async getRecordAndValidate(req: Request): Promise<boolean> {
    let idir: string,
      jti: string,
      entityNumber: string,
      entityType: EntityType,
      recordType: RecordType;
    try {
      idir = this.utilitiesService.grabIdir(req);
      req.headers[idirUsernameHeaderField] = idir; // set header to jwt idir for future use
    } catch {
      this.logger.error(`Idir username not found`);
      return false;
    }
    try {
      jti = this.utilitiesService.grabJTI(req);
      [entityType, entityNumber] = this.utilitiesService.findEntityInfo(
        req.body,
      );
      recordType = EntityRecordMap[entityType];
    } catch (error: any) {
      this.logger.error({ error });
      return false;
    }
    const key = this.utilitiesService.entityTypeCacheKeyPreparer(
      idir,
      entityType,
      entityNumber,
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
        await this.authService.getEmployeeActiveUpstream(idir);
      if (employeeActive === true && officeNames !== null) {
        [isAssignedToOffice, searchspec] =
          await this.authService.getIsAssignedToOfficeUpstream(
            entityNumber,
            recordType,
            idir,
            officeNames,
            true,
          );
      }
      upstreamResult = await this.authService.evaluateUpstreamResult(
        isAssignedToOffice,
        idir,
        key,
        searchspec,
      );
    } else if (upstreamResult === null) {
      this.logger.log(`Cache not hit for record type, going upstream...`);
      const [upstreamIdir, searchspec] =
        await this.authService.getIsAssignedToOfficeUpstream(
          entityNumber,
          recordType,
          idir,
          officeNames,
          true,
        );
      upstreamResult = await this.authService.evaluateUpstreamResult(
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
}
