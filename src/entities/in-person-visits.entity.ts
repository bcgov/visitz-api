import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

/*
 * Examples
 */
export const InPersonVisitsSingleResponseCaseExample = {
  Name: 'Id-here',
  'Visit Description': 'description',
  Id: 'Id-here',
  Type: 'In Person Child Youth',
  'Date of visit': '11/09/2024 09:33:23',
  'Visit Details Value': 'comment',
  'Parent Id': 'Entity-Id-here',
  'Login Name': 'Idir-here',
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

/*
 * Model definitions
 */
@Exclude()
@ApiSchema({ name: 'InPersonVisitsSingleResponse' })
export class InPersonVisitsEntity {
  @ApiProperty({
    example: InPersonVisitsSingleResponseCaseExample['Name'],
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
    example: InPersonVisitsSingleResponseCaseExample['Visit Details Value'],
  })
  @Expose()
  'Visit Details Value': string;

  @ApiProperty({
    example: InPersonVisitsSingleResponseCaseExample['Parent Id'],
  })
  @Expose()
  'Parent Id': string;

  @ApiProperty({
    example: InPersonVisitsSingleResponseCaseExample['Login Name'],
  })
  @Expose()
  'Login Name': string;

  constructor(partial: Partial<InPersonVisitsEntity>) {
    Object.assign(this, partial);
  }
}

@Exclude()
@ApiSchema({ name: 'InPersonVisitsListResponse' })
export class NestedInPersonVisitsEntity {
  @Expose()
  @ApiProperty({ type: InPersonVisitsEntity, isArray: true })
  @Type(() => InPersonVisitsEntity)
  items: Array<InPersonVisitsEntity>;

  constructor(object) {
    Object.assign(this, object);
  }
}
