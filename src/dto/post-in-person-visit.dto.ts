import { Exclude, Expose, Transform, Type } from 'class-transformer';
import {
  isNotEmoji,
  isPastISO8601Date,
} from '../helpers/utilities/utilities.service';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  MaxLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { VisitDetails } from '../common/constants/enumerations';
import {
  childVisitEntityIdFieldName,
  childVisitType,
  visitDescriptionMax,
  visitDetailsMax,
} from '../common/constants/upstream-constants';

@Exclude()
@ApiSchema({ name: 'PostInPersonVisitDetail' })
class PostInPersonVisitDetail {
  @IsEnum(VisitDetails)
  @MaxLength(visitDetailsMax)
  @Expose()
  @ApiProperty({
    example: VisitDetails.PrivateVisitInHome,
    description: 'The visit type.',
    enum: VisitDetails,
    maxLength: visitDetailsMax,
  })
  'Visit Detail Value': string;
}

@Exclude()
@ApiSchema({ name: 'PostInPersonVisitRequest' })
export class PostInPersonVisitDto {
  @Transform(({ value }) => {
    return isPastISO8601Date(value);
  })
  @IsNotEmpty()
  @Expose()
  @ApiProperty({
    example: '1970-01-01T00:00:00',
    format: 'date-time',
    description:
      'The ISO8601 formatted date of the visit, expected to be provided in UTC. Must not be a future date or time.',
  })
  'Date of visit': string;

  @IsNotEmpty()
  @MaxLength(visitDescriptionMax)
  @Transform(({ value }) => {
    return isNotEmoji(value);
  })
  @Expose()
  @ApiProperty({
    example: 'Comments here',
    description: 'Visit comments',
    maxLength: visitDescriptionMax,
  })
  'Visit Description': string;

  @ValidateIf(
    (dto) =>
      typeof dto.VisitDetails === 'undefined' ||
      (dto.VisitDetails && dto['Visit Details Value']),
  )
  @IsEnum(VisitDetails)
  @MaxLength(visitDetailsMax)
  @Expose()
  @ApiProperty({
    example: VisitDetails.PrivateVisitInHome,
    description:
      'The visit type. Either this field or the VisitDetails array is required. The array takes precedence if both are present.',
    enum: VisitDetails,
    maxLength: visitDetailsMax,
  })
  'Visit Details Value'?: string | undefined;

  @ValidateIf(
    (dto) =>
      typeof dto['Visit Details Value'] === 'undefined' ||
      (dto.VisitDetails && dto['Visit Details Value']),
  )
  @ValidateNested()
  @IsArray()
  @ArrayNotEmpty()
  @Expose()
  @ApiProperty({
    type: PostInPersonVisitDetail,
    isArray: true,
    description:
      'Either this array or the Visit Details Value field is required. This array takes precedence if both are present.',
  })
  @Type(() => PostInPersonVisitDetail)
  VisitDetails?: Array<PostInPersonVisitDetail> | undefined;
}

// For use upstream only. Validation not done on parameters here
// as it should have already been done previously
export class PostInPersonVisitDtoUpstream {
  'Date of visit': string;

  [childVisitEntityIdFieldName]: string;

  'Type': string = childVisitType;

  'Visit Description': string;

  'VisitDetails': Array<VisitDetail>;

  'Id': string;

  constructor(object) {
    Object.assign(this, object);
  }
}

export class VisitDetail {
  'Visit Detail Value': string;

  constructor(object) {
    Object.assign(this, object);
  }
}
