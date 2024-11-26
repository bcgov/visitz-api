import { recordCountHeaderName } from './parameter-constants';
import { idirUsernameHeaderField } from './upstream-constants';

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

const headerInfo = [
  {
    name: 'version',
    description: 'API version number.',
    schema: { type: 'integer', default: 2, example: 2 },
    required: true,
  },
  {
    name: idirUsernameHeaderField,
    description: `User's IDIR. Only required for local development when using auth, as this will be populated from the user's JWT on the server.`,
    schema: { type: 'string', example: 'Idir-Here' },
    required: false,
  },
];

export { totalRecordCountHeadersSwagger, noContentResponseSwagger, headerInfo };
