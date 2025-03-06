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
export const ContactsSingleResponseCaseExample = {
  '92_1 AGT': 'N',
  'Active Addresses': '0',
  Age: '0',
  'AKA First Name': 'Name Here',
  'AKA Last Name': 'Name Here',
  Alerts: '',
  'Autism Funding Paused': '',
  'BCeID User Name': 'UserName Here',
  'Canadian Citizen': 'Y',
  'Cell Phone': '',
  Citizen: '',
  Citizenship: '',
  City: 'City Here',
  'Collaborate ID': '',
  Comments: 'Comments Here',
  'Concerns Outcome': '',
  'Coordination AGT CA': 'N',
  Country: 'Country Here',
  'Country of Birth': 'Country of Birth Here',
  [createdByFieldName]: 'Creator IDIR Here',
  [createdByIdFieldName]: 'Creator Row Id Here',
  [createdDateFieldName]: '01/01/1970 00:00:00',
  'Current Start Date': '01/01/1970 00:00:00',
  CYSN: '',
  'Date of Birth': '01/01/1970',
  'Date Updated_Citizen Updated Date': '01/01/1970 00:00:00',
  'Date Updated_Citizenship Updated Date': '01/01/1970 00:00:00',
  Deceased: 'Y',
  'Deceased Date': '01/01/1970',
  'End Date': '01/01/1970 00:00:00',
  'First Name': 'First Name Here',
  Gender: 'Gender Here',
  'Given Names': 'Given Names Here',
  'Home Phone': '123-456-7890',
  Id: 'Id Here',
  'Immigration Status': '',
  'Immigration Status Updated': '',
  Indigenous: 'No',
  'Integration State': 'Synced',
  'Investigation Outcome Summary': '',
  'Last Name': 'Last Name Here',
  'Legacy Dependent Sequence': '',
  'Legal Status': '',
  'Message Phone': '123-456-7890',
  'Middle Names': 'Middle Names Here',
  'Original Start Date': '01/01/1970 00:00:00',
  Parent_Caregiver: 'N',
  'Person ID ICM': 'ICM Id Here',
  'Person ID MIS': 'MIS Id Here',
  'Person Responsible for Alleged Maltreatment': 'N',
  PHN: 'PHN Here',
  'PHN Verified': 'N',
  'Postal Code': 'Postal Code Here',
  'Potential Duplicate': 'N',
  'Potential Duplicate Comments': 'Potential Duplicate Comments Here',
  'Preferred Language': '',
  Primary: 'N',
  'Primary Address': 'Address Here',
  'Primary Email': 'sample@example.com',
  'Project Code': '',
  Prov: 'BC',
  'PST Score': '',
  Relationship: 'Relationship Here',
  Role: '',
  'Row Id': 'Id Here',
  'SAET Paused': '',
  SIN: 'SIN Here',
  'Start Date': '01/01/1970',
  'Street Address': 'Street Address 1 Here',
  'Street Address 2': 'Street Address 2 Here',
  Subject: '',
  'Subject Child': 'N',
  Title: '',
  'Unit Number': 'Unit Number Here',
  [updatedByFieldName]: 'Updater IDIR Here',
  [updatedByIdFieldName]: 'Updater Row Id Here',
  [updatedDateFieldName]: '01/01/1970 00:00:00',
  'Work Phone': '123-456-7890',
};

export const { ...ContactsSingleResponseIncidentExample } =
  ContactsSingleResponseCaseExample;

// TODO: Add memos fields once we figure out if the fields are extraneous?
export const { ...ContactsSingleResponseMemoExample } =
  ContactsSingleResponseIncidentExample;

export const { ...ContactsSingleResponseSRExample } =
  ContactsSingleResponseIncidentExample;

export const ContactsListResponseCaseExample = {
  items: [
    ContactsSingleResponseCaseExample,
    {
      ...ContactsSingleResponseCaseExample,
      Id: 'Another Row Id Here',
    },
  ],
};

export const ContactsListResponseIncidentExample = {
  items: [
    ContactsSingleResponseIncidentExample,
    {
      ...ContactsSingleResponseIncidentExample,
      Id: 'Another Row Id Here',
    },
  ],
};

export const ContactsListResponseMemoExample = {
  items: [
    ContactsSingleResponseMemoExample,
    {
      ...ContactsSingleResponseMemoExample,
      Id: 'Another Row Id Here',
    },
  ],
};

export const ContactsListResponseSRExample = {
  items: [
    ContactsSingleResponseSRExample,
    {
      ...ContactsSingleResponseSRExample,
      Id: 'Another Row Id Here',
    },
  ],
};

/*
 * Model definitions
 */
