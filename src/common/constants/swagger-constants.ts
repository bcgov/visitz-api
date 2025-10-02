import {
  checkIdsParamName,
  checkIdsReturnHeaderName,
  recordCountHeaderName,
} from './parameter-constants';

const totalRecordCountHeadersSwagger = {
  [recordCountHeaderName]: {
    schema: { type: 'integer' },
    description:
      'Total number of records available for this query. Use StartRowNum to get more data if not all records needed are returned.',
    example: 1,
  },
};

const existingIdsRecordCountHeadersSwagger = {
  [recordCountHeaderName]: {
    ...totalRecordCountHeadersSwagger[recordCountHeaderName],
  },
  [checkIdsReturnHeaderName]: {
    schema: { type: 'string' },
    description:
      `If ${checkIdsParamName} is provided in the request, returns an array of the valid ids that exist for this user and parent entity. ` +
      `If there are no results, the header will be an empty array ([]). If there is an error with this check, the header will be an empty string.`,
    example: `[Id-1,Id-2]`,
  },
};

const noContentResponseSwagger = {
  description: 'Empty body. Returned when no records match the given criteria.',
};

const versionInfo = {
  name: 'version',
  type: 'integer',
  description: 'API version number.',
  example: 2,
  required: true,
};

export {
  totalRecordCountHeadersSwagger,
  existingIdsRecordCountHeadersSwagger,
  noContentResponseSwagger,
  versionInfo,
};
