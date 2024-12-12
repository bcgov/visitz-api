import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { EntityType } from '../common/constants/enumerations';

/*
 * Examples
 */
const SupportNetworkSingleResponseCaseExample = {
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
  'Created By': 'Creator-Idir-Here',
  'Created By Id': 'Creator-Id-Here',
  'Created Date': '01/01/1970 00:00:00',
  'Updated By': 'Updater-Idir-Here',
  'Updated By Id': 'Updater-Id-Here',
  'Updated Date': '01/01/1970 00:00:00',
};

const SupportNetworkSingleResponseSRExample = {
  ...SupportNetworkSingleResponseCaseExample,
  'Entity Name': EntityType.SR,
};

const SupportNetworkSingleResponseIncidentExample = {
  ...SupportNetworkSingleResponseCaseExample,
  'Entity Name': EntityType.Incident,
};

export const SupportNetworkListResponseCaseExample = {
  items: [
    {
      ...SupportNetworkSingleResponseCaseExample,
      'Updated Date': '12/25/2024 00:33:37',
    },
    SupportNetworkSingleResponseCaseExample,
  ],
};

export const SupportNetworkListResponseSRExample = {
  items: [
    {
      ...SupportNetworkSingleResponseSRExample,
      'Updated Date': '12/25/2024 00:33:37',
    },
    SupportNetworkSingleResponseSRExample,
  ],
};

export const SupportNetworkListResponseIncidentExample = {
  items: [
    {
      ...SupportNetworkSingleResponseIncidentExample,
      'Updated Date': '12/25/2024 00:33:37',
    },
    SupportNetworkSingleResponseIncidentExample,
  ],
};

/*
 * Model definitions
 */
@Exclude()
@ApiSchema({ name: 'SupportNetwork' })
class SupportNetworkEntity {
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
    example: SupportNetworkSingleResponseCaseExample['Created By'],
  })
  @Expose()
  'Created By': string;

  @ApiProperty({
    example: SupportNetworkSingleResponseCaseExample['Created By Id'],
  })
  @Expose()
  'Created By Id': string;

  @ApiProperty({
    example: SupportNetworkSingleResponseCaseExample['Created Date'],
  })
  @Expose()
  'Created Date': string;

  @ApiProperty({
    example: SupportNetworkSingleResponseCaseExample['Updated By'],
  })
  @Expose()
  'Updated By': string;

  @ApiProperty({
    example: SupportNetworkSingleResponseCaseExample['Updated By Id'],
  })
  @Expose()
  'Updated By Id': string;

  @ApiProperty({
    example: SupportNetworkSingleResponseCaseExample['Updated Date'],
  })
  @Expose()
  'Updated Date': string;

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
