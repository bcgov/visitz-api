import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

/*
 * Examples
 */
export const CallInformationSingleResponseIncidentExample = {
  Id: 'Id here',
  'Call Information': 'Call Information Here',
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
  ...CallInformationSingleResponse
} = CallInformationSingleResponseIncidentExample;

export const CallInformationSingleResponseSRExample = {
  ...CallInformationSingleResponse,
  'SR Id': 'Parent Id Here',
};

export const CallInformationSingleResponseMemoExample = {
  ...CallInformationSingleResponse,
  'Memo Id': 'Parent Id Here',
};

export const CallInformationListResponseIncidentExample = {
  items: [
    {
      ...CallInformationSingleResponseIncidentExample,
      Updated: '12/25/2024 00:33:37',
    },
    CallInformationSingleResponseIncidentExample,
  ],
};

export const CallInformationListResponseSRExample = {
  items: [
    {
      ...CallInformationSingleResponseSRExample,
      Updated: '12/25/2024 00:33:37',
    },
    CallInformationSingleResponseSRExample,
  ],
};

export const CallInformationListResponseMemoExample = {
  items: [
    {
      ...CallInformationSingleResponseMemoExample,
      Updated: '12/25/2024 00:33:37',
    },
    CallInformationSingleResponseMemoExample,
  ],
};

/*
 * Model definitions
 */
@Exclude()
@ApiSchema({ name: 'CallInformation' })
export class CallInformationEntity {
  @ApiProperty({
    example: CallInformationSingleResponseIncidentExample['Id'],
  })
  @Expose()
  'Id': string;

  @ApiProperty({
    example: CallInformationSingleResponseIncidentExample['Call Information'],
  })
  @Expose()
  'Call Information': string;

  @ApiProperty({
    example: CallInformationSingleResponseIncidentExample['Created'],
  })
  @Expose()
  'Created': string;

  @ApiProperty({
    example: CallInformationSingleResponseIncidentExample['Created By'],
  })
  @Expose()
  'Created By': string;

  @ApiProperty({
    example: CallInformationSingleResponseIncidentExample['Created By Name'],
  })
  @Expose()
  'Created By Name': string;

  @ApiProperty({
    example: CallInformationSingleResponseIncidentExample['Updated'],
  })
  @Expose()
  'Updated': string;

  @ApiProperty({
    example: CallInformationSingleResponseIncidentExample['Updated By'],
  })
  @Expose()
  'Updated By': string;

  @ApiProperty({
    example: CallInformationSingleResponseIncidentExample['Updated By Name'],
  })
  @Expose()
  'Updated By Name': string;

  @ApiProperty({
    example: CallInformationSingleResponseIncidentExample['Incident Id'],
  })
  @Expose()
  'Incident Id': string;

  @ApiProperty({
    example: CallInformationSingleResponseSRExample['SR Id'],
  })
  @Expose()
  'SR Id': string;

  @ApiProperty({
    example: CallInformationSingleResponseMemoExample['Memo Id'],
  })
  @Expose()
  'Memo Id': string;

  constructor(partial: Partial<CallInformationEntity>) {
    Object.assign(this, partial);
  }
}

@Exclude()
@ApiSchema({ name: 'CallInformationResponse' })
export class NestedCallInformationEntity {
  @Expose()
  @ApiProperty({ type: CallInformationEntity, isArray: true })
  @Type(() => CallInformationEntity)
  items: Array<CallInformationEntity>;

  constructor(object) {
    Object.assign(this, object);
  }
}
