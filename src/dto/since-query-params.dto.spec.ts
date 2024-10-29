import { plainToInstance } from 'class-transformer';
import { SinceQueryParams } from './since-query-params.dto';

describe('SinceQueryParams transform tests', () => {
  it.each([['2024-10-24T22:16:24+0000'], ['2024-12-31']])(
    `should return the parameter when given ISO-8601 input`,
    (since) => {
      const queryParam = { since: since };
      const queryParamDto = plainToInstance(SinceQueryParams, queryParam);
      expect(queryParamDto.since).toBe(since);
    },
  );

  it.each([['abcdefg'], ['2024-31-02']])(
    `should return undefined when given non-ISO-8601 input`,
    (since) => {
      const queryParam = { since: since };
      const queryParamDto = plainToInstance(SinceQueryParams, queryParam);
      expect(queryParamDto.since).toBe(undefined);
    },
  );
});
