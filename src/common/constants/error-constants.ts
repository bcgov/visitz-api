import { checkIdsParamName } from './parameter-constants';
import { upstreamDateFormatNoTime } from './upstream-constants';

export const childServicesTypeError =
  'Given case is not a Child Services case and cannot have Child/Youth visits.';

export const dateFormatError =
  'Date / time must met the ISO-8601 standard, and cannot be in the future.';

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
