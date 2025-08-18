import { ApiSchema, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  createdByFieldName,
  createdByIdFieldName,
  createdDateFieldName,
  updatedByFieldName,
  updatedByIdFieldName,
  updatedDateFieldName,
} from '../common/constants/upstream-constants';

export const IncidentConcernsExample = {
  'Start Date': 'Start Date Here',
  Id: 'Id Here',
  Concern: 'Concern Here',
  'End Date': 'End Date Here',
  Original: 'Original Here',
};

export const IncidentCallInformationExample = {
  Id: 'Id Here',
  'Call Information': 'Call Information Here',
};

export const IncidentAdditionalInformationExample = {
  Id: 'Id Here',
  'Additional Information': 'Additional Information Here',
};

export const IncidentExample = {
  'Acceptance Date': '01/01/1970 00:00:00',
  Address: 'Address Here',
  'Address Comments': 'Address Comments Here',
  'Are Any Of The Family Members Indigenous': 'N',
  'Assigned To': 'Assignee IDIR Here',
  'Assigned To Id': 'Assignee IDIR Row Id Here',
  'Caller Address': 'Caller Address Here',
  'Caller Email': 'Caller Email Here',
  'Caller Name': 'Caller Name Here',
  'Caller Phone': 'Caller Phone Here',
  Caseload: '',
  'Cell Phone': '123-456-7890',
  'Closed Date': '01/01/1970 00:00:00',
  [createdByFieldName]: 'Creator IDIR Here',
  [createdByIdFieldName]: 'Creator Row Id Here',
  'Created By Office': 'Creation Office Here',
  [createdDateFieldName]: '01/01/1970 00:00:00',
  'Date Reported': '01/01/1970 00:00:00',
  'Given Names': 'First Names',
  'Home Phone': '123-456-7890',
  Id: 'Id Here',
  IncidentAdditionalInformation: [{ ...IncidentAdditionalInformationExample }],
  IncidentCallInformation: [{ ...IncidentCallInformationExample }],
  IncidentConcerns: [{ ...IncidentConcernsExample }],
  'Incident Number': 'Incident Number Here',
  'Indigenous Authority': '',
  Kkcfs: '',
  'Last Name': 'Last Name',
  'Medical Exam Required': 'Medical Exam Required Here',
  Method: 'Method Here',
  'Nature Of Call': 'Nature Of Call Here',
  'Pcc Summary': 'Summary Here',
  'Police Force': 'Police Force Here',
  'Police Investigation': 'Police Investigation Here',
  'Police Notified Date': 'Police Notified Date Here',
  'Police Report Number': 'Police Report Number Here',
  'Preferred Contact Method': 'Preferred Contact Method Here',
  'Protection Response': '',
  'Referral Date': '01/01/1970 00:00:00',
  Resolution: '',
  'Response Priority': ' ',
  'Restricted Flag': 'N',
  'Row Id': 'Id Here',
  'Service Office': 'Office Here',
  Status: 'Open',
  Type: 'Type Of Incident',
  'Type Of Caller': 'Type Of Caller Here',
  [updatedByIdFieldName]: 'Updater Row Id Here',
  [updatedByFieldName]: 'Updater IDIR Here',
  [updatedDateFieldName]: '01/01/1970 00:00:00',
};

/*
 * Model definitions
 */
@Exclude()
@ApiSchema({ name: 'IncidentAdditionalInformationValue' })
export class IncidentAdditionalInformationValue {
  @ApiProperty({
    example: IncidentAdditionalInformationExample['Id'],
  })
  @Expose()
  Id: string;

  @ApiProperty({
    example: IncidentAdditionalInformationExample['Additional Information'],
  })
  @Expose()
  'Additional Information': string;

  constructor(object) {
    Object.assign(this, object);
  }
}

@Exclude()
@ApiSchema({ name: 'IncidentCallInformationValue' })
export class IncidentCallInformationValue {
  @ApiProperty({
    example: IncidentCallInformationExample['Id'],
  })
  @Expose()
  Id: string;

