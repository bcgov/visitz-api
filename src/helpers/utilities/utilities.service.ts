import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { isEnum, isISO8601 } from 'class-validator';
import { DateTime } from 'luxon';
import {
  idirJWTFieldName,
  upstreamDateFormat,
  upstreamDateFormatNoTime,
} from '../../common/constants/upstream-constants';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import {
  CaseType,
  ContactMedicalBehavioralCategory,
  ContactMedicalBehavioralCategoryConditionMap,
  EntityType,
  IncidentType,
  RecordType,
} from '../../common/constants/enumerations';
import {
  contactMedicalBehavioralConditionEnumError,
  dateFormatError,
  dateFormatFutureError,
  dateRangeFormatError,
  emojiError,
  endDateFormatError,
  isNotPostiveIntegerStringError,
  multiIdError,
  upstreamDateFormatError,
} from '../../common/constants/error-constants';
import {
  checkIdsReturnHeaderName,
  emojiRegex,
  multiIdRegex,
  officeNamesSeparator,
} from '../../common/constants/parameter-constants';
import {
  ContactIdPathParams,
  IdPathParams,
} from '../../dto/id-path-params.dto';
import { QueryHierarchyComponent } from '../../dto/query-hierarchy-component.dto';

@Injectable()
export class UtilitiesService {
  buildNumber: string;
  caseTypeFieldName: string;
  incidentTypeFieldName: string;
  private readonly logger = new Logger(UtilitiesService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.buildNumber = this.configService.get<string>('buildInfo.buildNumber');
    this.caseTypeFieldName = this.configService.get<string>(
      `upstreamAuth.case.typeField`,
    );
    this.incidentTypeFieldName = this.configService.get<string>(
      `upstreamAuth.incident.typeField`,
    );
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

  officeNamesCacheKeyPreparer(idir: string): string {
    return `${idir}|OfficeNames`;
  }

  officeNamesStringToSearchSpec(
    officeNames: string,
    officeFieldName: string,
  ): string {
    let searchspec = `(`;
    const officeNamesArray: Array<string> =
      officeNames.split(officeNamesSeparator);
    for (const officeName of officeNamesArray) {
      if (officeName.includes(`"`)) {
        searchspec = searchspec + `[${officeFieldName}]='${officeName}' OR `;
      } else {
        searchspec = searchspec + `[${officeFieldName}]="${officeName}" OR `;
      }
    }
    searchspec = searchspec.substring(0, searchspec.length - 4) + `)`;
    return searchspec;
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

  constructContactSubtypeUpstreamUrl(
    id: ContactIdPathParams,
    baseUrl: string,
    endpointUrl: string,
  ): string {
    return baseUrl + endpointUrl.replace('rowId', id.contactId);
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

  entityTypeCacheKeyPreparer(
    idir: string,
    entityType: EntityType,
    entityNumber: string,
    jti: string,
  ): string {
    return `${idir}|workflow|${entityType}|${entityNumber}|${jti}`;
  }

  findNestedValue(object, key) {
    const value = object[key];
    if (value !== undefined) {
      return value;
    } else {
      for (const keyName of Object.keys(object)) {
        if (object[keyName] !== null && typeof object[keyName] === 'object') {
          const found = this.findNestedValue(object[keyName], key);
          if (found) {
            return found;
          }
        }
      }
    }
  }

  findEntityInfo(body: object): [EntityType, string] {
    try {
      const entityNumber = this.findNestedValue(body, 'entityNumber');
      if (entityNumber !== undefined) {
        return [
          this.findNestedValue(body, 'entityType') as EntityType,
          entityNumber,
        ];
      }
      const incidentNumber = this.findNestedValue(body, 'incidentNumber');
      if (incidentNumber !== undefined) {
        return [EntityType.Incident, incidentNumber];
      }
      throw new Error('Entity number or type not found.');
    } catch (error: any) {
      this.logger.error({ error });
      return [undefined, undefined];
    }
  }

  recordTypeSearchSpecAppend(params, type: RecordType) {
    if (type === RecordType.Case) {
      params['searchspec'] =
        params['searchspec'] +
        ` AND ([${this.caseTypeFieldName}]="${CaseType.ChildServices}"` +
        ` OR [${this.caseTypeFieldName}]="${CaseType.FamilyServices}"` +
        ` OR [${this.caseTypeFieldName}]="${CaseType.CYSNFamilyServices}"` +
        ` OR [${this.caseTypeFieldName}]="${CaseType.Resource}")`;
    } else if (type == RecordType.Incident) {
      params['searchspec'] =
        params['searchspec'] +
        ` AND ([${this.incidentTypeFieldName}]="${IncidentType.ChildProtection}")`;
    }
    return params;
  }

  setCheckIdsHeader(res: Response, upstreamCallResponse) {
    const availableIds = new Set<string>();
    if (upstreamCallResponse.status >= 400) {
      this.logger.error({
        msg: upstreamCallResponse.response?.data,
        errorDetails: upstreamCallResponse.response?.data,
        buildNumber: this.buildNumber,
        function: this.setCheckIdsHeader.name,
        status: upstreamCallResponse.status,
      });
      if (upstreamCallResponse.status === 404) {
        res.setHeader(checkIdsReturnHeaderName, `[]`);
        return;
      }
      res.setHeader(checkIdsReturnHeaderName, ``);
      return;
    }
    for (const item of upstreamCallResponse.data.items) {
      if (item[`Id`]) {
        availableIds.add(item['Id']);
      } else if (item[`Row Id`]) {
        availableIds.add(item['Row Id']);
      }
    }
    res.setHeader(checkIdsReturnHeaderName, JSON.stringify([...availableIds]));
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
      return dateObject.toFormat(upstreamDateFormatNoTime);
    }
  }
  throw new BadRequestException([dateFormatError]);
}

export function isCurrentOrFutureISO8601Date(date: string): string {
  if (isISO8601(date, { strict: true })) {
    const dateObject = DateTime.fromISO(date.trim(), {
      zone: 'UTC',
    });
    const currentTimeUTC = DateTime.now().toUTC();
    if (dateObject >= currentTimeUTC) {
      return dateObject.toFormat(upstreamDateFormatNoTime);
    }
  }
  throw new BadRequestException([dateFormatFutureError]);
}

export function isISO8601DateUpstreamFormatter(date: string): string {
  if (isISO8601(date, { strict: true })) {
    const dateObject = DateTime.fromISO(date.trim(), {
      zone: 'UTC',
    });
    return dateObject.toFormat(upstreamDateFormat);
  }
  throw new BadRequestException([dateFormatError]);
}

export function isValidISO8601StartDateRange(
  startDate: string | undefined,
  endDate: string | undefined,
): string {
  if (isISO8601(startDate, { strict: true })) {
    const startDateObject = DateTime.fromISO(startDate.trim(), {
      zone: 'UTC',
    });
    if (typeof endDate == 'undefined') {
      return startDateObject.toFormat(upstreamDateFormat);
    }
    if (isISO8601(endDate, { strict: true })) {
      const endDateObject = DateTime.fromISO(endDate.trim(), {
        zone: 'UTC',
      });
      if (endDateObject >= startDateObject) {
        return startDateObject.toFormat(upstreamDateFormat);
      }
    }
  } else if (typeof startDate == 'undefined' && typeof endDate == 'undefined') {
    return startDate;
  }
  throw new BadRequestException([dateRangeFormatError]);
}

export function isValidISO8601EndDate(
  startDate: string | undefined,
  endDate: string | undefined,
): string {
  if (
    typeof startDate !== 'undefined' &&
    isISO8601(startDate, { strict: true })
  ) {
    const startDateObject = DateTime.fromISO(startDate.trim(), {
      zone: 'UTC',
    });
    if (typeof endDate == 'undefined') {
      return endDate;
    }
    if (isISO8601(endDate, { strict: true })) {
      const endDateObject = DateTime.fromISO(endDate.trim(), {
        zone: 'UTC',
      });
      if (endDateObject >= startDateObject) {
        return endDateObject.toFormat(upstreamDateFormat);
      }
    }
  } else if (typeof startDate == 'undefined' && typeof endDate == 'undefined') {
    return endDate;
  }
  throw new BadRequestException([endDateFormatError]);
}

export function isValidUpstreamFormatDate(date: string): string {
  const dateObject = DateTime.fromFormat(date, upstreamDateFormatNoTime, {
    zone: 'UTC',
  });
  if (dateObject.isValid === false) {
    throw new BadRequestException([upstreamDateFormatError]);
  }
  const currentTimeUTC = DateTime.now().toUTC();
  if (dateObject <= currentTimeUTC) {
    return date;
  }
  throw new BadRequestException([upstreamDateFormatError]);
}

export function isNotEmoji(input: string): string {
  const hasEmoji = emojiRegex.test(input);
  if (hasEmoji) {
    throw new BadRequestException([emojiError]);
  }
  return input;
}

export function isMedicalConditionValidForCategory(
  input: string,
  baseObject: object,
) {
  if (
    baseObject['Category'] &&
    isEnum(baseObject['Category'], ContactMedicalBehavioralCategory)
  ) {
    const baseCategory = baseObject[
      'Category'
    ] as ContactMedicalBehavioralCategory;
    const enumReference =
      ContactMedicalBehavioralCategoryConditionMap[baseCategory];
    if (isEnum(input, enumReference)) {
      return input as unknown as typeof enumReference;
    }
    const errorMessage = contactMedicalBehavioralConditionEnumError
      .replace('${category}', baseCategory)
      .replace('${enum}', Object.values(enumReference).toString());
    throw new BadRequestException([errorMessage]);
  }
  return input; // don't validate, it will fail based on Category anyway
}

export function isIdArray(input): Array<string> {
  if (typeof input === 'string') {
    const isIdArray = multiIdRegex.test(input);
    if (isIdArray) {
      return input.split(',');
    }
  }
  throw new BadRequestException([multiIdError]);
}

export function isPositiveIntegerString(input: string) {
  const integer = Number.parseFloat(input);
  if (Number.isNaN(integer) || !Number.isInteger(integer) || integer < 0) {
    throw new BadRequestException([isNotPostiveIntegerStringError]);
  }
  return input;
}
