import { ApiSchema, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

export const ListOfValuesExample = {
  Id: 'Row Id Here',
  Type: 'Type Here',
  Value: 'Value Here',
  Name: 'Name Here',
  Parent: 'Parent Here',
  'Order By': '1',
  Active: 'Y',
};

@Exclude()
@ApiSchema({ name: 'ListOfValues' })
export class ListOfValuesEntity {
  @ApiProperty({
    example: ListOfValuesExample['Id'],
  })
  @Expose()
  Id?: string;

  @ApiProperty({
    example: ListOfValuesExample['Type'],
  })
  @Expose()
  Type?: string;

  @ApiProperty({
    example: ListOfValuesExample['Value'],
  })
  @Expose()
  Value?: string;

  @ApiProperty({
    example: ListOfValuesExample['Name'],
  })
  @Expose()
  Name?: string;

  @ApiProperty({
    example: ListOfValuesExample['Parent'],
  })
  @Expose()
  Parent?: string;

  @ApiProperty({
    example: ListOfValuesExample['Order By'],
  })
  @Expose()
  'Order By'?: string;

  @ApiProperty({
    example: ListOfValuesExample['Active'],
  })
  @Expose()
  Active?: string;

  constructor(object) {
    Object.assign(this, object);
  }
}

export const ListOfValuesListResponseExample = {
  items: [
    {
      ...ListOfValuesExample,
      Id: 'Another Id Here',
    },
    ListOfValuesExample,
  ],
};

@Exclude()
@ApiSchema({ name: 'ListOfValuesResponse' })
export class NestedListOfValuesEntity {
  @Expose()
  @ApiProperty({ type: ListOfValuesEntity, isArray: true })
  @Type(() => ListOfValuesEntity)
  items: Array<ListOfValuesEntity>;

  constructor(object) {
    Object.assign(this, object);
  }
}
