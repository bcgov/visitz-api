import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import {
  ActivityPlanStatus,
  YesNoEnum,
  YNEnum,
} from '../common/constants/enumerations';
import {
  activityPlanCommentsMax,
  activityPlanTemplateMax,
} from '../common/constants/upstream-constants';
import { isPastISO8601Date } from '../helpers/utilities/utilities.service';

@Exclude()
@ApiSchema({ name: 'PostActivityPlanRequest' })
export class PostActivityPlanDto {
  @IsOptional()
  @IsString()
  @MaxLength(activityPlanCommentsMax)
  @Expose()
  @ApiProperty({
    example: 'Comments here',
    description: 'Comments for the activity plan.',
    required: false,
    maxLength: activityPlanCommentsMax,
  })
  'Comments'?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value != undefined) return isPastISO8601Date(value);
    else return value;
  })
  @Expose()
  @ApiProperty({
    example: '1970-01-01T00:00:00',
    format: 'date-time',
    description:
      'The ISO8601 formatted completed date, expected to be provided in UTC. Must not be a future date or time.',
    required: false,
  })
  'Completed Date'?: string;

  @IsOptional()
  @IsEnum(YNEnum)
  @Expose()
  @ApiProperty({
    example: YNEnum.False,
    default: YNEnum.False,
    description: 'If the activity plan is shared.',
    enum: YNEnum,
    required: false,
  })
  'Shared Flag'?: string;

  @IsNotEmpty()
  @IsEnum(ActivityPlanStatus)
  @Expose()
  @ApiProperty({
    example: ActivityPlanStatus.Open,
    description: 'The status of the activity plan.',
    enum: ActivityPlanStatus,
  })
  'Status': string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(activityPlanTemplateMax)
  @Expose()
  @ApiProperty({
    example: 'Template here',
    description: 'The template used for the activity plan.',
    maxLength: activityPlanTemplateMax,
  })
  'Template': string;
}

// For use upstream only. Validation not done on parameters here
// as it should have already been done previously
export class PostActivityPlanDtoUpstream {
  'Id': string;

  'Comments'?: string;

  'Completed Date'?: string;

  'Shared Flag'?: YesNoEnum;

  'Status': string;

  'Template': string;

  constructor(object) {
    Object.assign(this, object);
  }
}
