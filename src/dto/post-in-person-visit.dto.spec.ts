import { plainToInstance } from 'class-transformer';
import { PostInPersonVisitDto } from './post-in-person-visit.dto';
import { VisitDetails } from '../common/constants/enumerations';

describe('PostInPersonVisitDto transform tests', () => {
  it.each([
    ['2024-10-24T22:16:24+0000', '10/24/2024 22:16:24'],
    ['2020-12-31', '12/31/2020 00:00:00'],
  ])(
    `should transform the date when given good, past ISO-8601 input`,
    (date, expected) => {
      const postInPersonVisit = {
        'Date of visit': date,
        'Visit Description': 'comment',
        'Visit Details Value': VisitDetails.ExemptionVisitOther,
      };
      const postInPersonVisitDto = plainToInstance(
        PostInPersonVisitDto,
        postInPersonVisit,
      );
      expect(postInPersonVisitDto['Date of visit']).toBe(expected);
    },
  );
});
