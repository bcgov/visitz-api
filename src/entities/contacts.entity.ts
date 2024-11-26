/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

// TODO: Add more string examples once we can query the endpoint
/*
 * Examples
 */
const ContactsSingleResponseCaseExample = {
  Id: 'Row-Id-Here',
  'Party UId': 'Row-Id-Here',
  'Person UId': 'Row-Id-Here', // all three are the same
  'Master Case Number': '',
  'Dependent Sequence Number': '0',
  'Given Name': 'First-Name-Here',
  'First Name': 'First-Name-Here', // these 2 are the same
  'Middle Name': 'Middle-Name-Here',
  'Last Name': 'Last-Name-Here',
  'M/F': 'Woman/Girl',
  'Birth Date': '01/01/1970',
  'Date of Birth': '01/01/1970', // these 2 are the same
  Age: '25',
  'Deceased Flag': 'N',
  'Deceased Date': '',
  'Age Deceased': '',
  IsDisabilityServices: 'N',
  IsDisabilityServicesSNC: 'N', // might be the same
  IsSNCCaseType: 'N',
  CaseAccessSNC: 'N', // might be the same?
  'Legal Status': '',
  'Aboriginal Origin Code': '',
  '921 Current Band': '',
  '921 Mother Band': '',
  '921 Father Band': '',
  '921 Branch Band': '',
  'Is 921 Band Found Calc': 'N',
  'CA Current Band': '',
  'CA Mother Band': '',
  'CA Father Band': '',
  'CA Branch Band': '',
  'CYSN Calc': '',
  'CYSN Calc 1': 'N',
  'CYSN Calc 2': 'N',
  'CYSN Calc 3': 'N',
  'CYSN Calc 4': 'N',
  'CYSN Calc 5': 'N',
  'CYSN PST Score': '',
  'Coordination AGT (CA)': 'N',
  'Privacy Code': 'Opt-Out: All Parties',
  'Party Type Code': 'Person',
  'Lead Contact Type': '',
  'Case Rel Type Code': 'Key player',
  'Case Subject': 'Y',
  'Case Con Parent/Caregiver': 'N',
  'Case Con Subject Child': 'N',
  'Involved Family Alerts': '',
  'Case Con Reported On': 'N',
  'Case Con Original Start Dt': '', // usually empty
  'Case Con Start Dt': '01/01/1970 00:00:00', // maybe the same?
  'Created By Name': 'Creator-Id-Here',
  Updated: '01/01/1970 00:00:00',
  'Updated By Name': 'Updater-Id-Here',
  'Case Con End Dt': '',
};

const {
  'CA Mother Band': _0,
  '921 Current Band': _1,
  'CA Father Band': _2,
  'CA Branch Band': _3,
  'CYSN Calc 5': _4,
  'CYSN Calc 4': _5,
  'CYSN Calc 3': _6,
  'CYSN Calc 2': _7,
  'CYSN Calc 1': _8,
  'Master Case Number': _9,
  '921 Mother Band': _10,
  '921 Branch Band': _11,
  'CA Current Band': _12,
  'Involved Family Alerts': _13,
  ...ContactsSingleResponseIncidentExample
} = ContactsSingleResponseCaseExample;

const { ...ContactsSingleResponseSRExample } =
  ContactsSingleResponseIncidentExample;

// TODO: Add memos once we figure out if the fields are extraneous?
export const ContactsListResponseCaseExample = {
  items: [
    ContactsSingleResponseCaseExample,
    {
      ...ContactsSingleResponseCaseExample,
      Id: 'Another-Row-Id-Here',
      'Party UId': 'Another-Row-Id-Here',
      'Person UId': 'Another-Row-Id-Here',
    },
  ],
};

export const ContactsListResponseIncidentExample = {
  items: [
    ContactsSingleResponseIncidentExample,
    {
      ...ContactsSingleResponseIncidentExample,
      Id: 'Another-Row-Id-Here',
      'Party UId': 'Another-Row-Id-Here',
      'Person UId': 'Another-Row-Id-Here',
    },
  ],
};

export const ContactsListResponseSRExample = {
  items: [
    ContactsSingleResponseSRExample,
    {
      ...ContactsSingleResponseSRExample,
      Id: 'Another-Row-Id-Here',
      'Party UId': 'Another-Row-Id-Here',
      'Person UId': 'Another-Row-Id-Here',
    },
  ],
};

/*
 * Model definitions
 */
