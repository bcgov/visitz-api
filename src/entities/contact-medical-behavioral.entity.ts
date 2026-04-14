import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

/*
 * Examples
 */

export const ContactMedicalBehavioralSingleExample = {
  Id: 'Id Here',
  Condition: 'Condition Here',
  'Treatment Plan': 'Treatment Plan Here',
  'Diagnosed By': 'Diagnoser Here',
  'Diagnosis Date': '01/01/1970',
  'Start Date': '01/01/1970 00:00:00',
  'End Date': '01/01/1970 00:00:00',
  Category: 'Category Here',
  Type: 'Type Here',
  Comments: 'Comments Here',
  Name: 'Name Here',
  Created: '01/01/1970 00:00:00',
  'Created By': 'Creator Row Id Here',
  'Created By Name': 'Creator IDIR Here',
  Updated: '01/01/1970 00:00:00',
  'Updated By': 'Updater Row Id Here',
  'Updated By Name': 'Updater IDIR Here',
  'Contact Id': 'Parent Id Here',
  'Contact Row Num': 'Parent Num Here',
  'Contact First Name': 'First Name Here',
  'Contact Middle Name': 'Middle Name Here',
  'Contact Last Name': 'Last Name Here',
  'Case Id': 'Parent Case Id Here',
  'Parent Case Num': 'Parent Case Num Here',
};

export const ContactMedicalBehavioralListResponseExample = {
  items: [
    {
      ...ContactMedicalBehavioralSingleExample,
      Id: 'Another Id Here',
    },
    ContactMedicalBehavioralSingleExample,
  ],
};

export const PostContactMedicalBehavioralResponseExample = {
  items: [ContactMedicalBehavioralSingleExample],
};

/*
 * Model definitions
 */
@Exclude()
@ApiSchema({ name: 'ContactMedicalBehavioral' })
export class ContactMedicalBehavioralEntity {
  @ApiProperty({
    example: ContactMedicalBehavioralSingleExample['Id'],
  })
  @Expose()
  'Id': string;

  @ApiProperty({
    example: ContactMedicalBehavioralSingleExample['Condition'],
  })
  @Expose()
  'Condition': string;

  @ApiProperty({
    example: ContactMedicalBehavioralSingleExample['Treatment Plan'],
  })
  @Expose()
  'Treatment Plan': string;

  @ApiProperty({
    example: ContactMedicalBehavioralSingleExample['Diagnosed By'],
  })
  @Expose()
  'Diagnosed By': string;

  @ApiProperty({
    example: ContactMedicalBehavioralSingleExample['Diagnosis Date'],
  })
  @Expose()
  'Diagnosis Date': string;

  @ApiProperty({
    example: ContactMedicalBehavioralSingleExample['Start Date'],
  })
  @Expose()
  'Start Date': string;

  @ApiProperty({
    example: ContactMedicalBehavioralSingleExample['End Date'],
  })
  @Expose()
  'End Date': string;

  @ApiProperty({
    example: ContactMedicalBehavioralSingleExample['Category'],
  })
  @Expose()
  'Category': string;

  @ApiProperty({
    example: ContactMedicalBehavioralSingleExample['Type'],
  })
  @Expose()
  'Type': string;

  @ApiProperty({
    example: ContactMedicalBehavioralSingleExample['Comments'],
  })
  @Expose()
  'Comments': string;

  @ApiProperty({
    example: ContactMedicalBehavioralSingleExample['Name'],
  })
  @Expose()
  'Name': string;

  @ApiProperty({
    example: ContactMedicalBehavioralSingleExample['Created'],
  })
  @Expose()
  'Created': string;

  @ApiProperty({
    example: ContactMedicalBehavioralSingleExample['Created By'],
  })
  @Expose()
  'Created By': string;

  @ApiProperty({
    example: ContactMedicalBehavioralSingleExample['Created By Name'],
  })
  @Expose()
  'Created By Name': string;

  @ApiProperty({
    example: ContactMedicalBehavioralSingleExample['Updated'],
  })
  @Expose()
  'Updated': string;

  @ApiProperty({
    example: ContactMedicalBehavioralSingleExample['Updated By'],
  })
  @Expose()
  'Updated By': string;

  @ApiProperty({
    example: ContactMedicalBehavioralSingleExample['Updated By Name'],
  })
  @Expose()
  'Updated By Name': string;

  @ApiProperty({
    example: ContactMedicalBehavioralSingleExample['Contact Id'],
  })
  @Expose()
  'Contact Id': string;

  @ApiProperty({
    example: ContactMedicalBehavioralSingleExample['Contact Row Num'],
  })
  @Expose()
  'Contact Row Num': string;

  @ApiProperty({
    example: ContactMedicalBehavioralSingleExample['Contact First Name'],
  })
  @Expose()
  'Contact First Name': string;

  @ApiProperty({
    example: ContactMedicalBehavioralSingleExample['Contact Middle Name'],
  })
  @Expose()
  'Contact Middle Name': string;

  @ApiProperty({
    example: ContactMedicalBehavioralSingleExample['Contact Last Name'],
  })
  @Expose()
  'Contact Last Name': string;

  @ApiProperty({
    example: ContactMedicalBehavioralSingleExample['Case Id'],
  })
  @Expose()
  'Case Id': string;

  @ApiProperty({
    example: ContactMedicalBehavioralSingleExample['Parent Case Num'],
  })
  @Expose()
  'Parent Case Num': string;

  constructor(partial: Partial<ContactMedicalBehavioralEntity>) {
    Object.assign(this, partial);
  }
}

@Exclude()
@ApiSchema({ name: 'ContactMedicalBehavioralResponse' })
export class NestedContactMedicalBehavioralEntity {
  @Expose()
  @ApiProperty({ type: ContactMedicalBehavioralEntity, isArray: true })
  @Type(() => ContactMedicalBehavioralEntity)
  items: Array<ContactMedicalBehavioralEntity>;

  constructor(object) {
    Object.assign(this, object);
  }
}
