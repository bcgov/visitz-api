import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

/*
 * Examples
 */
export const AdditionalInformationSingleResponseIncidentExample = {
  Id: 'Id here',
  'Additional Information': 'Additional Information Here',
  Created: '01/01/1970 00:00:00',
  'Created By': 'Creator Row Id Here',
  'Created By Name': 'Creator IDIR Here',
  Updated: '01/01/1970 00:00:00',
  'Updated By': 'Updater Row Id Here',
  'Updated By Name': 'Updater IDIR Here',
  'Incident Id': 'Parent Id Here',
};

const {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ['Incident Id']: incidentId,
  ...AdditionalInformationSingleResponse
} = AdditionalInformationSingleResponseIncidentExample;

export const AdditionalInformationSingleResponseSRExample = {
  ...AdditionalInformationSingleResponse,
  'SR Id': 'Parent Id Here',
};

export const AdditionalInformationSingleResponseMemoExample = {
  ...AdditionalInformationSingleResponse,
  'Memo Id': 'Parent Id Here',
};

export const AdditionalInformationListResponseIncidentExample = {
  items: [
    {
      ...AdditionalInformationSingleResponseIncidentExample,
      Updated: '12/25/2024 00:33:37',
    },
    AdditionalInformationSingleResponseIncidentExample,
  ],
};

export const AdditionalInformationListResponseSRExample = {
  items: [
    {
      ...AdditionalInformationSingleResponseSRExample,
      Updated: '12/25/2024 00:33:37',
    },
    AdditionalInformationSingleResponseSRExample,
  ],
};

export const AdditionalInformationListResponseMemoExample = {
  items: [
    {
      ...AdditionalInformationSingleResponseMemoExample,
      Updated: '12/25/2024 00:33:37',
    },
    AdditionalInformationSingleResponseMemoExample,
  ],
};

/*
 * Model definitions
 */
@Exclude()
@ApiSchema({ name: 'AdditionalInformation' })
export class AdditionalInformationEntity {
  @ApiProperty({
    example: AdditionalInformationSingleResponseIncidentExample['Id'],
  })
  @Expose()
  'Id': string;

  @ApiProperty({
    example:
      AdditionalInformationSingleResponseIncidentExample[
        'Additional Information'
      ],
  })
  @Expose()
  'Additional Information': string;

  @ApiProperty({
    example: AdditionalInformationSingleResponseIncidentExample['Created'],
  })
  @Expose()
  'Created': string;

  @ApiProperty({
    example: AdditionalInformationSingleResponseIncidentExample['Created By'],
  })
  @Expose()
  'Created By': string;

  @ApiProperty({
    example:
      AdditionalInformationSingleResponseIncidentExample['Created By Name'],
  })
  @Expose()
  'Created By Name': string;

  @ApiProperty({
    example: AdditionalInformationSingleResponseIncidentExample['Updated'],
  })
  @Expose()
  'Updated': string;

  @ApiProperty({
    example: AdditionalInformationSingleResponseIncidentExample['Updated By'],
  })
  @Expose()
  'Updated By': string;

  @ApiProperty({
    example:
      AdditionalInformationSingleResponseIncidentExample['Updated By Name'],
  })
  @Expose()
  'Updated By Name': string;

  @ApiProperty({
    example: AdditionalInformationSingleResponseIncidentExample['Incident Id'],
  })
  @Expose()
  'Incident Id': string;

  @ApiProperty({
    example: AdditionalInformationSingleResponseSRExample['SR Id'],
  })
  @Expose()
  'SR Id': string;

  @ApiProperty({
    example: AdditionalInformationSingleResponseMemoExample['Memo Id'],
  })
  @Expose()
  'Memo Id': string;

  constructor(partial: Partial<AdditionalInformationEntity>) {
    Object.assign(this, partial);
  }
}

@Exclude()
@ApiSchema({ name: 'AdditionalInformationResponse' })
export class NestedAdditionalInformationEntity {
  @Expose()
  @ApiProperty({ type: AdditionalInformationEntity, isArray: true })
  @Type(() => AdditionalInformationEntity)
  items: Array<AdditionalInformationEntity>;

  constructor(object) {
    Object.assign(this, object);
  }
}
