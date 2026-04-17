import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

/*
 * Examples
 */

export const ContactEducationSingleExample = {
  Id: 'Id Here',
  Degree: 'Degree Level Here',
  'Start Date': '01/01/1970',
  'School Name': 'School Name Here',
  Address: 'Address Here',
  'Contact Person': 'Person Here',
  'Contact Person Role': 'Role Here',
  'Phone Num': 'Phone Num Here',
  Comments: 'Comments Here',
  'Individual Education Plan': 'Y',
  'Learning Assistant': 'Y',
  'Date Last Attended': '01/01/1970',
  Year: '01/01/1970',
  'End Date': '01/01/1970',
  'Institution Id': 'Institution Id Here',
  'Institution Name': 'Institution Name Here',
  University: 'University Here',
  Created: '01/01/1970 00:00:00',
  'Created By': 'Creator Row Id Here',
  'Created By Name': 'Creator IDIR Here',
  Updated: '01/01/1970 00:00:00',
  'Updated By': 'Updater Row Id Here',
  'Updated By Name': 'Updater IDIR Here',
  'Contact Id': 'Parent Id Here',
};

export const ContactEducationListResponseExample = {
  items: [
    {
      ...ContactEducationSingleExample,
      Id: 'Another Id Here',
    },
    ContactEducationSingleExample,
  ],
};

export const PostContactEducationResponseExample = {
  items: [ContactEducationSingleExample],
};

/*
 * Model definitions
 */
@Exclude()
@ApiSchema({ name: 'ContactEducation' })
export class ContactEducationEntity {
  @ApiProperty({
    example: ContactEducationSingleExample['Id'],
  })
  @Expose()
  'Id': string;

  @ApiProperty({
    example: ContactEducationSingleExample['Degree'],
  })
  @Expose()
  'Degree': string;

  @ApiProperty({
    example: ContactEducationSingleExample['Start Date'],
  })
  @Expose()
  'Start Date': string;

  @ApiProperty({
    example: ContactEducationSingleExample['School Name'],
  })
  @Expose()
  'School Name': string;

  @ApiProperty({
    example: ContactEducationSingleExample['Address'],
  })
  @Expose()
  'Address': string;

  @ApiProperty({
    example: ContactEducationSingleExample['Contact Person'],
  })
  @Expose()
  'Contact Person': string;

  @ApiProperty({
    example: ContactEducationSingleExample['Contact Person Role'],
  })
  @Expose()
  'Contact Person Role': string;

  @ApiProperty({
    example: ContactEducationSingleExample['Phone Num'],
  })
  @Expose()
  'Phone Num': string;

  @ApiProperty({
    example: ContactEducationSingleExample['Comments'],
  })
  @Expose()
  'Comments': string;

  @ApiProperty({
    example: ContactEducationSingleExample['Individual Education Plan'],
  })
  @Expose()
  'Individual Education Plan': string;

  @ApiProperty({
    example: ContactEducationSingleExample['Learning Assistant'],
  })
  @Expose()
  'Learning Assistant': string;

  @ApiProperty({
    example: ContactEducationSingleExample['Date Last Attended'],
  })
  @Expose()
  'Date Last Attended': string;

  @ApiProperty({
    example: ContactEducationSingleExample['Year'],
  })
  @Expose()
  'Year': string;

  @ApiProperty({
    example: ContactEducationSingleExample['End Date'],
  })
  @Expose()
  'End Date': string;

  @ApiProperty({
    example: ContactEducationSingleExample['Institution Id'],
  })
  @Expose()
  'Institution Id': string;

  @ApiProperty({
    example: ContactEducationSingleExample['Institution Name'],
  })
  @Expose()
  'Institution Name': string;

  @ApiProperty({
    example: ContactEducationSingleExample['University'],
  })
  @Expose()
  'University': string;

  @ApiProperty({
    example: ContactEducationSingleExample['Created'],
  })
  @Expose()
  'Created': string;

  @ApiProperty({
    example: ContactEducationSingleExample['Created By'],
  })
  @Expose()
  'Created By': string;

  @ApiProperty({
    example: ContactEducationSingleExample['Created By Name'],
  })
  @Expose()
  'Created By Name': string;

  @ApiProperty({
    example: ContactEducationSingleExample['Updated'],
  })
  @Expose()
  'Updated': string;

  @ApiProperty({
    example: ContactEducationSingleExample['Updated By'],
  })
  @Expose()
  'Updated By': string;

  @ApiProperty({
    example: ContactEducationSingleExample['Updated By Name'],
  })
  @Expose()
  'Updated By Name': string;

  @ApiProperty({
    example: ContactEducationSingleExample['Contact Id'],
  })
  @Expose()
  'Contact Id': string;

  constructor(partial: Partial<ContactEducationEntity>) {
    Object.assign(this, partial);
  }
}

@Exclude()
@ApiSchema({ name: 'ContactEducationResponse' })
export class NestedContactEducationEntity {
  @Expose()
  @ApiProperty({ type: ContactEducationEntity, isArray: true })
  @Type(() => ContactEducationEntity)
  items: Array<ContactEducationEntity>;

  constructor(object) {
    Object.assign(this, object);
  }
}
