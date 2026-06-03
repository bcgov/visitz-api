import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import {
  ActivityActionBy,
  ActivityPriority,
  ActivityStatus,
  YesNoEnum,
} from '../common/constants/enumerations';
import { idRegex } from '../common/constants/parameter-constants';
import {
  isCurrentOrFutureISO8601Date,
  isISO8601DateUpstreamFormatter,
  isPositiveIntegerString,
  isValidISO8601EndDate,
} from '../helpers/utilities/utilities.service';
import {
  activityActionCodeMax,
  activityApptAlarmTimeMax,
  activityCategoryMax,
  activityDelayMax,
  activityDescriptionMax,
  activityDurationMinutesMax,
  activityICMSubTypeMax,
  activityMeetingLocationMax,
  activityPlanNameMax,
  activityResultCodeMax,
  activitySequenceMax,
  activityTypeMax,
} from '../common/constants/upstream-constants';

@Exclude()
@ApiSchema({ name: 'PostActivityRequest' })
export class PostActivityDto {
  @IsNotEmpty()
  @IsEnum(ActivityActionBy)
  @Expose()
  @ApiProperty({
    example: ActivityActionBy.Staff,
    default: ActivityActionBy.Staff,
    description: 'Who performed the action.',
    enum: ActivityActionBy,
  })
  'Action By': string = ActivityActionBy.Staff;

  @IsOptional()
  @IsString()
  @MaxLength(activityActionCodeMax)
  @Expose()
  @ApiProperty({
    example: '',
    description: 'The action code.',
    required: false,
    maxLength: activityActionCodeMax,
  })
  'Action Code'?: string;

  @IsOptional()
  @IsEnum(YesNoEnum)
  @Expose()
  @ApiProperty({
    example: YesNoEnum.True,
    default: YesNoEnum.True,
    description: 'If the activity has an alarm.',
    enum: YesNoEnum,
  })
  'Alarm'?: string = YesNoEnum.True;

  @IsOptional()
  @IsNumberString()
  @MaxLength(activityApptAlarmTimeMax)
  @Transform(({ value }) => {
    if (value != undefined) return isPositiveIntegerString(value);
    else return value;
  })
  @Expose()
  @ApiProperty({
    example: '60',
    description: 'Alarm time in minutes. Must be a positive integer or 0.',
    maxLength: activityApptAlarmTimeMax,
    required: false,
  })
  'Appt Alarm Time Min'?: string;

  @IsOptional()
  @IsString()
  @MaxLength(activityCategoryMax)
  @Expose()
  @ApiProperty({
    example: 'General',
    description: 'The category of activity.',
    required: false,
    maxLength: activityCategoryMax,
  })
  'Category'?: string;

  @IsOptional()
  @IsNumberString()
  @MaxLength(activityDelayMax)
  @Transform(({ value }) => {
    if (value != undefined) return isPositiveIntegerString(value);
    else return value;
  })
  @Expose()
  @ApiProperty({
    example: '60',
    description: 'The delay. Must be a positive integer or 0.',
    maxLength: activityDelayMax,
    required: false,
  })
  'Delay'?: string;

  @IsOptional()
  @IsString()
  @MaxLength(activityDescriptionMax)
  @Expose()
  @ApiProperty({
    example: 'Description here',
    description: 'The description of the activity.',
    required: false,
    maxLength: activityDescriptionMax,
  })
  'Description'?: string;

