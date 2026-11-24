import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { PostContactLanguagesDto } from './post-contact-languages.dto';
import {
  contactLanguagesIcmTypeMax,
  contactLanguagesLanguageNameMax,
} from '../common/constants/upstream-constants';

describe('PostContactLanguagesDto Language Name tests', () => {
  it.each([['English'], ['Not A Real Language']])(
    `should accept any string value for Language Name, unrelated to a predefined enum`,
    async (languageName) => {
      const postContactLanguages = {
        'Language Name': languageName,
      };
      const postContactLanguagesDto = plainToInstance(
        PostContactLanguagesDto,
        postContactLanguages,
      );
      expect(postContactLanguagesDto['Language Name']).toBe(languageName);
      const errors = await validate(postContactLanguagesDto);
      expect(errors).toHaveLength(0);
    },
  );

  it.each([
    [undefined],
    [''],
    ['a'.repeat(contactLanguagesLanguageNameMax + 1)],
  ])(
    `should have a validation error when Language Name is missing, empty, or exceeds max length`,
    async (languageName) => {
      const postContactLanguages = {
        'Language Name': languageName,
      };
      const postContactLanguagesDto = plainToInstance(
        PostContactLanguagesDto,
        postContactLanguages,
      );
      const errors = await validate(postContactLanguagesDto);
      expect(errors.length).toBeGreaterThan(0);
    },
  );
});

describe('PostContactLanguagesDto required field tests', () => {
  it(`should have no validation errors when only Language Name is provided`, async () => {
    const postContactLanguages = {
      'Language Name': 'English',
    };
    const postContactLanguagesDto = plainToInstance(
      PostContactLanguagesDto,
      postContactLanguages,
    );
    const errors = await validate(postContactLanguagesDto);
    expect(errors).toHaveLength(0);
  });

  it(`should only report Language Name as a validation error when the entire body is empty`, async () => {
    const postContactLanguagesDto = plainToInstance(
      PostContactLanguagesDto,
      {},
    );
    const errors = await validate(postContactLanguagesDto);
    expect(errors.map((error) => error.property)).toEqual(['Language Name']);
  });
});

describe('PostContactLanguagesDto ICM Type tests', () => {
  it(`should not have validation errors when ICM Type is omitted`, async () => {
    const postContactLanguages = {
      'Language Name': 'English',
    };
    const postContactLanguagesDto = plainToInstance(
      PostContactLanguagesDto,
      postContactLanguages,
    );
    expect(postContactLanguagesDto['ICM Type']).toBeUndefined();
    const errors = await validate(postContactLanguagesDto);
    expect(errors).toHaveLength(0);
  });

  it.each([['Sign Language'], ['Not A Real ICM Type']])(
    `should accept any string value for ICM Type, unrelated to a predefined enum`,
    async (icmType) => {
      const postContactLanguages = {
        'Language Name': 'English',
        'ICM Type': icmType,
      };
      const postContactLanguagesDto = plainToInstance(
        PostContactLanguagesDto,
        postContactLanguages,
      );
      expect(postContactLanguagesDto['ICM Type']).toBe(icmType);
      const errors = await validate(postContactLanguagesDto);
      expect(errors).toHaveLength(0);
    },
  );

  it.each([[''], ['a'.repeat(contactLanguagesIcmTypeMax + 1)]])(
    `should have a validation error when ICM Type is empty or exceeds max length`,
    async (icmType) => {
      const postContactLanguages = {
        'Language Name': 'English',
        'ICM Type': icmType,
      };
      const postContactLanguagesDto = plainToInstance(
        PostContactLanguagesDto,
        postContactLanguages,
      );
      const errors = await validate(postContactLanguagesDto);
      expect(errors.length).toBeGreaterThan(0);
    },
  );
});
