import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  createdByFieldName,
  updatedByFieldName,
} from '../common/constants/upstream-constants';

/*
 * Examples
 */
export const InPersonVisitsSingleResponseCaseExample = {
  Name: 'Name here',
  'Visit Description': 'description',
  Id: 'Id-here',
  Type: 'In Person Child Youth',
  'Date of visit': '01/01/1970 00:00:00',
  'Visit Details Value': 'comment',
  'Parent Id': 'Entity-Id-here',
  'Login Name': 'Idir-here',
  [createdByFieldName]: 'Creator-Id-Here',
  Created: '01/01/1970 00:00:00',
  [updatedByFieldName]: 'Updater-Id-Here',
  Updated: '01/01/1970 00:00:00',
};

export const InPersonVisitsListResponseCaseExample = {
  items: [
    {
      ...InPersonVisitsSingleResponseCaseExample,
      'Date of visit': '11/09/2024 10:36:25',
    },
    InPersonVisitsSingleResponseCaseExample,
  ],
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Name, ...PostInnerBody } = InPersonVisitsSingleResponseCaseExample;

export const PostInPersonVisitResponseExample = {
  items: [PostInnerBody],
};

/*
 * Model definitions
 */
@Exclude()
@ApiSchema({ name: 'InPersonVisit' })
export class InPersonVisitsEntity {
  @ApiProperty({
    example: InPersonVisitsSingleResponseCaseExample['Name'],
    required: false,
  })
  @Expose()
  Name: string;

  @ApiProperty({
    example: InPersonVisitsSingleResponseCaseExample['Visit Description'],
  })
  @Expose()
  'Visit Description': string;

  @ApiProperty({
    example: InPersonVisitsSingleResponseCaseExample['Id'],
  })
  @Expose()
  Id: string;

  @ApiProperty({
    example: InPersonVisitsSingleResponseCaseExample['Type'],
  })
  @Expose()
  Type: string;

  @ApiProperty({
    example: InPersonVisitsSingleResponseCaseExample['Date of visit'],
  })
  @Expose()
  'Date of visit': string;

  @ApiProperty({
    example: InPersonVisitsSingleResponseCaseExample['Visit Details Value'],
  })
  @Expose()
  'Visit Details Value': string;

  @ApiProperty({
    example: InPersonVisitsSingleResponseCaseExample['Parent Id'],
  })
  @Expose()
  'Parent Id': string;

  @ApiProperty({
    example: InPersonVisitsSingleResponseCaseExample['Login Name'],
  })
  @Expose()
  'Login Name': string;

  @ApiProperty({
    example: InPersonVisitsSingleResponseCaseExample[createdByFieldName],
  })
  @Expose()
  [createdByFieldName]: string;

  @ApiProperty({
    example: InPersonVisitsSingleResponseCaseExample['Created'],
  })
  @Expose()
  'Created': string;

  @ApiProperty({
    example: InPersonVisitsSingleResponseCaseExample[updatedByFieldName],
  })
  @Expose()
  [updatedByFieldName]: string;

  @ApiProperty({
    example: InPersonVisitsSingleResponseCaseExample['Updated'],
  })
  @Expose()
  'Updated': string;

  constructor(object) {
    Object.assign(this, object);
  }
}

@Exclude()
@ApiSchema({ name: 'InPersonVisitsResponse' })
export class NestedInPersonVisitsEntity {
  @Expose()
  @ApiProperty({ type: InPersonVisitsEntity, isArray: true })
  @Type(() => InPersonVisitsEntity)
  items: Array<InPersonVisitsEntity>;

  constructor(object) {
    Object.assign(this, object);
  }
}
