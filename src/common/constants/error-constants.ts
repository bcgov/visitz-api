import { checkIdsParamName } from './parameter-constants';
import { upstreamDateFormatNoTime } from './upstream-constants';

export const childServicesTypeError =
  'Given case is not a Child Services case and cannot have Child/Youth visits.';

export const childServicesMedBehavTypeError =
  'Given contact cannot have Medical/Behvioral information.';

export const dateFormatError =
  'Date / time must meet the ISO-8601 standard, and cannot be in the future.';

export const dateFormatFutureError =
  'Date / time must meet the ISO-8601 standard, and cannot be in the past.';

export const dateFormatErrorAnyTime =
  'Date / time must meet the ISO-8601 standard.';

export const dateRangeFormatError =
  'Dates / times must meet the ISO-8601 standard, and end date must be greater than or equal to start date.';

export const endDateFormatError =
  'Dates / times must meet the ISO-8601 standard, and done date must be greater than or equal to planned date.';

export const upstreamDateFormatError =
  'Date must be valid, not in the future and in the ' +
  upstreamDateFormatNoTime +
  ' format.';

export const emojiError = 'Input must not contain emojis.';

export const virusInfectedError = 'Unsafe file.';

export const virusScanFailedError = 'Virus scan unavailable.';

export const fileTypeError =
  'File is not one of the allowed file types (jpg, png, pdf).';

export const restrictedNotOpenPostError =
  'Parent record is restricted on not in "Open" status, cannot submit additional data.';

export const caseloadIncludeEntityError =
  'At least one entity type must be included in a caseload request.';

export const multiIdError =
  `The ` +
  checkIdsParamName +
  ` parameter must contain a comma-seperated list of ids.`;

export const contactMedicalBehavioralConditionEnumError =
  'Condition must be one of the following values when Category is ${category}: ${enum}';

export const isNotPostiveIntegerStringError =
  'String must be a positive integer or 0';