  @IsOptional()
  @ValidateIf(
    (dto) =>
      typeof dto['Done'] != 'undefined' || typeof dto['Planned'] != 'undefined',
  )
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Transform(({ value, key, obj }) => {
    return isValidISO8601EndDate(obj['Planned'], value);
  })
  @Expose()
  @ApiProperty({
    example: '1970-01-01T00:00:00',
    format: 'date-time',
    description:
      'The ISO8601 formatted done date, expected to be provided in UTC. Must be after the planned date.',
    required: false,
  })
  'Done'?: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => {
    if (value != undefined) return isCurrentOrFutureISO8601Date(value);
    else return value;
  })
  @Expose()
  @ApiProperty({
    example: '1970-01-01T00:00:00',
    format: 'date-time',
    description:
      'The ISO8601 formatted due date, expected to be provided in UTC. Must be equal to or greater than the current datetime.',
  })
  'Due': string;

  @IsNotEmpty()
  @IsNumberString()
  @MaxLength(activityDurationMinutesMax)
  @Transform(({ value }) => {
    if (value != undefined) return isPositiveIntegerString(value);
    else return value;
  })
  @Expose()
  @ApiProperty({
    example: '60',
    default: '0',
    description:
      'Activity duration in minutes. Must be a positive integer or 0.',
    maxLength: activityDurationMinutesMax,
    required: true,
  })
  'Duration Minutes': string = '0';

  @IsOptional()
  @IsString()
  @MaxLength(activityICMSubTypeMax)
  @Expose()
  @ApiProperty({
    example: 'Visit',
    description:
      'The sub type of activity. This is an enum related to the "Type" parameter, so you may get upstream errors for invalid values.',
    required: false,
    maxLength: activityICMSubTypeMax,
  })
  'ICM Sub Type'?: string;

  @IsOptional()
  @IsString()
  @MaxLength(activityMeetingLocationMax)
  @Expose()
  @ApiProperty({
    example: 'Location',
    description: 'The meeting location.',
    required: false,
    maxLength: activityMeetingLocationMax,
  })
  'MeetingLocation'?: string;

  @IsNotEmpty()
  @Matches(idRegex)
  @Expose()
  @ApiProperty({
    example: 'Ministry-Id-Here',
    description: 'The Id of the ministry for this activity.',
    required: true,
  })
  'Ministry Id': string;

  @IsOptional()
  @IsString()
  @MaxLength(activityPlanNameMax)
  @Expose()
  @ApiProperty({
    example: '',
    description: 'The plan name.',
    required: false,
    maxLength: activityPlanNameMax,
  })
  'Plan Name'?: string;

  @IsNotEmpty()
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
      'The ISO8601 formatted due date, expected to be provided in UTC.',
  })
  'Planned': string;

  @IsOptional()
  @Matches(idRegex)
  @Expose()
  @ApiProperty({
    example: 'Contact-Id-Here',
    description: 'The Id of the contact you wish to link to the activity.',
    required: false,
  })
  'Primary Contact Id'?: string;

  @IsNotEmpty()
  @IsEnum(ActivityPriority)
  @Expose()
  @ApiProperty({
    example: ActivityPriority.Standard,
    default: ActivityPriority.Standard,
    description: 'The priority of the activity.',
    enum: ActivityPriority,
  })
  'Priority': string = ActivityPriority.Standard;

  @IsOptional()
  @IsEnum(YesNoEnum)
  @Expose()
  @ApiProperty({
    example: YesNoEnum.False,
    default: YesNoEnum.False,
    description: 'If the activity should repeat.',
    enum: YesNoEnum,
  })
  'Repeating'?: string;

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
      'The ISO8601 formatted expiry date for repeating, expected to be provided in UTC.',
  })
  'Repeating Expires'?: string;

  @IsOptional()
  @IsString()
  @MaxLength(activityResultCodeMax)
  @Expose()
  @ApiProperty({
    example: '',
    description: 'The result code.',
    required: false,
    maxLength: activityResultCodeMax,
  })
  'Result Code'?: string;

  @IsOptional()
  @IsString()
  @MaxLength(activitySequenceMax)
  @Expose()
  @ApiProperty({
    example: '01-01',
    description: 'The sequence number.',
    required: false,
    maxLength: activitySequenceMax,
  })
  'Sequence'?: string;

  @IsOptional()
  @IsEnum(YesNoEnum)
  @Expose()
  @ApiProperty({
    example: YesNoEnum.False,
    default: YesNoEnum.False,
    description: 'Whether to show the activity in the contact profile',
    enum: YesNoEnum,
    required: false,
  })
  'Show In Contact Profile'?: string;

  @IsNotEmpty()
  @IsEnum(ActivityStatus)
  @Expose()
  @ApiProperty({
    example: ActivityStatus.Open,
    default: ActivityStatus.Open,
    description: 'The status of the activity',
    enum: ActivityStatus,
  })
  'Status': string = ActivityStatus.Open;

  @IsNotEmpty()
  @IsString()
  @MaxLength(activityTypeMax)
  @Expose()
  @ApiProperty({
    example: 'Appointment',
    description:
      'The type of activity. This is an enum, so you may get upstream errors for invalid values.',
    maxLength: activityTypeMax,
  })
  'Type': string;
}

// For use upstream only. Validation not done on parameters here
// as it should have already been done previously
export class PostActivityDtoUpstream {
  'Id': string;

  'Case Id'?: string;

  'Incident Id'?: string;

  'Activity SR Id'?: string;

  'ICM Memo Id'?: string;

  'Action By': ActivityActionBy;

  'Action Code'?: string;

  'Alarm': YesNoEnum;

  'Appt Alarm Time Min'?: string;

  'Category'?: string;

  'Delay'?: string;

  'Description'?: string;

  'Done'?: string;

  'Due': string;

  'Duration Minutes': string;

  'ICM Sub Type'?: string;

  'MeetingLocation'?: string;

  'Ministry Id': string;

  'Plan Name'?: string;

  'Planned': string;

  'Primary Contact Id'?: string;

  'Priority': ActivityPriority;

  'Repeating'?: YesNoEnum;

  'Repeating Expires'?: string;

  'Result Code'?: string;

  'Sequence'?: string;

  'Show In Contact Profile'?: YesNoEnum;

  'Status': ActivityStatus;

  'Type': string;

  'Primary Owned By': string;

  'ICM Type': string;

  constructor(object) {
    Object.assign(this, object);
  }
}
