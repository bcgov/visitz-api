import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

/*
 * Examples
 */

export const IncidentConcernSingleExample = {
  Id: 'Id Here',
  'Original Concern': 'Y',
  Concern: 'Concern Here',
  'Start Date': '01/01/1970 00:00:00',
  'End Date': '01/01/1970 00:00:00',
  Created: '01/01/1970 00:00:00',
  'Created By': 'Creator Row Id Here',
  'Created By Name': 'Creator IDIR Here',
  Updated: '01/01/1970 00:00:00',
  'Updated By': 'Updater Row Id Here',
  'Updated By Name': 'Updater IDIR Here',
  'Incident Id': 'Parent Id Here',
};

export const IncidentConcernListResponseExample = {
  items: [
    {
      ...IncidentConcernSingleExample,
      Id: 'Another Id Here',
    },
    IncidentConcernSingleExample,
  ],
};

/*
 * Model definitions
 */
@Exclude()
@ApiSchema({ name: 'IncidentConcern' })
export class IncidentConcernEntity {
  @ApiProperty({
    example: IncidentConcernSingleExample['Id'],
  })
  @Expose()
  'Id': string;

  @ApiProperty({
    example: IncidentConcernSingleExample['Original Concern'],
  })
  @Expose()
  'Original Concern': string;

  @ApiProperty({
    example: IncidentConcernSingleExample['Concern'],
  })
  @Expose()
  'Concern': string;

  @ApiProperty({
    example: IncidentConcernSingleExample['Start Date'],
  })
  @Expose()
  'Start Date': string;

  @ApiProperty({
    example: IncidentConcernSingleExample['End Date'],
  })
  @Expose()
  'End Date': string;

  @ApiProperty({
    example: IncidentConcernSingleExample['Created'],
  })
  @Expose()
  'Created': string;

  @ApiProperty({
    example: IncidentConcernSingleExample['Created By'],
  })
  @Expose()
  'Created By': string;

  @ApiProperty({
    example: IncidentConcernSingleExample['Created By Name'],
  })
  @Expose()
  'Created By Name': string;

  @ApiProperty({
    example: IncidentConcernSingleExample['Updated'],
  })
  @Expose()
  'Updated': string;

  @ApiProperty({
    example: IncidentConcernSingleExample['Updated By'],
  })
  @Expose()
  'Updated By': string;

  @ApiProperty({
    example: IncidentConcernSingleExample['Updated By Name'],
  })
  @Expose()
  'Updated By Name': string;

  @ApiProperty({
    example: IncidentConcernSingleExample['Incident Id'],
  })
  @Expose()
  'Incident Id': string;

  constructor(partial: Partial<IncidentConcernEntity>) {
    Object.assign(this, partial);
  }
}

@Exclude()
@ApiSchema({ name: 'IncidentConcernResponse' })
export class NestedIncidentConcernEntity {
  @Expose()
  @ApiProperty({ type: IncidentConcernEntity, isArray: true })
  @Type(() => IncidentConcernEntity)
  items: Array<IncidentConcernEntity>;

  constructor(object) {
    Object.assign(this, object);
  }
}
