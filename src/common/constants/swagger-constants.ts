import { recordCountHeaderName } from './parameter-constants';

const totalRecordCountHeadersSwagger = {
  [recordCountHeaderName]: {
    schema: { type: 'integer' },
    description:
      'Total number of records available for this query. Use StartRowNum to get more data if not all records needed are returned.',
    example: 1,
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
  noContentResponseSwagger,
  versionInfo,
};
