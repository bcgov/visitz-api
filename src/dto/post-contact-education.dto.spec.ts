import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { PostContactEducationDto } from './post-contact-education.dto';
import { contactEducationDegreeMax } from '../common/constants/upstream-constants';

describe('PostContactEducationDto Degree tests', () => {
  it.each([['Some High School'], ['Not A Real Degree']])(
    `should accept any string value for Degree, unrelated to a predefined enum`,
    async (degree) => {
      const postContactEducation = {
        Degree: degree,
      };
      const postContactEducationDto = plainToInstance(
        PostContactEducationDto,
        postContactEducation,
      );
      expect(postContactEducationDto['Degree']).toBe(degree);
      const errors = await validate(postContactEducationDto);
      expect(errors).toHaveLength(0);
    },
  );

  it.each([[undefined], [''], ['a'.repeat(contactEducationDegreeMax + 1)]])(
    `should have a validation error when Degree is missing, empty, or exceeds max length`,
    async (degree) => {
      const postContactEducation = {
        Degree: degree,
      };
      const postContactEducationDto = plainToInstance(
        PostContactEducationDto,
        postContactEducation,
      );
      const errors = await validate(postContactEducationDto);
      expect(errors.length).toBeGreaterThan(0);
    },
  );
});
