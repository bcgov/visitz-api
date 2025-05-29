import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import {
  createdByFieldName,
  createdByIdFieldName,
  createdDateFieldName,
  updatedByFieldName,
  updatedByIdFieldName,
  updatedDateFieldName,
} from '../common/constants/upstream-constants';
import { VisitDetails as VisitDetailsEnum } from '../common/constants/enumerations';

/*
 * Examples
 */
export const InPersonVisitsSingleResponseCaseExample = {
  Name: 'Name here',
  'Visit Description': 'description',
  Id: 'Id-here',
  'Row Id': 'Id-here',
  Type: 'In Person Child Youth',
  'Date of visit': '01/01/1970 00:00:00',
  VisitDetails: [
    {
      Id: 'Id-1-here',
      'Visit Detail Value': VisitDetailsEnum.PrivateVisitInHome,
    },
    {
      Id: 'Id-2-here',
      'Visit Detail Value': VisitDetailsEnum.PrivateVisitZeroToFive,
    },
  ],
  'Parent Id': 'Entity-Id-here',
  'Created By Name': 'Creator-IDIR-Here',
  [createdByFieldName]: 'Creator-IDIR-Here',
  [createdByIdFieldName]: 'Creator-Id-Here',
  [createdDateFieldName]: '01/01/1970 00:00:00',
  Created: '01/01/1970 00:00:00',
  'Updated By Name': 'Updater-IDIR-Here',
  [updatedByFieldName]: 'Updater-IDIR-Here',
  [updatedByIdFieldName]: 'Updater-Id-Here',
  [updatedDateFieldName]: '01/01/1970 00:00:00',
  Updated: '01/01/1970 00:00:00',
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { VisitDetails, ...baseCaseBody } =
  InPersonVisitsSingleResponseCaseExample;

export const InPersonVisitsSingleResponseCaseExampleNoMultiValue = {
  ...baseCaseBody,
  'Visit Details Value': VisitDetailsEnum.PrivateVisitInHome,
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

export const InPersonVisitsListResponseCaseExampleNoMultiValue = {
  items: [
    {
      ...InPersonVisitsSingleResponseCaseExampleNoMultiValue,
      'Date of visit': '11/09/2024 10:36:25',
    },
    InPersonVisitsSingleResponseCaseExampleNoMultiValue,
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
@ApiSchema({ name: 'InPersonVisitDetailValue' })
export class VisitDetailValue {
  @ApiProperty({
    example: InPersonVisitsSingleResponseCaseExample['VisitDetails'][0]['Id'],
  })
  @Expose()
  Id: string;

  @ApiProperty({
    example:
      InPersonVisitsSingleResponseCaseExample['VisitDetails'][0][
        'Visit Detail Value'
      ],
  })
  @Expose()
  'Visit Detail Value': string;

  constructor(object) {
    Object.assign(this, object);
  }
}

@Exclude()
@ApiSchema({ name: 'InPersonVisit' })
class InPersonVisitsEntity {
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
    example: InPersonVisitsSingleResponseCaseExample['Row Id'],
  })
  @Expose()
  'Row Id': string;

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
    example: InPersonVisitsSingleResponseCaseExample['Parent Id'],
  })
  @Expose()
  'Parent Id': string;

  @ApiProperty({
    example: InPersonVisitsSingleResponseCaseExample['Created By Name'],
  })
  @Expose()
  'Created By Name': string;

  @ApiProperty({
    example: InPersonVisitsSingleResponseCaseExample[createdByFieldName],
  })
  @Expose()
  [createdByFieldName]: string;

  @ApiProperty({
    example: InPersonVisitsSingleResponseCaseExample[createdByIdFieldName],
  })
  @Expose()
  [createdByIdFieldName]: string;

  @ApiProperty({
    example: InPersonVisitsSingleResponseCaseExample[createdDateFieldName],
  })
  @Expose()
  [createdDateFieldName]: string;

  @ApiProperty({
    example: InPersonVisitsSingleResponseCaseExample['Created'],
  })
  @Expose()
  'Created': string;

  @ApiProperty({
    example: InPersonVisitsSingleResponseCaseExample['Updated By Name'],
  })
  @Expose()
  'Updated By Name': string;

  @ApiProperty({
    example: InPersonVisitsSingleResponseCaseExample[updatedByFieldName],
  })
  @Expose()
  [updatedByFieldName]: string;

  @ApiProperty({
    example: InPersonVisitsSingleResponseCaseExample[updatedByIdFieldName],
  })
  @Expose()
  [updatedByIdFieldName]: string;

  @ApiProperty({
    example: InPersonVisitsSingleResponseCaseExample[updatedDateFieldName],
  })
  @Expose()
  [updatedDateFieldName]: string;

  @ApiProperty({
    example: InPersonVisitsSingleResponseCaseExample['Updated'],
  })
  @Expose()
  Updated: string;

  constructor(object) {
    Object.assign(this, object);
  }
}

@Exclude()
@ApiSchema({ name: 'InPersonVisitsNoMultiValueResponse' })
export class InPersonVisitsEntityNoMultiValue extends InPersonVisitsEntity {
  @ApiProperty({
    example:
      InPersonVisitsSingleResponseCaseExampleNoMultiValue[
        'Visit Details Value'
      ],
    name: 'Visit Details Value',
  })
  @Type(() => VisitDetailValue)
  @Transform(({ value }) => value[0]['Visit Detail Value'])
  @Expose({ name: 'Visit Details Value' })
  'VisitDetails': string;
}

@Exclude()
@ApiSchema({ name: 'InPersonVisitsMultiValueResponse' })
export class InPersonVisitsEntityMultiValue extends InPersonVisitsEntity {
  @Expose()
  @ApiProperty({
    example: InPersonVisitsSingleResponseCaseExample['VisitDetails'],
    type: VisitDetailValue,
    isArray: true,
  })
  @Type(() => VisitDetailValue)
  VisitDetails: Array<VisitDetailValue>;
}

@Exclude()
@ApiSchema({ name: 'InPersonVisitsNoMultiValueListResponse' })
export class NestedInPersonVisitsNoMultiValueEntity {
  @Expose()
  @ApiProperty({ type: InPersonVisitsEntityNoMultiValue, isArray: true })
  @Type(() => InPersonVisitsEntityNoMultiValue)
  items: Array<InPersonVisitsEntityNoMultiValue>;

  constructor(object) {
    Object.assign(this, object);
  }
}

@Exclude()
@ApiSchema({ name: 'InPersonVisitsMultiValueListResponse' })
export class NestedInPersonVisitsMultiValueEntity {
  @Expose()
  @ApiProperty({ type: InPersonVisitsEntityMultiValue, isArray: true })
  @Type(() => InPersonVisitsEntityMultiValue)
  items: Array<InPersonVisitsEntityMultiValue>;

  constructor(object) {
    Object.assign(this, object);
  }
}
