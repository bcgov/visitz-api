import { Expose, Transform } from 'class-transformer';
import { isPastISO8601Date } from '../helpers/utilities/utilities.service';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { VisitDetails } from '../common/constants/enumerations';
import {
  childVisitEntityIdFieldName,
  childVisitIdirFieldName,
  childVisitType,
} from '../common/constants/upstream-constants';

export class PostInPersonVisitDto {
  @Transform(({ value }) => {
    return isPastISO8601Date(value);
  })
  @IsNotEmpty()
  @Expose()
  @ApiProperty({
    example: '2024-10-28T19:34:54',
    format: 'date-time',
    description:
      'The ISO8601 formatted date of the visit, expected to be provided in UTC. Must not be a future date or time.',
  })
  'Date of visit': string;

  // TODO: limit string length once given info about limits
  @IsNotEmpty()
  @Expose()
  @ApiProperty({
    example: 'Comments here',
    description: 'Visit comments',
  })
  'Visit Description': string;

  @IsEnum(VisitDetails)
  @Expose()
  @ApiProperty({
    example: VisitDetails.PrivateVisitInHome,
    description: 'The visit type',
    enum: VisitDetails,
  })
  'Visit Details Value': string;
}

// TODO: see if Type is a const. If not, add here.

// For use upstream only. Validation not done on parameters here
// as it should have already been done previously
export class PostInPersonVisitDtoUpstream {
  'Date of visit': string;

  [childVisitIdirFieldName]: string;

  [childVisitEntityIdFieldName]: string;

  'Type': string = childVisitType;

  'Visit Description': string;

  'Visit Details Value': string;

  constructor(object) {
    Object.assign(this, object);
  }
}
