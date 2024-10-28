import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { EntityType } from '../common/constants/enumerations';

/*
 * Examples
 */
export const SupportNetworkSingleResponseCaseExample = {
  'Cell Phone Number': '12345678910',
  'Entity Name': EntityType.Case,
  Name: 'Name',
  Updated: '12/22/2024 00:33:37',
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
  Created: '12/22/2024 00:32:54',
  'Updated By': 'Updater-Id',
  'ICM SNC Case Con Flag': 'N',
  'Created By': 'Creater-Id',
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
  items: [SupportNetworkSingleResponseCaseExample],
};

export const SupportNetworkListResponseSRExample = {
  items: [SupportNetworkSingleResponseSRExample],
};

export const SupportNetworkListResponseIncidentExample = {
  items: [SupportNetworkSingleResponseIncidentExample],
};

/*
 * Model definitions
 */
@Exclude()
@ApiSchema({ name: 'SupportNetworkSingleResponse' })
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

  @ApiProperty({ example: SupportNetworkSingleResponseCaseExample['Updated'] })
  @Expose()
  Updated: string;

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

  @ApiProperty({ example: SupportNetworkSingleResponseCaseExample['Created'] })
  @Expose()
  Created: string;

  @ApiProperty({
    example: SupportNetworkSingleResponseCaseExample['Updated By'],
  })
  @Expose()
  'Updated By': string;

  @ApiProperty({
    example: SupportNetworkSingleResponseCaseExample['ICM SNC Case Con Flag'],
  })
  @Expose()
  'ICM SNC Case Con Flag': string;

  @ApiProperty({
    example: SupportNetworkSingleResponseCaseExample['Created By'],
  })
  @Expose()
  'Created By': string;

  constructor(partial: Partial<SupportNetworkEntity>) {
    Object.assign(this, partial);
  }
}

@Exclude()
@ApiSchema({ name: 'SupportNetworkListResponse' })
export class NestedSupportNetworkEntity {
  @Expose()
  @ApiProperty({ type: SupportNetworkEntity, isArray: true })
  @Type(() => SupportNetworkEntity)
  items: Array<SupportNetworkEntity>;

  constructor(object) {
    Object.assign(this, object);
  }
}
