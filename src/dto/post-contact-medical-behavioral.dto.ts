import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, MaxLength, ValidateIf } from 'class-validator';
import {
  isISO8601DateUpstreamFormatter,
  isNotEmoji,
  isPastISO8601Date,
  isValidISO8601StartDateRange,
} from '../helpers/utilities/utilities.service';
import {
  contactMedicalBehavioralCategoryMax,
  contactMedicalBehavioralCommentsMax,
  contactMedicalBehavioralConditionMax,
  contactMedicalBehavioralDiagnosedByMax,
  contactMedicalBehavioralTreatmentPlanMax,
} from '../common/constants/upstream-constants';

@Exclude()
@ApiSchema({ name: 'PostContactMedicalBehavioralRequest' })
export class PostContactMedicalBehavioralDto {
  @IsNotEmpty()
  @MaxLength(contactMedicalBehavioralCategoryMax)
  @Transform(({ value }) => {
    if (value != undefined) return isNotEmoji(value);
    else return value;
  })
  @Expose()
  @ApiProperty({
    example: 'Allergy',
    description: 'The category of the medical or behavioral condition.',
    maxLength: contactMedicalBehavioralCategoryMax,
  })
  'Category': string;

  @IsOptional()
  @IsNotEmpty()
  @MaxLength(contactMedicalBehavioralConditionMax)
  @Transform(({ value }) => {
    if (value != undefined) return isNotEmoji(value);
    else return value;
  })
  @Expose()
  @ApiProperty({
    example: 'Environmental sensitivities',
    description: 'The condition name.',
    maxLength: contactMedicalBehavioralConditionMax,
  })
  'Condition'?: string;

  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (value != undefined) return isPastISO8601Date(value);
    else return value;
  })
  @Expose()
  @ApiProperty({
    example: '1970-01-01T00:00:00',
    format: 'date-time',
    description:
      'The ISO8601 formatted date of diagnosis, expected to be provided in UTC. Must not be a future date or time.',
  })
  'Diagnosis Date'?: string;

  @IsOptional()
  @IsNotEmpty()
  @MaxLength(contactMedicalBehavioralDiagnosedByMax)
  @Transform(({ value }) => {
    if (value != undefined) return isNotEmoji(value);
    else return value;
  })
  @Expose()
  @ApiProperty({
    example: 'Diagnoser here',
    description: 'The diagnoser for contact medical behavioral.',
    maxLength: contactMedicalBehavioralDiagnosedByMax,
  })
  'Diagnosed By'?: string;

  @ValidateIf(
    (dto) =>
      typeof dto['End Date'] != 'undefined' ||
      typeof dto['Start Date'] != 'undefined',
  )
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Transform(({ value, key, obj }) => {
    return isValidISO8601StartDateRange(value, obj['End Date']);
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

  @ValidateIf((dto) => typeof dto['End Date'] != 'undefined')
  @Transform(({ value }) => {
    if (value != undefined) return isISO8601DateUpstreamFormatter(value);
    else return value;
  })
  @Expose()
  @ApiProperty({
    example: '1970-01-01T00:00:00',
    format: 'date-time',
    description:
      'The ISO8601 formatted end date, expected to be provided in UTC. Must provide a start date if providing this field.',
    required: false,
  })
  'End Date'?: string;

  @IsOptional()
  @IsNotEmpty()
  @MaxLength(contactMedicalBehavioralTreatmentPlanMax)
  @Transform(({ value }) => {
    if (value != undefined) return isNotEmoji(value);
    else return value;
  })
  @Expose()
  @ApiProperty({
    example: 'Treatment Plan here',
    description: 'Treatment Plan for contact medical behavioral.',
    maxLength: contactMedicalBehavioralTreatmentPlanMax,
  })
  'Treatment Plan'?: string;

  @IsOptional()
  @IsNotEmpty()
  @MaxLength(contactMedicalBehavioralCommentsMax)
  @Transform(({ value }) => {
    if (value != undefined) return isNotEmoji(value);
    else return value;
  })
  @Expose()
  @ApiProperty({
    example: 'Comments here',
    description: 'Comments for contact medical behavioral.',
    maxLength: contactMedicalBehavioralCommentsMax,
  })
  'Comments'?: string;
}

// For use upstream only. Validation not done on parameters here
// as it should have already been done previously
export class PostContactMedicalBehavioralDtoUpstream {
  Id: string;
  'Case Id': string;
  'Category': string;
  'Condition'?: string;
  'Diagnosis Date'?: string;
  'Diagnosed By'?: string;
  'Start Date'?: string;
  'End Date'?: string;
  'Treatment Plan'?: string;
  'Type': string;
  Comments?: string;

  constructor(object) {
    Object.assign(this, object);
  }
}