@Exclude()
@ApiSchema({ name: 'Contact' })
export class ContactsEntity {
  @ApiProperty({
    example: ContactsSingleResponseCaseExample['92_1 AGT'],
  })
  @Expose()
  '92_1 AGT': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Active Addresses'],
  })
  @Expose()
  'Active Addresses': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Age'],
  })
  @Expose()
  'Age': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['AKA First Name'],
  })
  @Expose()
  'AKA First Name': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['AKA Last Name'],
  })
  @Expose()
  'AKA Last Name': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Alerts'],
  })
  @Expose()
  'Alerts': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Autism Funding Paused'],
  })
  @Expose()
  'Autism Funding Paused': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['BCeID User Name'],
  })
  @Expose()
  'BCeID User Name': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Canadian Citizen'],
  })
  @Expose()
  'Canadian Citizen': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Cell Phone'],
  })
  @Expose()
  'Cell Phone': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Citizen'],
  })
  @Expose()
  'Citizen': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Citizenship'],
  })
  @Expose()
  'Citizenship': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['City'],
  })
  @Expose()
  'City': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Collaborate ID'],
  })
  @Expose()
  'Collaborate ID': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Comments'],
  })
  @Expose()
  'Comments': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Concerns Outcome'],
  })
  @Expose()
  'Concerns Outcome': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Coordination AGT CA'],
  })
  @Expose()
  'Coordination AGT CA': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Country'],
  })
  @Expose()
  'Country': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Country of Birth'],
  })
  @Expose()
  'Country of Birth': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Created By'],
  })
  @Expose()
  [createdByFieldName]: string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Created By Id'],
  })
  @Expose()
  [createdByIdFieldName]: string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Created Date'],
  })
  @Expose()
  [createdDateFieldName]: string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Current Start Date'],
  })
  @Expose()
  'Current Start Date': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['CYSN'],
  })
  @Expose()
  'CYSN': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Date of Birth'],
  })
  @Expose()
  'Date of Birth': string;

  @ApiProperty({
    example:
      ContactsSingleResponseCaseExample['Date Updated_Citizen Updated Date'],
  })
  @Expose()
  'Date Updated_Citizen Updated Date': string;

  @ApiProperty({
    example:
      ContactsSingleResponseCaseExample[
        'Date Updated_Citizenship Updated Date'
      ],
  })
  @Expose()
  'Date Updated_Citizenship Updated Date': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Deceased'],
  })
  @Expose()
  'Deceased': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Deceased Date'],
  })
  @Expose()
  'Deceased Date': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['End Date'],
  })
  @Expose()
  'End Date': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['First Name'],
  })
  @Expose()
  'First Name': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Gender'],
  })
  @Expose()
  'Gender': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Given Names'],
  })
  @Expose()
  'Given Names': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Home Phone'],
  })
  @Expose()
  'Home Phone': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Id'],
  })
  @Expose()
  'Id': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Immigration Status'],
  })
  @Expose()
  'Immigration Status': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Immigration Status Updated'],
  })
  @Expose()
  'Immigration Status Updated': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Indigenous'],
  })
  @Expose()
  'Indigenous': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Integration State'],
  })
  @Expose()
  'Integration State': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Investigation Outcome Summary'],
  })
  @Expose()
  'Investigation Outcome Summary': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Last Name'],
  })
  @Expose()
  'Last Name': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Legacy Dependent Sequence'],
  })
  @Expose()
  'Legacy Dependent Sequence': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Legal Status'],
  })
  @Expose()
  'Legal Status': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Message Phone'],
  })
  @Expose()
  'Message Phone': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Middle Names'],
  })
  @Expose()
  'Middle Names': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Original Start Date'],
  })
  @Expose()
  'Original Start Date': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Parent_Caregiver'],
  })
  @Expose()
  'Parent_Caregiver': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Person ID ICM'],
  })
  @Expose()
  'Person ID ICM': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Person ID MIS'],
  })
  @Expose()
  'Person ID MIS': string;

  @ApiProperty({
    example:
      ContactsSingleResponseCaseExample[
        'Person Responsible for Alleged Maltreatment'
      ],
  })
  @Expose()
  'Person Responsible for Alleged Maltreatment': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['PHN'],
  })
  @Expose()
  'PHN': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['PHN Verified'],
  })
  @Expose()
  'PHN Verified': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Postal Code'],
  })
  @Expose()
  'Postal Code': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Potential Duplicate'],
  })
  @Expose()
  'Potential Duplicate': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Potential Duplicate Comments'],
  })
  @Expose()
  'Potential Duplicate Comments': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Preferred Language'],
  })
  @Expose()
  'Preferred Language': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Primary'],
  })
  @Expose()
  'Primary': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Primary Address'],
  })
  @Expose()
  'Primary Address': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Primary Email'],
  })
  @Expose()
  'Primary Email': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Project Code'],
  })
  @Expose()
  'Project Code': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Prov'],
  })
  @Expose()
  'Prov': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['PST Score'],
  })
  @Expose()
  'PST Score': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Relationship'],
  })
  @Expose()
  'Relationship': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Role'],
  })
  @Expose()
  'Role': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Row Id'],
  })
  @Expose()
  'Row Id': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['SAET Paused'],
  })
  @Expose()
  'SAET Paused': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['SIN'],
  })
  @Expose()
  'SIN': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Start Date'],
  })
  @Expose()
  'Start Date': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Street Address'],
  })
  @Expose()
  'Street Address': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Street Address 2'],
  })
  @Expose()
  'Street Address 2': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Subject'],
  })
  @Expose()
  'Subject': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Subject Child'],
  })
  @Expose()
  'Subject Child': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Title'],
  })
  @Expose()
  'Title': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Unit Number'],
  })
  @Expose()
  'Unit Number': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Updated By'],
  })
  @Expose()
  [updatedByFieldName]: string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Updated By Id'],
  })
  @Expose()
  [updatedByIdFieldName]: string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Updated Date'],
  })
  @Expose()
  [updatedDateFieldName]: string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Work Phone'],
  })
  @Expose()
  'Work Phone': string;

  constructor(object) {
    Object.assign(this, object);
  }
}

@Exclude()
@ApiSchema({ name: 'ContactsResponse' })
export class NestedContactsEntity {
  @Expose()
  @ApiProperty({ type: ContactsEntity, isArray: true })
  @Type(() => ContactsEntity)
  items: Array<ContactsEntity>;

  constructor(object) {
    Object.assign(this, object);
  }
}
