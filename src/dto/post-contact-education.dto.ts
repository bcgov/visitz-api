import { ApiSchema, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import {
  ContactEducationDegree,
  YNEnum,
} from '../common/constants/enumerations';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { contactEducationCommentsMax } from '../common/constants/upstream-constants';
import {
  isISO8601DateUpstreamFormatter,
  isValidISO8601EndDate,
} from '../helpers/utilities/utilities.service';
import { dateRangeFormatError } from '../common/constants/error-constants';

@Exclude()
@ApiSchema({ name: 'PostContactEducationRequest' })
export class PostContactEducationDto {
  @IsEnum(ContactEducationDegree)
  @ApiProperty({
    example: ContactEducationDegree.SomeHighSchool,
    description: 'The level of education reached for the contact.',
    enum: ContactEducationDegree,
  })
  @Expose()
  'Degree': string;

  @IsOptional()
  @IsString()
  @MaxLength(contactEducationCommentsMax)
  @ApiProperty({
    example: 'Comments here',
    description: 'Comments for the education entry.',
    required: false,
    maxLength: contactEducationCommentsMax,
  })
  @Expose()
  'Comments'?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    if (value != undefined) return isISO8601DateUpstreamFormatter(value);
    else return value;
  })
  @ApiProperty({
    example: '1970-01-01T00:00:00',
    description:
      'Last date attended for this institution, expected to be provided in UTC.',
    format: 'date-time',
    required: false,
  })
  @Expose()
  'Date Last Attended'?: string;

  @IsOptional()
  @ValidateIf(
    (dto) =>
      typeof dto['End Date'] != 'undefined' ||
      typeof dto['Start Date'] != 'undefined',
  )
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Transform(({ value, key, obj }) => {
    return isValidISO8601EndDate(
      obj['Start Date'],
      value,
      true,
      dateRangeFormatError,
    );
  })
  @Expose()
  @ApiProperty({
    example: '1970-01-01T00:00:00',
    description:
      'End date of attendance for this institution, expected to be provided in UTC. Must be greater than or equal to start date',
    format: 'date-time',
    required: false,
  })
  @Expose()
  'End Date'?: string;

  @IsOptional()
  @IsEnum(YNEnum)
  @Expose()
  @ApiProperty({
    example: YNEnum.False,
    default: YNEnum.False,
    enum: YNEnum,
    description: 'Whether or not the contact has an IEP at this institution',
  })
  @Expose()
  'Individual Education Plan'?: string;

  @IsOptional()
  @IsEnum(YNEnum)
  @Expose()
  @ApiProperty({
    example: YNEnum.False,
    default: YNEnum.False,
    enum: YNEnum,
    description:
      'Whether or not the contact has a learning assistant at this institution',
  })
  @Expose()
  'Learning Assistant'?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    if (value != undefined) return isISO8601DateUpstreamFormatter(value);
    else return value;
  })
  @Expose()
  @ApiProperty({
    example: '1970-01-01T00:00:00',
    format: 'date-time',
    description:
      'The ISO8601 formatted start date, expected to be provided in UTC.',
    required: false,
  })
  'Start Date'?: string;
}

// For use upstream only. Validation not done on parameters here
// as it should have already been done previously
export class PostContactEducationDtoUpstream {
  Id: string;
  'Degree': string;
  'Comments'?: string;
  'Date Last Attended'?: string;
  'End Date'?: string;
  'Individual Education Plan'?: YNEnum;
  'Learning Assistant'?: YNEnum;
  'Start Date'?: string;

  constructor(object) {
    Object.assign(this, object);
  }
}
