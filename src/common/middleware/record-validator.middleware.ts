import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Request, Response, NextFunction } from 'express';
import { DEFAULT_CACHE_TTL_MS, RecordType } from '../constants';
import { enumTypeGuard } from '../utilities';
import { EnumTypeError } from '../errors';

@Injectable()
export class RecordValidatorMiddleware implements NestMiddleware {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Read header, find IDIR
    let idir: string, id: string, recordType: RecordType;
    try {
      idir = req.header('idir_username').trim();
      [id, recordType] = this.grabRecordInfoFromUrl(req.path);
    } catch (error: any) {
      // TODO: add proper log here once logger configured
      console.log(error);
      res.status(400).send();
      next();
    }
    // Check cache for result
    const key = `${id}|${recordType}`;
    let upstreamResult: string | null = await this.cacheManager.get(key);

    if (upstreamResult === null) {
      // If not in cache, call upstream for record
      // TODO: Implement function that calls upstream
      upstreamResult = idir;

      // TODO: Remove this console log once confirmed working with real request
      console.log(`idir:${idir} id:${id} type:${recordType}`);

      // Cache record
      let cacheTime = parseInt(process.env.RECORD_CACHE_MS);
      cacheTime = isNaN(cacheTime) ? DEFAULT_CACHE_TTL_MS : cacheTime;
      await this.cacheManager.set(key, upstreamResult, cacheTime);
    }

    // Confirm IDIR matches. If no, return 403 Forbidden
    if (upstreamResult !== idir) {
      res.status(403).send();
    }
    // Else, proceed. This should return 200 OK
    next();
  }

  private grabRecordInfoFromUrl(url: string): [string, RecordType] {
    const urlParts = url.trim().slice(1).split('/', 2); // slice removes the leading / in the url
    if (!enumTypeGuard(RecordType, urlParts[0].trim())) {
      throw new EnumTypeError(urlParts[0]);
    }
    return [urlParts[1].trim(), urlParts[0].trim() as RecordType];
  }
}
