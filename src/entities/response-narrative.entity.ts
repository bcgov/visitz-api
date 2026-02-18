import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

/*
 * Examples
 */
export const ResponseNarrativeSingleResponseIncidentExample = {
  Response: 'Response Here',
  Id: 'Id Here',
  'Created By Name': 'Creator IDIR Here',
  'Created By': 'Creator Row Id Here',
  'Created By Office': 'Office Name Here',
  Created: '01/01/1970 00:00:00',
  'Updated By Name': 'Updater IDIR Here',
  'Updated By': 'Updater Row Id Here',
  Updated: '01/01/1970 00:00:00',
  'Incident Id': 'Parent Id Here',
};

const {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ['Incident Id']: incidentId,
  ...ResponseNarrativeSingleResponseSR
} = ResponseNarrativeSingleResponseIncidentExample;

export const ResponseNarrativeSingleResponseSRExample = {
  ...ResponseNarrativeSingleResponseSR,
  'SR Id': 'Parent Id Here',
};

export const ResponseNarrativeListResponseIncidentExample = {
  items: [
    {
      ...ResponseNarrativeSingleResponseIncidentExample,
      Updated: '12/25/2024 00:33:37',
    },
    ResponseNarrativeSingleResponseIncidentExample,
  ],
};

export const ResponseNarrativeListResponseSRExample = {
  items: [
    {
      ...ResponseNarrativeSingleResponseSRExample,
      Updated: '12/25/2024 00:33:37',
    },
    ResponseNarrativeSingleResponseSRExample,
  ],
};

/*
 * Model definitions
 */
@Exclude()
@ApiSchema({ name: 'ResponseNarrative' })
export class ResponseNarrativeEntity {
  @ApiProperty({
    example: ResponseNarrativeSingleResponseIncidentExample['Response'],
  })
  @Expose()
  Response: string;

  @ApiProperty({
    example: ResponseNarrativeSingleResponseIncidentExample['Id'],
  })
  @Expose()
  'Id': string;

  @ApiProperty({
    example: ResponseNarrativeSingleResponseIncidentExample['Created By Name'],
  })
  @Expose()
  'Created By Name': string;

  @ApiProperty({
    example: ResponseNarrativeSingleResponseIncidentExample['Created By'],
  })
  @Expose()
  'Created By': string;

  @ApiProperty({
    example:
      ResponseNarrativeSingleResponseIncidentExample['Created By Office'],
  })
  @Expose()
  'Created By Office': string;

  @ApiProperty({
    example: ResponseNarrativeSingleResponseIncidentExample['Created'],
  })
  @Expose()
  'Created': string;

  @ApiProperty({
    example: ResponseNarrativeSingleResponseIncidentExample['Updated By Name'],
  })
  @Expose()
  'Updated By Name': string;

  @ApiProperty({
    example: ResponseNarrativeSingleResponseIncidentExample['Updated By'],
  })
  @Expose()
  'Updated By': string;

  @ApiProperty({
    example: ResponseNarrativeSingleResponseIncidentExample['Updated'],
  })
  @Expose()
  'Updated': string;

  @ApiProperty({
    example: ResponseNarrativeSingleResponseIncidentExample['Incident Id'],
  })
  @Expose()
  'Incident Id': string;

  @ApiProperty({
    example: ResponseNarrativeSingleResponseIncidentExample['SR Id'],
  })
  @Expose()
  'SR Id': string;

  constructor(partial: Partial<ResponseNarrativeEntity>) {
    Object.assign(this, partial);
  }
}

@Exclude()
@ApiSchema({ name: 'ResponseNarrativeResponse' })
export class NestedResponseNarrativeEntity {
  @Expose()
  @ApiProperty({ type: ResponseNarrativeEntity, isArray: true })
  @Type(() => ResponseNarrativeEntity)
  items: Array<ResponseNarrativeEntity>;

  constructor(object) {
    Object.assign(this, object);
  }
}
