import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

/*
 * Examples
 */

export const ContactLegalAuthoritySingleExample = {
  Id: 'Id Here',
  'Case Id': 'Case Id Here',
  'Incident Id': 'Incident Id Here',
  'Parent Contact Id': 'Parent Contact Id Here',
  'Legal Authority Code': 'Legal Authority Code Here',
  'Legal Authority Code Deletion': 'Legal Authority Code Deletion Here',
  'Legal Authority Description': 'Legal Authority Description Here',
  'Reason for Service': 'Reason for Service Here',
  'Reason for Service 2': 'Reason for Service 2 Here',
  'Reason for Service 3': 'Reason for Service 3 Here',
  'Reason for Service 4': 'Reason for Service 4 Here',
  'Agreement with': 'Agreement With Here',
  'By Agreement Flag': 'Y',
  Type: 'Type Here',
  'Dependant Sequence Number': 'Dependant Sequence Number Here',
  Designate: 'Designate Here',
  'Directors Authority': 'Directors Authority Here',
  'Effective Date': '01/01/1970',
  'Expiry Date': '01/01/1970',
  'Expiry Date Required': 'Y',
  'Effective Legal Status': 'Effective Legal Status Here',
  'Error Description': 'Error Description Here',
  'In Care?': 'Y',
  'Indigenous Comments': 'Indigenous Comments Here',
  'Indigenous Communities': 'Indigenous Communities Here',
  'Indigenous Communitie Party Agreement':
    'Indigenous Communitie Party Agreement Here',
  'Primary Band Id': 'Primary Band Id Here',
  'Integration State': 'Integration State Here',
  'Last Hearing Date': '01/01/1970',
  'Next Hearing Date': '01/01/1970',
  Name: 'Name Here',
  'Terms and Conditions': 'Terms and Conditions Here',
  Comments: 'Comments Here',
  Created: '01/01/1970 00:00:00',
  'Created By': 'Creator Row Id Here',
  'Created By Name': 'Creator IDIR Here',
  Updated: '01/01/1970 00:00:00',
  'Updated By': 'Updater Row Id Here',
  'Updated By Name': 'Updater IDIR Here',
};

export const ContactLegalAuthorityListResponseExample = {
  items: [
    {
      ...ContactLegalAuthoritySingleExample,
      Id: 'Another Id Here',
    },
    ContactLegalAuthoritySingleExample,
  ],
};

export const PostContactLegalAuthorityResponseExample = {
  items: [ContactLegalAuthoritySingleExample],
};

/*
 * Model definitions
 */
@Exclude()
@ApiSchema({ name: 'ContactLegalAuthority' })
export class ContactLegalAuthorityEntity {
  @ApiProperty({
    example: ContactLegalAuthoritySingleExample['Id'],
  })
  @Expose()
  'Id': string;

  @ApiProperty({
    example: ContactLegalAuthoritySingleExample['Case Id'],
  })
  @Expose()
  'Case Id': string;

  @ApiProperty({
    example: ContactLegalAuthoritySingleExample['Incident Id'],
  })
  @Expose()
  'Incident Id': string;

  @ApiProperty({
    example: ContactLegalAuthoritySingleExample['Parent Contact Id'],
  })
  @Expose()
  'Parent Contact Id': string;

  @ApiProperty({
    example: ContactLegalAuthoritySingleExample['Legal Authority Code'],
  })
  @Expose()
  'Legal Authority Code': string;

  @ApiProperty({
    example:
      ContactLegalAuthoritySingleExample['Legal Authority Code Deletion'],
  })
  @Expose()
  'Legal Authority Code Deletion': string;

  @ApiProperty({
    example: ContactLegalAuthoritySingleExample['Legal Authority Description'],
  })
  @Expose()
  'Legal Authority Description': string;

  @ApiProperty({
    example: ContactLegalAuthoritySingleExample['Reason for Service'],
  })
  @Expose()
  'Reason for Service': string;

  @ApiProperty({
    example: ContactLegalAuthoritySingleExample['Reason for Service 2'],
  })
  @Expose()
  'Reason for Service 2': string;

  @ApiProperty({
    example: ContactLegalAuthoritySingleExample['Reason for Service 3'],
  })
  @Expose()
  'Reason for Service 3': string;

  @ApiProperty({
    example: ContactLegalAuthoritySingleExample['Reason for Service 4'],
  })
  @Expose()
  'Reason for Service 4': string;

  @ApiProperty({
    example: ContactLegalAuthoritySingleExample['Agreement with'],
  })
  @Expose()
  'Agreement with': string;

