import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';

@Injectable()
export class UtilitiesService {
  constructor() {
    dayjs.extend(utc);
  }
  convertISODateToUpstreamFormat(isoDate: string): string | undefined {
    //TODO: Consider Luxon for more strict ISO parsing
    const upstreamDate = dayjs.utc(isoDate).format('MM/DD/YYYY HH:mm:ss');
    if (upstreamDate === 'Invalid Date') {
      return undefined;
    }
    return upstreamDate;
  }
}
