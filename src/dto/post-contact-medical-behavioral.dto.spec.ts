import { plainToInstance } from 'class-transformer';
import { PostContactMedicalBehavioralDto } from './post-contact-medical-behavioral.dto';
import { ContactMedicalBehavioralAllergyCondition } from '../common/constants/enumerations';

describe('PostContactMedicalBehavioralDto transform tests', () => {
  it.each([
    [
      '2024-10-24T22:16:24+0000',
      '10/24/2024',
      'name',
      '2024-10-24T22:16:24+0000',
      '2024-10-24T22:16:24+0000',
      ContactMedicalBehavioralAllergyCondition.SpecialDiet,
      'ab',
      'cd',
    ],
    [
      '2020-12-31',
      '12/31/2020',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ],
  ])(
    `should transform the date when given good, past ISO-8601 input`,
    (
      date,
      expected,
      diagnosedBy,
      startDate,
      endDate,
      condition,
      treatmentPlan,
      comments,
    ) => {
      const postContactMedicalBehavioral = {
        'Diagnosis Date': date,
        'Diagnosed By': diagnosedBy,
        'Start Date': startDate,
        'End Date': endDate,
        Category: 'Allergy',
        Condition: condition,
        'Treatment Plan': treatmentPlan,
        Comments: comments,
      };
      const postContactMedicalBehavioralDto = plainToInstance(
        PostContactMedicalBehavioralDto,
        postContactMedicalBehavioral,
      );
      expect(postContactMedicalBehavioralDto['Diagnosis Date']).toBe(expected);
    },
  );
});
