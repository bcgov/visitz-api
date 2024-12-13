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

// TODO: Add more string examples once we can query the endpoint
/*
 * Examples
 */
export const ContactsSingleResponseCaseExample = {
  Id: 'Row-Id-Here',
  'Dependent Sequence Number': '0',
  'SSA Primary Field': 'Y',
  'Given Name': 'First-Name-Here',
  'Last Name': 'Last-Name-Here',
  'M/F': 'Woman/Girl',
  'Date of Birth': '01/01/1970',
  Age: '25',
  'Legal Status': '',
  'Aboriginal Calc': 'Yes',
  'Is 921 Band Found Calc': 'N',
  'CYSN Calc': '',
  'CYSN PST Score': '',
  'Coordination AGT (CA)': 'N',
  'Case Rel Type Code': 'Key player',
  'Case Subject': 'Y',
  'Case Con Parent/Caregiver': 'N',
  'Case Con Subject Child': 'N',
  'Involved Family Alerts': '',
  'Case Con Reported On': 'N',
  'Case Con Original Start Dt': '',
  'Case Con Start Dt': '01/01/1970 00:00:00',
  'Case Con End Dt': '',
  [createdByFieldName]: 'Creator-Idir-Here',
  [createdByIdFieldName]: 'Creator-Id-Here',
  [createdDateFieldName]: '01/01/1970 00:00:00',
  [updatedByFieldName]: 'Updater-Idir-Here',
  [updatedByIdFieldName]: 'Updater-Id-Here',
  [updatedDateFieldName]: '01/01/1970 00:00:00',
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
      Id: 'Another-Row-Id-Here',
    },
  ],
};

export const ContactsListResponseIncidentExample = {
  items: [
    ContactsSingleResponseIncidentExample,
    {
      ...ContactsSingleResponseIncidentExample,
      Id: 'Another-Row-Id-Here',
    },
  ],
};

export const ContactsListResponseMemoExample = {
  items: [
    ContactsSingleResponseMemoExample,
    {
      ...ContactsSingleResponseMemoExample,
      Id: 'Another-Row-Id-Here',
    },
  ],
};

export const ContactsListResponseSRExample = {
  items: [
    ContactsSingleResponseSRExample,
    {
      ...ContactsSingleResponseSRExample,
      Id: 'Another-Row-Id-Here',
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
    example: ContactsSingleResponseCaseExample['Dependent Sequence Number'],
  })
  @Expose()
  'Dependent Sequence Number': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['SSA Primary Field'],
  })
  @Expose()
  'SSA Primary Field': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Given Name'],
  })
  @Expose()
  'Given Name': string;

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
    example: ContactsSingleResponseCaseExample['Legal Status'],
  })
  @Expose()
  'Legal Status': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Aboriginal Calc'],
  })
  @Expose()
  'Aboriginal Calc': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['Is 921 Band Found Calc'],
  })
  @Expose()
  'Is 921 Band Found Calc': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample['CYSN Calc'],
  })
  @Expose()
  'CYSN Calc': string;

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
    example: ContactsSingleResponseCaseExample['Case Con End Dt'],
  })
  @Expose()
  'Case Con End Dt': string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample[createdByFieldName],
  })
  @Expose()
  [createdByFieldName]: string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample[createdByIdFieldName],
  })
  @Expose()
  [createdByIdFieldName]: string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample[createdDateFieldName],
  })
  @Expose()
  [createdDateFieldName]: string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample[updatedByFieldName],
  })
  @Expose()
  [updatedByFieldName]: string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample[updatedByIdFieldName],
  })
  @Expose()
  [updatedByIdFieldName]: string;

  @ApiProperty({
    example: ContactsSingleResponseCaseExample[updatedDateFieldName],
  })
  @Expose()
  [updatedDateFieldName]: string;

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
