import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

/*
 * Examples
 */

export const ContactLanguagesSingleExample = {
  Id: 'Id Here',
  'Language Name': 'Language Here',
  'Other Language': 'Other Language Here',
  'Translator Req': 'Y',
  Type: 'Type Here',
  'ICM Type': 'ICM Type Here',
  Comments: 'Comments Here',
  'SSA Primary Field': 'Y',
  Created: '01/01/1970 00:00:00',
  'Created By': 'Creator Row Id Here',
  'Created By Name': 'Creator IDIR Here',
  Updated: '01/01/1970 00:00:00',
  'Updated By': 'Updater Row Id Here',
  'Updated By Name': 'Updater IDIR Here',
  'Contact Id': 'Parent Id Here',
};

export const ContactLanguagesListResponseExample = {
  items: [
    {
      ...ContactLanguagesSingleExample,
      Id: 'Another Id Here',
    },
    ContactLanguagesSingleExample,
  ],
};

export const PostContactLanguagesResponseExample = {
  items: [ContactLanguagesSingleExample],
};

/*
 * Model definitions
 */
@Exclude()
@ApiSchema({ name: 'ContactLanguages' })
export class ContactLanguagesEntity {
  @ApiProperty({
    example: ContactLanguagesSingleExample['Id'],
  })
  @Expose()
  'Id': string;

  @ApiProperty({
    example: ContactLanguagesSingleExample['Language Name'],
  })
  @Expose()
  'Language Name': string;

  @ApiProperty({
    example: ContactLanguagesSingleExample['Other Language'],
  })
  @Expose()
  'Other Language': string;

  @ApiProperty({
    example: ContactLanguagesSingleExample['Translator Req'],
  })
  @Expose()
  'Translator Req': string;

  @ApiProperty({
    example: ContactLanguagesSingleExample['Type'],
  })
  @Expose()
  'Type': string;

  @ApiProperty({
    example: ContactLanguagesSingleExample['ICM Type'],
  })
  @Expose()
  'ICM Type': string;

  @ApiProperty({
    example: ContactLanguagesSingleExample['Comments'],
  })
  @Expose()
  'Comments': string;

  @ApiProperty({
    example: ContactLanguagesSingleExample['SSA Primary Field'],
  })
  @Expose()
  'SSA Primary Field': string;

  @ApiProperty({
    example: ContactLanguagesSingleExample['Created'],
  })
  @Expose()
  'Created': string;

  @ApiProperty({
    example: ContactLanguagesSingleExample['Created By'],
  })
  @Expose()
  'Created By': string;

  @ApiProperty({
    example: ContactLanguagesSingleExample['Created By Name'],
  })
  @Expose()
  'Created By Name': string;

  @ApiProperty({
    example: ContactLanguagesSingleExample['Updated'],
  })
  @Expose()
  'Updated': string;

  @ApiProperty({
    example: ContactLanguagesSingleExample['Updated By'],
  })
  @Expose()
  'Updated By': string;

  @ApiProperty({
    example: ContactLanguagesSingleExample['Updated By Name'],
  })
  @Expose()
  'Updated By Name': string;

  @ApiProperty({
    example: ContactLanguagesSingleExample['Contact Id'],
  })
  @Expose()
  'Contact Id': string;

  constructor(partial: Partial<ContactLanguagesEntity>) {
    Object.assign(this, partial);
  }
}

@Exclude()
@ApiSchema({ name: 'ContactLanguagesResponse' })
export class NestedContactLanguagesEntity {
  @Expose()
  @ApiProperty({ type: ContactLanguagesEntity, isArray: true })
  @Type(() => ContactLanguagesEntity)
  items: Array<ContactLanguagesEntity>;

  constructor(object) {
    Object.assign(this, object);
  }
}
