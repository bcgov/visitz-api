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
  Cell: '12345678910',
  'Entity Name': EntityType.Case,
  Name: 'Name Here',
  Comments: 'Comments Here',
  'Entity Id': 'Entity Id Here',
  Agency: 'Agency Here',
  Phone: '12345678910',
  Relationship: 'Relationship Here',
  Id: 'Id Here',
  Address: 'Address Here',
  Active: 'Yes',
  [createdByFieldName]: 'Creator IDIR Here',
  [createdByIdFieldName]: 'Creator Row Id Here',
  [createdDateFieldName]: '01/01/1970 00:00:00',
  [updatedByFieldName]: 'Updater IDIR Here',
  [updatedByIdFieldName]: 'Updater Row Id Here',
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
    example: SupportNetworkSingleResponseCaseExample['Cell'],
  })
  @Expose()
  'Cell': string;

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
    example: SupportNetworkSingleResponseCaseExample['Entity Id'],
  })
  @Expose()
  'Entity Id': string;

  @ApiProperty({
    example: SupportNetworkSingleResponseCaseExample['Agency'],
  })
  @Expose()
  'Agency': string;

  @ApiProperty({ example: SupportNetworkSingleResponseCaseExample['Phone'] })
  @Expose()
  'Phone': string;

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