  @ApiProperty({
    example: ContactLegalAuthoritySingleExample['By Agreement Flag'],
  })
  @Expose()
  'By Agreement Flag': string;

  @ApiProperty({
    example: ContactLegalAuthoritySingleExample['Type'],
  })
  @Expose()
  'Type': string;

  @ApiProperty({
    example: ContactLegalAuthoritySingleExample['Dependant Sequence Number'],
  })
  @Expose()
  'Dependant Sequence Number': string;

  @ApiProperty({
    example: ContactLegalAuthoritySingleExample['Designate'],
  })
  @Expose()
  'Designate': string;

  @ApiProperty({
    example: ContactLegalAuthoritySingleExample['Directors Authority'],
  })
  @Expose()
  'Directors Authority': string;

  @ApiProperty({
    example: ContactLegalAuthoritySingleExample['Effective Date'],
  })
  @Expose()
  'Effective Date': string;

  @ApiProperty({
    example: ContactLegalAuthoritySingleExample['Expiry Date'],
  })
  @Expose()
  'Expiry Date': string;

  @ApiProperty({
    example: ContactLegalAuthoritySingleExample['Expiry Date Required'],
  })
  @Expose()
  'Expiry Date Required': string;

  @ApiProperty({
    example: ContactLegalAuthoritySingleExample['Effective Legal Status'],
  })
  @Expose()
  'Effective Legal Status': string;

  @ApiProperty({
    example: ContactLegalAuthoritySingleExample['Error Description'],
  })
  @Expose()
  'Error Description': string;

  @ApiProperty({
    example: ContactLegalAuthoritySingleExample['In Care?'],
  })
  @Expose()
  'In Care?': string;

  @ApiProperty({
    example: ContactLegalAuthoritySingleExample['Indigenous Comments'],
  })
  @Expose()
  'Indigenous Comments': string;

  @ApiProperty({
    example: ContactLegalAuthoritySingleExample['Indigenous Communities'],
  })
  @Expose()
  'Indigenous Communities': string;

  @ApiProperty({
    example:
      ContactLegalAuthoritySingleExample[
        'Indigenous Communitie Party Agreement'
      ],
  })
  @Expose()
  'Indigenous Communitie Party Agreement': string;

  @ApiProperty({
    example: ContactLegalAuthoritySingleExample['Primary Band Id'],
  })
  @Expose()
  'Primary Band Id': string;

  @ApiProperty({
    example: ContactLegalAuthoritySingleExample['Integration State'],
  })
  @Expose()
  'Integration State': string;

  @ApiProperty({
    example: ContactLegalAuthoritySingleExample['Last Hearing Date'],
  })
  @Expose()
  'Last Hearing Date': string;

  @ApiProperty({
    example: ContactLegalAuthoritySingleExample['Next Hearing Date'],
  })
  @Expose()
  'Next Hearing Date': string;

  @ApiProperty({
    example: ContactLegalAuthoritySingleExample['Name'],
  })
  @Expose()
  'Name': string;

  @ApiProperty({
    example: ContactLegalAuthoritySingleExample['Terms and Conditions'],
  })
  @Expose()
  'Terms and Conditions': string;

  @ApiProperty({
    example: ContactLegalAuthoritySingleExample['Comments'],
  })
  @Expose()
  'Comments': string;

  @ApiProperty({
    example: ContactLegalAuthoritySingleExample['Created'],
  })
  @Expose()
  'Created': string;

  @ApiProperty({
    example: ContactLegalAuthoritySingleExample['Created By'],
  })
  @Expose()
  'Created By': string;

  @ApiProperty({
    example: ContactLegalAuthoritySingleExample['Created By Name'],
  })
  @Expose()
  'Created By Name': string;

  @ApiProperty({
    example: ContactLegalAuthoritySingleExample['Updated'],
  })
  @Expose()
  'Updated': string;

  @ApiProperty({
    example: ContactLegalAuthoritySingleExample['Updated By'],
  })
  @Expose()
  'Updated By': string;

  @ApiProperty({
    example: ContactLegalAuthoritySingleExample['Updated By Name'],
  })
  @Expose()
  'Updated By Name': string;

  constructor(partial: Partial<ContactLegalAuthorityEntity>) {
    Object.assign(this, partial);
  }
}

@Exclude()
@ApiSchema({ name: 'ContactLegalAuthorityResponse' })
export class NestedContactLegalAuthorityEntity {
  @Expose()
  @ApiProperty({ type: ContactLegalAuthorityEntity, isArray: true })
  @Type(() => ContactLegalAuthorityEntity)
  items: Array<ContactLegalAuthorityEntity>;

  constructor(object) {
    Object.assign(this, object);
  }
}
