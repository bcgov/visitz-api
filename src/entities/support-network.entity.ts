import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { EntityType } from '../common/constants/enumerations';
import {
  createdByFieldName,
  createdByIdFieldName,
  createdDateFieldName,
  updatedByFieldName,
  updatedByIdFieldName,
  updatedDateFieldName,
} from '../common/constants/upstream-constants';

/*
 * Examples
 */
export const SupportNetworkSingleResponseCaseExample = {
  'Cell Phone Number': '12345678910',
  'Entity Name': EntityType.Case,
  Name: 'Name',
  Comments: 'test',
  'ICM SNC SR Con Flag': 'N',
  'Emergency Contact': 'N',
  'Entity Id': 'Entity-Id-Here',
  'Agency Name': 'Test',
  'Phone Number': '12345678910',
  Relationship: 'test',
  Id: 'Id-Here',
  Address: 'Test Address',
  Active: 'Yes',
  'ICM SNC Case Con Flag': 'N',
  [createdByFieldName]: 'Creator-Idir-Here',
  [createdByIdFieldName]: 'Creator-Id-Here',
  [createdDateFieldName]: '01/01/1970 00:00:00',
  [updatedByFieldName]: 'Updater-Idir-Here',
  [updatedByIdFieldName]: 'Updater-Id-Here',
  [updatedDateFieldName]: '01/01/1970 00:00:00',
};

export const SupportNetworkSingleResponseSRExample = {
  ...SupportNetworkSingleResponseCaseExample,
  'Entity Name': EntityType.SR,
};

export const SupportNetworkSingleResponseIncidentExample = {
  ...SupportNetworkSingleResponseCaseExample,
  'Entity Name': EntityType.Incident,
};

export const SupportNetworkListResponseCaseExample = {
  items: [
    {
      ...SupportNetworkSingleResponseCaseExample,
      [updatedDateFieldName]: '12/25/2024 00:33:37',
    },
    SupportNetworkSingleResponseCaseExample,
  ],
};

export const SupportNetworkListResponseSRExample = {
  items: [
    {
      ...SupportNetworkSingleResponseSRExample,
      [updatedDateFieldName]: '12/25/2024 00:33:37',
    },
    SupportNetworkSingleResponseSRExample,
  ],
};

export const SupportNetworkListResponseIncidentExample = {
  items: [
    {
      ...SupportNetworkSingleResponseIncidentExample,
      [updatedDateFieldName]: '12/25/2024 00:33:37',
    },
    SupportNetworkSingleResponseIncidentExample,
  ],
};

/*
 * Model definitions
 */
@Exclude()
@ApiSchema({ name: 'SupportNetwork' })
export class SupportNetworkEntity {
  @ApiProperty({
    example: SupportNetworkSingleResponseCaseExample['Cell Phone Number'],
  })
  @Expose()
  'Cell Phone Number': string;

  @ApiProperty({
    example: SupportNetworkSingleResponseCaseExample['Entity Name'],
    enum: EntityType,
  })
  @Expose()
  'Entity Name': string;

  @ApiProperty({ example: SupportNetworkSingleResponseCaseExample['Name'] })
  @Expose()
  Name: string;

  @ApiProperty({ example: SupportNetworkSingleResponseCaseExample['Comments'] })
  @Expose()
  Comments: string;

  @ApiProperty({
    example: SupportNetworkSingleResponseCaseExample['ICM SNC SR Con Flag'],
  })
  @Expose()
  'ICM SNC SR Con Flag': string;

  @ApiProperty({
    example: SupportNetworkSingleResponseCaseExample['Emergency Contact'],
  })
  @Expose()
  'Emergency Contact': string;

  @ApiProperty({
    example: SupportNetworkSingleResponseCaseExample['Entity Id'],
  })
  @Expose()
  'Entity Id': string;

  @ApiProperty({
    example: SupportNetworkSingleResponseCaseExample['Agency Name'],
  })
  @Expose()
  'Agency Name': string;

  @ApiProperty({ example: '16041234567' })
  @Expose()
  'Phone Number': string;

  @ApiProperty({
    example: SupportNetworkSingleResponseCaseExample['Relationship'],
  })
  @Expose()
  Relationship: string;

  @ApiProperty({ example: SupportNetworkSingleResponseCaseExample['Id'] })
  @Expose()
  Id: string;

  @ApiProperty({ example: SupportNetworkSingleResponseCaseExample['Address'] })
  @Expose()
  Address: string;

  @ApiProperty({ example: SupportNetworkSingleResponseCaseExample['Active'] })
  @Expose()
  Active: string;

  @ApiProperty({
    example: SupportNetworkSingleResponseCaseExample['ICM SNC Case Con Flag'],
  })
  @Expose()
  'ICM SNC Case Con Flag': string;

  @ApiProperty({
    example: SupportNetworkSingleResponseCaseExample[createdByFieldName],
  })
  @Expose()
  [createdByFieldName]: string;

  @ApiProperty({
    example: SupportNetworkSingleResponseCaseExample[createdByIdFieldName],
  })
  @Expose()
  [createdByIdFieldName]: string;

  @ApiProperty({
    example: SupportNetworkSingleResponseCaseExample[createdDateFieldName],
  })
  @Expose()
  [createdDateFieldName]: string;

  @ApiProperty({
    example: SupportNetworkSingleResponseCaseExample[updatedByFieldName],
  })
  @Expose()
  [updatedByFieldName]: string;

  @ApiProperty({
    example: SupportNetworkSingleResponseCaseExample[updatedByIdFieldName],
  })
  @Expose()
  [updatedByIdFieldName]: string;

  @ApiProperty({
    example: SupportNetworkSingleResponseCaseExample[updatedDateFieldName],
  })
  @Expose()
  [updatedDateFieldName]: string;

  constructor(partial: Partial<SupportNetworkEntity>) {
    Object.assign(this, partial);
  }
}

@Exclude()
@ApiSchema({ name: 'SupportNetworkResponse' })
export class NestedSupportNetworkEntity {
  @Expose()
  @ApiProperty({ type: SupportNetworkEntity, isArray: true })
  @Type(() => SupportNetworkEntity)
  items: Array<SupportNetworkEntity>;

  constructor(object) {
    Object.assign(this, object);
  }
}
