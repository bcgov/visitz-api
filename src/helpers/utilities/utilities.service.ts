import { BadRequestException, Injectable } from '@nestjs/common';
import { isISO8601 } from 'class-validator';
import { DateTime } from 'luxon';
import { upstreamDateFormat } from '../../common/constants/upstream-constants';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class UtilitiesService {
  skipJWT: boolean;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.skipJWT = this.configService.get<boolean>('skipJWTCache');
  }
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
    const dateObject = DateTime.fromFormat(upstreamDate, upstreamDateFormat);
    if (dateObject.isValid === false) {
      return undefined;
    }
    return dateObject;
  }

  grabJTI(req: Request): string {
    if (this.skipJWT) {
      return 'local'; // we won't have a JWT locally
    }
    const authToken = req.header('authorization').split(/\s+/)[1];
    const decoded = this.jwtService.decode(authToken);
    const jti = decoded['jti'];
    if (typeof jti !== 'string' || jti.length !== 36) {
      // uuid, so length should always be 36
      throw new Error(`Invalid JWT`);
    }
    return jti;
  }

  enumTypeGuard<T>(object: T, possibleValue: any): possibleValue is T[keyof T] {
    return Object.values(object).includes(possibleValue);
  }
}

// NOTE: This is outside of an injectable class because it is meant to be used in a DTO
// context as a validator function
export function isPastISO8601Date(date: string): string {
  if (isISO8601(date, { strict: true })) {
    const dateObject = DateTime.fromISO(date.trim(), {
      zone: 'UTC',
    });
    const currentTimeUTC = DateTime.now().toUTC();
    if (dateObject <= currentTimeUTC) {
      return dateObject.toFormat(upstreamDateFormat);
    }
  }
  throw new BadRequestException([
    'Date / time must met the ISO-8601 standard, and cannot be in the future',
  ]);
}
