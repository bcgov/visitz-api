import { recordCountHeaderName } from './parameter-constants';

const totalRecordCountHeadersSwagger = {
  [recordCountHeaderName]: {
    schema: { type: 'integer' },
    description:
      'Total number of records available for this query. Use StartRowNum to get more data if not all records needed are returned.',
    example: 1,
  },
};

export { totalRecordCountHeadersSwagger };
