import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { isISO8601 } from 'class-validator';
import { DateTime } from 'luxon';
import {
  idirJWTFieldName,
  upstreamDateFormat,
  upstreamDateFormatDateOfVisit,
} from '../../common/constants/upstream-constants';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { RecordType } from '../../common/constants/enumerations';
import {
  dateFormatError,
  emojiError,
} from '../../common/constants/error-constants';
import { emojiRegex } from '../../common/constants/parameter-constants';
import { IdPathParams } from '../../dto/id-path-params.dto';
import { QueryHierarchyComponent } from '../../dto/query-hierarchy-component.dto';

@Injectable()
export class UtilitiesService {
  private readonly logger = new Logger(UtilitiesService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  /**
   * Converts an ISO 8601 formatted string to the MM/dd/yyyy HH:mm:ss format.
   * @param isoDate an ISO 8601 formatted string. Assumes the date given is provided in UTC
   * @returns string formatted date for upstream use if valid ISO 8601 date is provided, or undefined if not
   */
  convertISODateToUpstreamFormat(isoDate: string): string | undefined {
    const upstreamDate = DateTime.fromISO(isoDate.trim(), {
      zone: 'UTC',
    }).toFormat(upstreamDateFormat);
    if (upstreamDate === 'Invalid DateTime') {
      return undefined;
    }
    return upstreamDate;
  }

  /**
   * Converts a MM/dd/yyyy HH:mm:ss formatted date to a DateTime object.
   * @param upstreamDate a MM/dd/yyyy HH:mm:ss formatted string. Assumes the date given is provided in UTC
   * @returns luxon DateTime object if valid formatted date is provided, or undefined if not
   */
  convertUpstreamDateFormatToDateTime(
    upstreamDate: string,
  ): DateTime | undefined {
    const dateObject = DateTime.fromFormat(upstreamDate, upstreamDateFormat, {
      zone: 'UTC',
    });
    if (dateObject.isValid === false) {
      return undefined;
    }
    return dateObject;
  }

  grabJTI(req: Request): string {
    const authToken = req.header('authorization').split(/\s+/)[1];
    try {
      const decoded = this.jwtService.decode(authToken);
      const jti = decoded['jti'];
      return jti;
    } catch {
      const error = `Invalid JWT`;
      this.logger.error(error);
      throw new Error(error);
    }
  }

  grabIdir(req: Request): string {
    const authToken = req.header('authorization').split(/\s+/)[1];
    try {
      const decoded = this.jwtService.decode(authToken);
      const idir = decoded[idirJWTFieldName];
      return idir;
    } catch {
      const error = `Invalid JWT`;
      this.logger.error(error);
      throw new Error(error);
    }
  }

  cacheKeyPreparer(
    idir: string,
    recordType: RecordType,
    id: string,
    jti: string,
  ): string {
    return `${idir}|${recordType}|${id}|${jti}`;
  }

  convertFileBufferToBase64(buffer: Buffer): string {
    return buffer.toString('base64');
  }

  enumTypeGuard<T>(object: T, possibleValue: any): possibleValue is T[keyof T] {
    return Object.values(object).includes(possibleValue);
  }

  constructUpstreamUrl(
    type: RecordType,
    id: IdPathParams,
    baseUrl: string,
    endpointUrls: object,
  ): string {
    return baseUrl + endpointUrls[type].replace('rowId', id.rowId);
  }

  constructQueryHierarchy(parentComponent: QueryHierarchyComponent): string {
    const queryHierarchy = {};
    const innerObject = this.constructFieldAndSearchSpec(parentComponent);
    queryHierarchy[parentComponent.name] = innerObject;
    return JSON.stringify(queryHierarchy);
  }

  constructFieldAndSearchSpec(component: QueryHierarchyComponent) {
    let fields = ``;
    for (const field of Object.keys(component.classExample)) {
      if (!component.exclude || !component.exclude.includes(field)) {
        fields = fields + field + ',';
      }
    }
    fields = fields.substring(0, fields.length - 1); // remove trailing comma
    const innerObject = { fields };
    if (component.searchspec) {
      innerObject[`searchspec`] = component.searchspec;
    }
    if (component.childComponents) {
      for (const child of component.childComponents) {
        innerObject[child.name] = this.constructFieldAndSearchSpec(child);
      }
    }
    return innerObject;
  }
}

// NOTE: These functions are outside of an injectable class because they are meant to be used in a DTO
// context as a validator function
export function isPastISO8601Date(date: string): string {
  if (isISO8601(date, { strict: true })) {
    const dateObject = DateTime.fromISO(date.trim(), {
      zone: 'UTC',
    });
    const currentTimeUTC = DateTime.now().toUTC();
    if (dateObject <= currentTimeUTC) {
      return dateObject.toFormat(upstreamDateFormatDateOfVisit);
    }
  }
  throw new BadRequestException([dateFormatError]);
}

export function isNotEmoji(input: string): string {
  const hasEmoji = emojiRegex.test(input);
  if (hasEmoji) {
    throw new BadRequestException([emojiError]);
  }
  return input;
}