  @ApiProperty({
    example: IncidentCallInformationExample['Call Information'],
  })
  @Expose()
  'Call Information': string;

  constructor(object) {
    Object.assign(this, object);
  }
}

@Exclude()
@ApiSchema({ name: 'IncidentConcernsValue' })
export class IncidentConcernsValue {
  @ApiProperty({
    example: IncidentConcernsExample['Start Date'],
  })
  @Expose()
  'Start Date': string;

  @ApiProperty({
    example: IncidentConcernsExample['Id'],
  })
  @Expose()
  Id: string;

  @ApiProperty({
    example: IncidentConcernsExample['Concern'],
  })
  @Expose()
  Concern: string;

  @ApiProperty({
    example: IncidentConcernsExample['End Date'],
  })
  @Expose()
  'End Date': string;

  @ApiProperty({
    example: IncidentConcernsExample['Original'],
  })
  @Expose()
  Original: string;

  constructor(object) {
    Object.assign(this, object);
  }
}

@Exclude()
@ApiSchema({ name: 'Incident' })
export class IncidentEntity {
  @ApiProperty({
    example: IncidentExample['Acceptance Date'],
  })
  @Expose()
  'Acceptance Date': string;

  @ApiProperty({
    example: IncidentExample['Address Comments'],
  })
  @Expose()
  'Address Comments': string;

  @ApiProperty({
    example: IncidentExample['Address'],
  })
  @Expose()
  Address: string;

  @ApiProperty({
    example: IncidentExample['Are Any Of The Family Members Indigenous'],
  })
  @Expose()
  'Are Any Of The Family Members Indigenous': string;

  @ApiProperty({
    example: IncidentExample['Assigned To'],
  })
  @Expose()
  'Assigned To': string;

  @ApiProperty({
    example: IncidentExample['Assigned To Id'],
  })
  @Expose()
  'Assigned To Id': string;

  @ApiProperty({
    example: IncidentExample['Caller Address'],
  })
  @Expose()
  'Caller Address': string;

  @ApiProperty({
    example: IncidentExample['Caller Email'],
  })
  @Expose()
  'Caller Email': string;

  @ApiProperty({
    example: IncidentExample['Caller Name'],
  })
  @Expose()
  'Caller Name': string;

  @ApiProperty({
    example: IncidentExample['Caller Phone'],
  })
  @Expose()
  'Caller Phone': string;

  @ApiProperty({
    example: IncidentExample['Caseload'],
  })
  @Expose()
  Caseload: string;

  @ApiProperty({
    example: IncidentExample['Cell Phone'],
  })
  @Expose()
  'Cell Phone': string;

  @ApiProperty({
    example: IncidentExample['Closed Date'],
  })
  @Expose()
  'Closed Date': string;

  @ApiProperty({
    example: IncidentExample['Created By'],
  })
  @Expose()
  [createdByFieldName]: string;

  @ApiProperty({
    example: IncidentExample['Created By Id'],
  })
  @Expose()
  [createdByIdFieldName]: string;

  @ApiProperty({
    example: IncidentExample['Created By Office'],
  })
  @Expose()
  'Created By Office': string;

  @ApiProperty({
    example: IncidentExample['Created Date'],
  })
  @Expose()
  [createdDateFieldName]: string;

  @ApiProperty({
    example: IncidentExample['Date Reported'],
  })
  @Expose()
  'Date Reported': string;

  @ApiProperty({
    example: IncidentExample['Given Names'],
  })
  @Expose()
  'Given Names': string;

  @ApiProperty({
    example: IncidentExample['Home Phone'],
  })
  @Expose()
  'Home Phone': string;

  @ApiProperty({
    example: IncidentExample['Id'],
  })
  @Expose()
  Id: string;

  @Expose()
  @ApiProperty({
    example: IncidentAdditionalInformationExample,
    type: IncidentAdditionalInformationValue,
    isArray: true,
  })
  @Type(() => IncidentAdditionalInformationValue)
  IncidentAdditionalInformation: Array<IncidentAdditionalInformationValue>;

