import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';

@Injectable()
export class UtilitiesService {
  /**
   * Converts an ISO 8601 formatted string to the MM/dd/yyyy HH:mm:ss format.
   * @param isoDate an ISO 8601 formatted string. Assumes the date given is provided in UTC
   * @returns string formatted date for upstream use if valid ISO 8601 date is provided, or undefined if not
   */
  convertISODateToUpstreamFormat(isoDate: string): string | undefined {
    const upstreamDate = DateTime.fromISO(isoDate.trim(), {
      zone: 'UTC',
    }).toFormat('MM/dd/yyyy HH:mm:ss');
    if (upstreamDate === 'Invalid DateTime') {
      return undefined;
    }
    return upstreamDate;
  }

  enumTypeGuard<T>(object: T, possibleValue: any): possibleValue is T[keyof T] {
    return Object.values(object).includes(possibleValue);
  }
}