@Exclude()
@ApiSchema({ name: 'Contact' })
class ContactsEntity {
  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Id'],
  })
  @Expose()
  Id: string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Party UId'],
  })
  @Expose()
  'Party UId': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Person UId'],
  })
  @Expose()
  'Person UId': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Master Case Number'],
  })
  @Expose()
  'Master Case Number': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Dependent Sequence Number'],
  })
  @Expose()
  'Dependent Sequence Number': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Given Name'],
  })
  @Expose()
  'Given Name': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['First Name'],
  })
  @Expose()
  'First Name': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Middle Name'],
  })
  @Expose()
  'Middle Name': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Last Name'],
  })
  @Expose()
  'Last Name': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['M/F'],
  })
  @Expose()
  'M/F': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Birth Date'],
  })
  @Expose()
  'Birth Date': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Date of Birth'],
  })
  @Expose()
  'Date of Birth': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Age'],
  })
  @Expose()
  Age: string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Deceased Flag'],
  })
  @Expose()
  'Deceased Flag': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Deceased Date'],
  })
  @Expose()
  'Deceased Date': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Age Deceased'],
  })
  @Expose()
  'Age Deceased': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['IsDisabilityServices'],
  })
  @Expose()
  IsDisabilityServices: string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['IsDisabilityServicesSNC'],
  })
  @Expose()
  IsDisabilityServicesSNC: string;
  // might be the same
  @ApiProperty({
    example: ContactsSingleResponseCaseExample['IsSNCCaseType'],
  })
  @Expose()
  IsSNCCaseType: string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['CaseAccessSNC'],
  })
  @Expose()
  CaseAccessSNC: string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Legal Status'],
  })
  @Expose()
  'Legal Status': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Aboriginal Origin Code'],
  })
  @Expose()
  'Aboriginal Origin Code': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['921 Current Band'],
  })
  @Expose()
  '921 Current Band': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['921 Mother Band'],
  })
  @Expose()
  '921 Mother Band': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['921 Father Band'],
  })
  @Expose()
  '921 Father Band': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['921 Branch Band'],
  })
  @Expose()
  '921 Branch Band': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Is 921 Band Found Calc'],
  })
  @Expose()
  'Is 921 Band Found Calc': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['CA Current Band'],
  })
  @Expose()
  'CA Current Band': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['CA Mother Band'],
  })
  @Expose()
  'CA Mother Band': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['CA Father Band'],
  })
  @Expose()
  'CA Father Band': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['CA Branch Band'],
  })
  @Expose()
  'CA Branch Band': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['CYSN Calc'],
  })
  @Expose()
  'CYSN Calc': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['CYSN Calc 1'],
  })
  @Expose()
  'CYSN Calc 1': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['CYSN Calc 2'],
  })
  @Expose()
  'CYSN Calc 2': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['CYSN Calc 3'],
  })
  @Expose()
  'CYSN Calc 3': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['CYSN Calc 4'],
  })
  @Expose()
  'CYSN Calc 4': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['CYSN Calc 5'],
  })
  @Expose()
  'CYSN Calc 5': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['CYSN PST Score'],
  })
  @Expose()
  'CYSN PST Score': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Coordination AGT (CA)'],
  })
  @Expose()
  'Coordination AGT (CA)': string;
  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Privacy Code'],
  })
  @Expose()
  'Privacy Code': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Party Type Code'],
  })
  @Expose()
  'Party Type Code': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Lead Contact Type'],
  })
  @Expose()
  'Lead Contact Type': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Case Rel Type Code'],
  })
  @Expose()
  'Case Rel Type Code': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Case Subject'],
  })
  @Expose()
  'Case Subject': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Case Con Parent/Caregiver'],
  })
  @Expose()
  'Case Con Parent/Caregiver': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Case Con Subject Child'],
  })
  @Expose()
  'Case Con Subject Child': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Involved Family Alerts'],
  })
  @Expose()
  'Involved Family Alerts': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Case Con Reported On'],
  })
  @Expose()
  'Case Con Reported On': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Case Con Original Start Dt'],
  })
  @Expose()
  'Case Con Original Start Dt': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Case Con Start Dt'],
  })
  @Expose()
  'Case Con Start Dt': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Created By Name'],
  })
  @Expose()
  'Created By Name': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Updated'],
  })
  @Expose()
  Updated: string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Updated By Name'],
  })
  @Expose()
  'Updated By Name': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Case Con End Dt'],
  })
  @Expose()
  'Case Con End Dt': string;

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
