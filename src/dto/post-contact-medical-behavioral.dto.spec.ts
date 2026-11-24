import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { PostContactMedicalBehavioralDto } from './post-contact-medical-behavioral.dto';
import {
  contactMedicalBehavioralCategoryMax,
  contactMedicalBehavioralConditionMax,
} from '../common/constants/upstream-constants';

describe('PostContactMedicalBehavioralDto transform tests', () => {
  it.each([
    [
      '2024-10-24T22:16:24+0000',
      '10/24/2024',
      'name',
      '2024-10-24T22:16:24+0000',
      '2024-10-24T22:16:24+0000',
      'Special Diet',
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

  describe('Category and Condition field tests', () => {
    it.each([['Allergy', undefined]])(
      `should not have validation errors when Condition is omitted for Category %s`,
      async (category, condition) => {
        const postContactMedicalBehavioral = {
          Category: category,
          Condition: condition,
        };
        const postContactMedicalBehavioralDto = plainToInstance(
          PostContactMedicalBehavioralDto,
          postContactMedicalBehavioral,
        );
        expect(postContactMedicalBehavioralDto['Condition']).toBeUndefined();
        const errors = await validate(postContactMedicalBehavioralDto);
        expect(errors).toHaveLength(0);
      },
    );

    it.each([
      ['Allergy', 'Special Diet'],
      ['NotARealCategory', 'NotARealCondition'],
      ['Allergy', 'Insomnia'],
    ])(
      `should accept any string value, unrelated to Category or a predefined enum, for Condition %s / %s`,
      async (category, condition) => {
        const postContactMedicalBehavioral = {
          Category: category,
          Condition: condition,
        };
        const postContactMedicalBehavioralDto = plainToInstance(
          PostContactMedicalBehavioralDto,
          postContactMedicalBehavioral,
        );
        expect(postContactMedicalBehavioralDto['Category']).toBe(category);
        expect(postContactMedicalBehavioralDto['Condition']).toBe(condition);
        const errors = await validate(postContactMedicalBehavioralDto);
        expect(errors).toHaveLength(0);
      },
    );

    it.each([
      [undefined],
      [''],
      ['a'.repeat(contactMedicalBehavioralCategoryMax + 1)],
    ])(
      `should have a validation error when Category is missing, empty, or exceeds max length`,
      async (category) => {
        const postContactMedicalBehavioral = {
          Category: category,
          Condition: 'Special Diet',
        };
        const postContactMedicalBehavioralDto = plainToInstance(
          PostContactMedicalBehavioralDto,
          postContactMedicalBehavioral,
        );
        const errors = await validate(postContactMedicalBehavioralDto);
        expect(errors.length).toBeGreaterThan(0);
      },
    );

    it.each([[''], ['a'.repeat(contactMedicalBehavioralConditionMax + 1)]])(
      `should have a validation error when Condition is empty or exceeds max length`,
      async (condition) => {
        const postContactMedicalBehavioral = {
          Category: 'Allergy',
          Condition: condition,
        };
        const postContactMedicalBehavioralDto = plainToInstance(
          PostContactMedicalBehavioralDto,
          postContactMedicalBehavioral,
        );
        const errors = await validate(postContactMedicalBehavioralDto);
        expect(errors.length).toBeGreaterThan(0);
      },
    );
  });
});