  @Expose()
  @ApiProperty({
    example: IncidentCallInformationExample,
    type: IncidentCallInformationValue,
    isArray: true,
  })
  @Type(() => IncidentCallInformationValue)
  IncidentCallInformation: Array<IncidentCallInformationValue>;

  @Expose()
  @ApiProperty({
    example: IncidentConcernsExample,
    type: IncidentConcernsValue,
    isArray: true,
  })
  @Type(() => IncidentConcernsValue)
  IncidentConcerns: Array<IncidentConcernsValue>;

  @ApiProperty({
    example: IncidentExample['Incident Number'],
  })
  @Expose()
  'Incident Number': string;

  @ApiProperty({
    example: IncidentExample['Indigenous Authority'],
  })
  @Expose()
  'Indigenous Authority': string;

  @ApiProperty({
    example: IncidentExample['Kkcfs'],
  })
  @Expose()
  'Kkcfs': string;

  @ApiProperty({
    example: IncidentExample['Last Name'],
  })
  @Expose()
  'Last Name': string;

  @ApiProperty({
    example: IncidentExample['Medical Exam Required'],
  })
  @Expose()
  'Medical Exam Required': string;

  @ApiProperty({
    example: IncidentExample['Method'],
  })
  @Expose()
  'Method': string;

  @ApiProperty({
    example: IncidentExample['Nature Of Call'],
  })
  @Expose()
  'Nature Of Call': string;

  @ApiProperty({
    example: IncidentExample['Pcc Summary'],
  })
  @Expose()
  'Pcc Summary': string;

  @ApiProperty({
    example: IncidentExample['Police Force'],
  })
  @Expose()
  'Police Force': string;

  @ApiProperty({
    example: IncidentExample['Police Investigation'],
  })
  @Expose()
  'Police Investigation': string;

  @ApiProperty({
    example: IncidentExample['Police Notified Date'],
  })
  @Expose()
  'Police Notified Date': string;

  @ApiProperty({
    example: IncidentExample['Police Report Number'],
  })
  @Expose()
  'Police Report Number': string;

  @ApiProperty({
    example: IncidentExample['Preferred Contact Method'],
  })
  @Expose()
  'Preferred Contact Method': string;

  @ApiProperty({
    example: IncidentExample['Protection Response'],
  })
  @Expose()
  'Protection Response': string;

  @ApiProperty({
    example: IncidentExample['Referral Date'],
  })
  @Expose()
  'Referral Date': string;

  @ApiProperty({
    example: IncidentExample['Resolution'],
  })
  @Expose()
  Resolution: string;

  @ApiProperty({
    example: IncidentExample['Response Priority'],
  })
  @Expose()
  'Response Priority': string;

  @ApiProperty({
    example: IncidentExample['Restricted Flag'],
  })
  @Expose()
  'Restricted Flag': string;

  @ApiProperty({
    example: IncidentExample['Row Id'],
  })
  @Expose()
  'Row Id': string;

  @ApiProperty({
    example: IncidentExample['Service Office'],
  })
  @Expose()
  'Service Office': string;

  @ApiProperty({
    example: IncidentExample['Status'],
  })
  @Expose()
  Status: string;

  @ApiProperty({
    example: IncidentExample['Type'],
  })
  @Expose()
  Type: string;

  @ApiProperty({
    example: IncidentExample['Type Of Caller'],
  })
  @Expose()
  'Type Of Caller': string;

  @ApiProperty({
    example: IncidentExample['Updated By Id'],
  })
  @Expose()
  [updatedByIdFieldName]: string;

  @ApiProperty({
    example: IncidentExample['Updated By'],
  })
  @Expose()
  [updatedByFieldName]: string;

  @ApiProperty({
    example: IncidentExample['Updated Date'],
  })
  @Expose()
  [updatedDateFieldName]: string;

  constructor(object) {
    Object.assign(this, object);
  }
}
