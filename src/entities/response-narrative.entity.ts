import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
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
export const ResponseNarrativeSingleResponseIncidentExample = {
  Response: 'Response Here',
  'Row Id': 'Id Here',
  [createdByFieldName]: 'Creator IDIR Here',
  [createdByIdFieldName]: 'Creator Row Id Here',
  'Created By Office': 'Office Name Here',
  [createdDateFieldName]: '01/01/1970 00:00:00',
  [updatedByFieldName]: 'Updater IDIR Here',
  [updatedByIdFieldName]: 'Updater Row Id Here',
  [updatedDateFieldName]: '01/01/1970 00:00:00',
  'Last Updated': '01/01/1970 00:00:00',
};

export const ResponseNarrativeSingleResponseSRExample = {
  ...ResponseNarrativeSingleResponseIncidentExample,
};

export const ResponseNarrativeListResponseIncidentExample = {
  items: [
    {
      ...ResponseNarrativeSingleResponseIncidentExample,
      [updatedDateFieldName]: '12/25/2024 00:33:37',
    },
    ResponseNarrativeSingleResponseIncidentExample,
  ],
};

export const ResponseNarrativeListResponseSRExample = {
  items: [
    {
      ...ResponseNarrativeSingleResponseSRExample,
      [updatedDateFieldName]: '12/25/2024 00:33:37',
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
    example: ResponseNarrativeSingleResponseIncidentExample['Row Id'],
  })
  @Expose()
  'Row Id': string;

  @ApiProperty({
    example: ResponseNarrativeSingleResponseIncidentExample[createdByFieldName],
  })
  @Expose()
  [createdByFieldName]: string;

  @ApiProperty({
    example:
      ResponseNarrativeSingleResponseIncidentExample[createdByIdFieldName],
  })
  @Expose()
  [createdByIdFieldName]: string;

  @ApiProperty({
    example:
      ResponseNarrativeSingleResponseIncidentExample['Created By Office'],
  })
  @Expose()
  'Created By Office': string;

  @ApiProperty({
    example:
      ResponseNarrativeSingleResponseIncidentExample[createdDateFieldName],
  })
  @Expose()
  [createdDateFieldName]: string;

  @ApiProperty({
    example: ResponseNarrativeSingleResponseIncidentExample[updatedByFieldName],
  })
  @Expose()
  [updatedByFieldName]: string;

  @ApiProperty({
    example:
      ResponseNarrativeSingleResponseIncidentExample[updatedByIdFieldName],
  })
  @Expose()
  [updatedByIdFieldName]: string;

  @ApiProperty({
    example:
      ResponseNarrativeSingleResponseIncidentExample[updatedDateFieldName],
  })
  @Expose()
  [updatedDateFieldName]: string;

  @ApiProperty({
    example: ResponseNarrativeSingleResponseIncidentExample['Last Updated'],
  })
  @Expose()
  'Last Updated': string;

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
