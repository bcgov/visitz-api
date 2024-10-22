import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RecordType } from '../constants';
import { enumTypeGuard } from '../utilities';
import { EnumTypeError } from '../errors';

@Injectable()
export class RecordValidatorMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Read header, find IDIR
    let idir: string, id: string, recordType: RecordType;
    try {
      idir = req.header('idir_username');
      console.log(req.headers);
      [id, recordType] = this.grabRecordInfoFromUrl(req.path);
    } catch (error: any) {
      // TODO: add proper log here once logger configured
      console.log(error);
      res.status(400).send();
      next();
    }
    // Call upstream for record
    // TODO: Remove this console log once confirmed working with real request
    console.log(`idir:${idir} id:${id} type:${recordType}`);

    // TODO: Cache record (5 minutes, set in env variable in case we adjust)

    // TODO: Confirm IDIR matches. If no, return 403 Forbidden

    // Else, proceed. This should return 200 OK
    next();
  }

  private grabRecordInfoFromUrl(url: string): [string, RecordType] {
    const urlParts = url.trim().slice(1).split('/', 2); // slice removes the leading / in the url
    if (!enumTypeGuard(RecordType, urlParts[0])) {
      throw new EnumTypeError(urlParts[0]);
    }
    return [urlParts[1], urlParts[0] as RecordType];
  }
}
