import { HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

/*
 * Examples
 */
export const CaseExample = {
  Id: 'Id Here',
  'Row Id': 'Id Here',
  'Case Num': 'Id Here',
  'Legacy File Number': 'File Number Here',
  Name: 'LAST NAME, FIRST NAME',
  'Middle Name': '',
  'Subject Contact First Name': 'First Name',
  'Subject Contact Last Name': 'Last name',
  Type: 'Child Services',
  Status: 'Open',
  'Assigned To': 'Idir Here',
  'Assigned To Id': 'Id Here',
  Caseload: 'BGH',
  'Office Name': 'Office Name',
  Organization: 'Org Name',
  'Region Name': 'Region Flag',
  'Restricted Flag': 'N',
  'Work Queue': '',
  'Early Open Reason': '',
  'Integration State': 'Synced',
  'MyFS Flag': 'N',
  'Renew Review Date': '',
  'Close Reason': '',
  'Closed Date': '',
  'Reopened Date': '',
  'Created By': 'Idir Here',
  'Created By Id': 'Id Here',
  'Created Date': '01/01/1970 00:00:00',
  'Updated By': 'Idir Here',
  'Updated By Id': 'Id Here',
  'Last Updated Date': '01/01/1970 00:00:00',
  'Updated Date': '01/01/1970 00:00:00',
};

export const IncidentExample = {
  'Acceptance Date': '01/01/1970 00:00:00',
  'Additional Information': 'Additional Details',
  Address: 'Address Here',
  'Address Comments': 'Address Comments Here',
  'Are Any Of The Family Members Indigenous': 'N',
  'Assigned To': 'Assignee IDIR Here',
  'Assigned To Id': 'Assignee IDIR Row Id Here',
  'Call Information': 'Call Info Here',
  Caseload: '',
  'Cell Phone': '123-456-7890',
  'Closed Date': '01/01/1970 00:00:00',
  'Created By Id': 'Creator Row Id Here',
  'Created By Office': 'Creation Office Here',
  'Created By': 'Creator IDIR Here',
  'Created Date': '01/01/1970 00:00:00',
  'Date Reported': '01/01/1970 00:00:00',
  'Given Names': 'First Names',
  'Home Phone': '123-456-7890',
  Id: 'Id Here',
  'Incident Number': 'Incident Number Here',
  'Indigenous Authority': '',
  'Last Name': 'Last Name',
  'Pcc Summary': 'Summary Here',
  'Protection Response': '',
  'Referral Date': '01/01/1970 00:00:00',
  Resolution: '',
  'Response Priority': ' ',
  'Row Id': 'Id Here',
  'Service Office': 'Office Here',
  Status: 'Open',
  Type: 'Type Of Incident',
  'Updated By Id': 'Updater Row Id Here',
  'Updated By': 'Updater IDIR Here',
  'Updated Date': '01/01/1970 00:00:00',
};

export const SRExample = {
  'Acceptance Date': '01/01/1970 00:00:00',
  'Additional Information': '',
  Address: 'Address Here',
  'Address Comments': 'Address Comments Here',
  'Are Any Of The Family Members Indigenous': 'N',
  'Assigned To': 'Assignee IDIR Here',
  'Assigned To Id': 'Assignee IDIR Row Id Here',
  'Call Date': '01/01/1970 00:00:00',
  'Call Information': 'Call Info Here',
  'Caller Address': 'Caller Address Here',
  'Caller Email': 'Caller Email Here',
  'Caller Name': 'Caller Name Here',
  'Caller Phone': 'Caller Info Here',
  'Cell Phone': '123-456-7890',
  'Closed Date': '01/01/1970 00:00:00',
  'Created By': '',
  'Created By Id': '',
  'Created By Office': '',
  'Created Date': '01/01/1970 00:00:00',
  'Given Names': '',
  'Home Phone': '123-456-7890',
  Id: 'Id Here',
  'Indigenous Authority': '',
  'Integration Id': '',
  Kkcfs: '',
  'Last Name': '',
  Method: '',
  'Nature Of Call': '',
  'Pcc Summary': '',
  'Preferred Contact Method': '',
  Priority: '',
  'Referral Date': '01/01/1970 00:00:00',
  Resolution: '',
  'Restricted Flag': 'N',
  'Row Id': 'Id Here',
  'Service Office': '',
  'Service Request Number': '',
  Status: 'Open',
  Type: '',
  'Type Of Caller': '',
  'Updated By': '01/01/1970 00:00:00',
  'Updated By Id': '01/01/1970 00:00:00',
  'Updated Date': '01/01/1970 00:00:00',
};

export const MemoExample = {
  'Additional Information': '',
  Address: '',
  'Address Comments': '',
  'Are Any Of The Family Members Indigenous': '',
  'Assigned To': '',
  'Assigned To Id': '',
  'Call Date': '01/01/1970 00:00:00',
  'Call Information': '',
  'Call Time': '',
  'Caller Address': '',
  'Caller Email': '',
  'Caller Name': '',
  'Caller Phone': '123-456-7890',
  'Cell Phone': '123-456-7890',
  'Closed Date': '01/01/1970 00:00:00',
  'Created By': '',
  'Created By Id': '',
  'Created By Office': '',
  'Created Date': '01/01/1970 00:00:00',
  'Given Names': '',
  'Home Phone': '123-456-7890',
  Id: '',
  'Last Name': '',
  'Medical Exam Required': '',
  'Memo Number': '',
  'Memo Type': '',
  Method: '',
  'Narrative Locked By': '',
  'Nature Of Call': '',
  'Pcc Summary': '',
  'Police Force': '',
  'Police Investigation': '',
  'Police Notified Date': '01/01/1970 00:00:00',
  'Police Report': '',
  'Preferred Contact Method': '',
  'Recorded By': '',
  Resolution: '',
  'Restricted Flag': 'N',
  'Row Id': 'Id Here',
  'Service Office': 'Office Here',
  Status: '',
  'Type Of Caller': '',
  'Updated By': '01/01/1970 00:00:00',
  'Updated By Id': '01/01/1970 00:00:00',
  'Updated Date': '01/01/1970 00:00:00',
  'Urgent ': 'N',
};

export const CaseloadCompleteResponseExample = {
  cases: {
    assignedIds: [CaseExample['Id']],
    status: 200,
    items: [CaseExample],
  },
  incidents: {
    assignedIds: [IncidentExample['Id']],
    status: 200,
    items: [IncidentExample],
  },
};

export const CaseloadLaterDateResponseExample = {
  cases: {
    assignedIds: [CaseExample['Id']],
    status: 200,
    items: [{ ...CaseExample, 'Last Updated Date': '01/01/2025 00:00:00' }],
  },
  incidents: {
    assignedIds: [IncidentExample['Id']],
    status: 200,
    items: [IncidentExample],
  },
};

export const CaseloadEmptyArrayResponseExample = {
  cases: {
    assignedIds: [],
    status: 204,
    message: {
      ERROR: 'There is no data for the requested resource',
    },
  },
  incidents: {
    assignedIds: [],
    status: 204,
    message: {
      ERROR: 'There is no data for the requested resource',
    },
  },
};

/*
 * Model definitions
 */
@Exclude()
@ApiSchema({ name: 'Case' })
class CaseEntity {
  @ApiProperty({
    example: CaseExample['Id'],
  })
  @Expose()
  'Id': string;

  @ApiProperty({
    example: CaseExample['Row Id'],
  })
  @Expose()
  'Row Id': string;

  @ApiProperty({
    example: CaseExample['Case Num'],
  })
  @Expose()
  'Case Num': string;

  @ApiProperty({
    example: CaseExample['Legacy File Number'],
  })
  @Expose()
  'Legacy File Number': string;

  @ApiProperty({
    example: CaseExample['Name'],
  })
  @Expose()
  'Name': string;

  @ApiProperty({
    example: CaseExample['Middle Name'],
  })
  @Expose()
  'Middle Name': string;

  @ApiProperty({
    example: CaseExample['Subject Contact First Name'],
  })
  @Expose()
  'Subject Contact First Name': string;

  @ApiProperty({
    example: CaseExample['Subject Contact Last Name'],
  })
  @Expose()
  'Subject Contact Last Name': string;

  @ApiProperty({
    example: CaseExample['Type'],
  })
  @Expose()
  'Type': string;

  @ApiProperty({
    example: CaseExample['Status'],
  })
  @Expose()
  'Status': string;

  @ApiProperty({
    example: CaseExample['Assigned To'],
  })
  @Expose()
  'Assigned To': string;

  @ApiProperty({
    example: CaseExample['Assigned To Id'],
  })
  @Expose()
  'Assigned To Id': string;

  @ApiProperty({
    example: CaseExample['Caseload'],
  })
  @Expose()
  'Caseload': string;

  @ApiProperty({
    example: CaseExample['Office Name'],
  })
  @Expose()
  'Office Name': string;

  @ApiProperty({
    example: CaseExample['Organization'],
  })
  @Expose()
  'Organization': string;

  @ApiProperty({
    example: CaseExample['Region Name'],
  })
  @Expose()
  'Region Name': string;

  @ApiProperty({
    example: CaseExample['Restricted Flag'],
  })
  @Expose()
  'Restricted Flag': string;

  @ApiProperty({
    example: CaseExample['Work Queue'],
  })
  @Expose()
  'Work Queue': string;

  @ApiProperty({
    example: CaseExample['Early Open Reason'],
  })
  @Expose()
  'Early Open Reason': string;

  @ApiProperty({
    example: CaseExample['Integration State'],
  })
  @Expose()
  'Integration State': string;

  @ApiProperty({
    example: CaseExample['MyFS Flag'],
  })
  @Expose()
  'MyFS Flag': string;

  @ApiProperty({
    example: CaseExample['Renew Review Date'],
  })
  @Expose()
  'Renew Review Date': string;

  @ApiProperty({
    example: CaseExample['Close Reason'],
  })
  @Expose()
  'Close Reason': string;

  @ApiProperty({
    example: CaseExample['Closed Date'],
  })
  @Expose()
  'Closed Date': string;

  @ApiProperty({
    example: CaseExample['Reopened Date'],
  })
  @Expose()
  'Reopened Date': string;

  @ApiProperty({
    example: CaseExample['Created By'],
  })
  @Expose()
  'Created By': string;

  @ApiProperty({
    example: CaseExample['Created By Id'],
  })
  @Expose()
  'Created By Id': string;

  @ApiProperty({
    example: CaseExample['Created Date'],
  })
  @Expose()
  'Created Date': string;

  @ApiProperty({
    example: CaseExample['Updated By'],
  })
  @Expose()
  'Updated By': string;

  @ApiProperty({
    example: CaseExample['Updated By Id'],
  })
  @Expose()
  'Updated By Id': string;

  @ApiProperty({
    example: CaseExample['Last Updated Date'],
  })
  @Expose()
  'Last Updated Date': string;

  @ApiProperty({
    example: CaseExample['Updated Date'],
  })
  @Expose()
  'Updated Date': string;

  constructor(object) {
    Object.assign(this, object);
  }
}

@Exclude()
@ApiSchema({ name: 'Incident' })
class IncidentEntity {
  @ApiProperty({
    example: IncidentExample['Acceptance Date'],
  })
  @Expose()
  'Acceptance Date': string;

  @ApiProperty({
    example: IncidentExample['Additional Information'],
  })
  @Expose()
  'Additional Information': string;

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
    example: IncidentExample['Call Information'],
  })
  @Expose()
  'Call Information': string;

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
    example: IncidentExample['Created By Id'],
  })
  @Expose()
  'Created By Id': string;

  @ApiProperty({
    example: IncidentExample['Created By Office'],
  })
  @Expose()
  'Created By Office': string;

  @ApiProperty({
    example: IncidentExample['Created By'],
  })
  @Expose()
  'Created By': string;

  @ApiProperty({
    example: IncidentExample['Created Date'],
  })
  @Expose()
  'Created Date': string;

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
    example: IncidentExample['Last Name'],
  })
  @Expose()
  'Last Name': string;

  @ApiProperty({
    example: IncidentExample['Pcc Summary'],
  })
  @Expose()
  'Pcc Summary': string;

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
    example: IncidentExample['Updated By Id'],
  })
  @Expose()
  'Updated By Id': string;

  @ApiProperty({
    example: IncidentExample['Updated By'],
  })
  @Expose()
  'Updated By': string;

  @ApiProperty({
    example: IncidentExample['Updated Date'],
  })
  @Expose()
  'Updated Date': string;

  constructor(object) {
    Object.assign(this, object);
  }
}

@Exclude()
@ApiSchema({ name: 'SR' })
class SREntity {
  @ApiProperty({
    example: SRExample['Acceptance Date'],
  })
  @Expose()
  'Acceptance Date': string;

  @ApiProperty({
    example: SRExample['Additional Information'],
  })
  @Expose()
  'Additional Information': string;

  @ApiProperty({
    example: SRExample['  Address'],
  })
  @Expose()
  Address: string;

  @ApiProperty({
    example: SRExample['Address Comments'],
  })
  @Expose()
  'Address Comments': string;

  @ApiProperty({
    example: SRExample['Are Any Of The Family Members Indigenous'],
  })
  @Expose()
  'Are Any Of The Family Members Indigenous': string;

  @ApiProperty({
    example: SRExample['Assigned To'],
  })
  @Expose()
  'Assigned To': string;

  @ApiProperty({
    example: SRExample['Assigned To Id'],
  })
  @Expose()
  'Assigned To Id': string;

  @ApiProperty({
    example: SRExample['Call Date'],
  })
  @Expose()
  'Call Date': string;

  @ApiProperty({
    example: SRExample['Call Information'],
  })
  @Expose()
  'Call Information': string;

  @ApiProperty({
    example: SRExample['Caller Address'],
  })
  @Expose()
  'Caller Address': string;

  @ApiProperty({
    example: SRExample['Caller Email'],
  })
  @Expose()
  'Caller Email': string;

  @ApiProperty({
    example: SRExample['Caller Name'],
  })
  @Expose()
  'Caller Name': string;

  @ApiProperty({
    example: SRExample['Caller Phone'],
  })
  @Expose()
  'Caller Phone': string;

  @ApiProperty({
    example: SRExample['Cell Phone'],
  })
  @Expose()
  'Cell Phone': string;

  @ApiProperty({
    example: SRExample['Closed Date'],
  })
  @Expose()
  'Closed Date': string;

  @ApiProperty({
    example: SRExample['Created By'],
  })
  @Expose()
  'Created By': string;

  @ApiProperty({
    example: SRExample['Created By Id'],
  })
  @Expose()
  'Created By Id': string;

  @ApiProperty({
    example: SRExample['Created By Office'],
  })
  @Expose()
  'Created By Office': string;

  @ApiProperty({
    example: SRExample['Created Date'],
  })
  @Expose()
  'Created Date': string;

  @ApiProperty({
    example: SRExample['Given Names'],
  })
  @Expose()
  'Given Names': string;

  @ApiProperty({
    example: SRExample['Home Phone'],
  })
  @Expose()
  'Home Phone': string;

  @ApiProperty({
    example: SRExample['  Id'],
  })
  @Expose()
  Id: string;

  @ApiProperty({
    example: SRExample['Indigenous Authority'],
  })
  @Expose()
  'Indigenous Authority': string;

  @ApiProperty({
    example: SRExample['Integration Id'],
  })
  @Expose()
  'Integration Id': string;

  @ApiProperty({
    example: SRExample['  Kkcfs'],
  })
  @Expose()
  Kkcfs: string;

  @ApiProperty({
    example: SRExample['Last Name'],
  })
  @Expose()
  'Last Name': string;

  @ApiProperty({
    example: SRExample['  Method'],
  })
  @Expose()
  Method: string;

  @ApiProperty({
    example: SRExample['Nature Of Call'],
  })
  @Expose()
  'Nature Of Call': string;

  @ApiProperty({
    example: SRExample['Pcc Summary'],
  })
  @Expose()
  'Pcc Summary': string;

  @ApiProperty({
    example: SRExample['Preferred Contact Method'],
  })
  @Expose()
  'Preferred Contact Method': string;

  @ApiProperty({
    example: SRExample['  Priority'],
  })
  @Expose()
  Priority: string;

  @ApiProperty({
    example: SRExample['Referral Date'],
  })
  @Expose()
  'Referral Date': string;

  @ApiProperty({
    example: SRExample['  Resolution'],
  })
  @Expose()
  Resolution: string;

  @ApiProperty({
    example: SRExample['Restricted Flag'],
  })
  @Expose()
  'Restricted Flag': string;

  @ApiProperty({
    example: SRExample['Row Id'],
  })
  @Expose()
  'Row Id': string;

  @ApiProperty({
    example: SRExample['Service Office'],
  })
  @Expose()
  'Service Office': string;

  @ApiProperty({
    example: SRExample['Service Request Number'],
  })
  @Expose()
  'Service Request Number': string;

  @ApiProperty({
    example: SRExample['  Status'],
  })
  @Expose()
  Status: string;

  @ApiProperty({
    example: SRExample['  Type'],
  })
  @Expose()
  Type: string;

  @ApiProperty({
    example: SRExample['Type Of Caller'],
  })
  @Expose()
  'Type Of Caller': string;

  @ApiProperty({
    example: SRExample['Updated By'],
  })
  @Expose()
  'Updated By': string;

  @ApiProperty({
    example: SRExample['Updated By Id'],
  })
  @Expose()
  'Updated By Id': string;

  @ApiProperty({
    example: SRExample['Updated Date'],
  })
  @Expose()
  'Updated Date': string;

  constructor(object) {
    Object.assign(this, object);
  }
}

@Exclude()
@ApiSchema({ name: 'Memo' })
class MemoEntity {
  @ApiProperty({
    example: MemoExample['Additional Information'],
  })
  @Expose()
  'Additional Information': string;

  @ApiProperty({
    example: MemoExample['  Address'],
  })
  @Expose()
  Address: string;

  @ApiProperty({
    example: MemoExample['Address Comments'],
  })
  @Expose()
  'Address Comments': string;

  @ApiProperty({
    example: MemoExample['Are Any Of The Family Members Indigenous'],
  })
  @Expose()
  'Are Any Of The Family Members Indigenous': string;

  @ApiProperty({
    example: MemoExample['Assigned To'],
  })
  @Expose()
  'Assigned To': string;

  @ApiProperty({
    example: MemoExample['Assigned To Id'],
  })
  @Expose()
  'Assigned To Id': string;

  @ApiProperty({
    example: MemoExample['Call Date'],
  })
  @Expose()
  'Call Date': string;

  @ApiProperty({
    example: MemoExample['Call Information'],
  })
  @Expose()
  'Call Information': string;

  @ApiProperty({
    example: MemoExample['Call Time'],
  })
  @Expose()
  'Call Time': string;

  @ApiProperty({
    example: MemoExample['Caller Address'],
  })
  @Expose()
  'Caller Address': string;

  @ApiProperty({
    example: MemoExample['Caller Email'],
  })
  @Expose()
  'Caller Email': string;

  @ApiProperty({
    example: MemoExample['Caller Name'],
  })
  @Expose()
  'Caller Name': string;

  @ApiProperty({
    example: MemoExample['Caller Phone'],
  })
  @Expose()
  'Caller Phone': string;

  @ApiProperty({
    example: MemoExample['Cell Phone'],
  })
  @Expose()
  'Cell Phone': string;

  @ApiProperty({
    example: MemoExample['Closed Date'],
  })
  @Expose()
  'Closed Date': string;

  @ApiProperty({
    example: MemoExample['Created By'],
  })
  @Expose()
  'Created By': string;

  @ApiProperty({
    example: MemoExample['Created By Id'],
  })
  @Expose()
  'Created By Id': string;

  @ApiProperty({
    example: MemoExample['Created By Office'],
  })
  @Expose()
  'Created By Office': string;

  @ApiProperty({
    example: MemoExample['Created Date'],
  })
  @Expose()
  'Created Date': string;

  @ApiProperty({
    example: MemoExample['Given Names'],
  })
  @Expose()
  'Given Names': string;

  @ApiProperty({
    example: MemoExample['Home Phone'],
  })
  @Expose()
  'Home Phone': string;

  @ApiProperty({
    example: MemoExample['  Id'],
  })
  @Expose()
  Id: string;

  @ApiProperty({
    example: MemoExample['Last Name'],
  })
  @Expose()
  'Last Name': string;

  @ApiProperty({
    example: MemoExample['Medical Exam Required'],
  })
  @Expose()
  'Medical Exam Required': string;

  @ApiProperty({
    example: MemoExample['Memo Number'],
  })
  @Expose()
  'Memo Number': string;

  @ApiProperty({
    example: MemoExample['Memo Type'],
  })
  @Expose()
  'Memo Type': string;

  @ApiProperty({
    example: MemoExample['  Method'],
  })
  @Expose()
  Method: string;

  @ApiProperty({
    example: MemoExample['Narrative Locked By'],
  })
  @Expose()
  'Narrative Locked By': string;

  @ApiProperty({
    example: MemoExample['Nature Of Call'],
  })
  @Expose()
  'Nature Of Call': string;

  @ApiProperty({
    example: MemoExample['Pcc Summary'],
  })
  @Expose()
  'Pcc Summary': string;

  @ApiProperty({
    example: MemoExample['Police Force'],
  })
  @Expose()
  'Police Force': string;

  @ApiProperty({
    example: MemoExample['Police Investigation'],
  })
  @Expose()
  'Police Investigation': string;

  @ApiProperty({
    example: MemoExample['Police Notified Date'],
  })
  @Expose()
  'Police Notified Date': string;

  @ApiProperty({
    example: MemoExample['Police Report'],
  })
  @Expose()
  'Police Report': string;

  @ApiProperty({
    example: MemoExample['Preferred Contact Method'],
  })
  @Expose()
  'Preferred Contact Method': string;

  @ApiProperty({
    example: MemoExample['Recorded By'],
  })
  @Expose()
  'Recorded By': string;

  @ApiProperty({
    example: MemoExample['  Resolution'],
  })
  @Expose()
  Resolution: string;

  @ApiProperty({
    example: MemoExample['Restricted Flag'],
  })
  @Expose()
  'Restricted Flag': string;

  @ApiProperty({
    example: MemoExample['Row Id'],
  })
  @Expose()
  'Row Id': string;

  @ApiProperty({
    example: MemoExample['Service Office'],
  })
  @Expose()
  'Service Office': string;

  @ApiProperty({
    example: MemoExample['  Status'],
  })
  @Expose()
  Status: string;

  @ApiProperty({
    example: MemoExample['Type Of Caller'],
  })
  @Expose()
  'Type Of Caller': string;

  @ApiProperty({
    example: MemoExample['Updated By'],
  })
  @Expose()
  'Updated By': string;

  @ApiProperty({
    example: MemoExample['Updated By Id'],
  })
  @Expose()
  'Updated By Id': string;

  @ApiProperty({
    example: MemoExample['Updated Date'],
  })
  @Expose()
  'Updated Date': string;

  @ApiProperty({
    example: MemoExample['Urgent '],
  })
  @Expose()
  'Urgent ': string;

  constructor(object) {
    Object.assign(this, object);
  }
}

@Exclude()
@ApiSchema({ name: 'GenericRecordOrganizer' })
class GenericRecordEntity {
  @Expose()
  @ApiProperty({
    example: ['example here'],
    isArray: true,
    type: 'string',
  })
  assignedIds: Array<string>;

  @Expose()
  @ApiProperty({
    example: 25,
    default: HttpStatus.OK,
    format: 'integer',
    description: `The HTTP status of this upstream call.`,
  })
  status: number = 200;

  @Expose()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  message?: object;

  constructor(object) {
    Object.assign(this, object);
  }
}

@Exclude()
@ApiSchema({ name: 'CasesOrganizer' })
class CasesOrganizerEntity extends GenericRecordEntity {
  @Expose()
  @IsOptional()
  @ApiProperty({ isArray: true, type: CaseEntity, required: false })
  @Type(() => CaseEntity)
  items?: Array<CaseEntity>;

  constructor(object) {
    super(object);
    Object.assign(this, object);
  }
}

@Exclude()
@ApiSchema({ name: 'IncidentsOrganizer' })
class IncidentsOrganizerEntity extends GenericRecordEntity {
  @Expose()
  @IsOptional()
  @ApiProperty({ isArray: true, type: IncidentEntity, required: false })
  @Type(() => IncidentEntity)
  items?: Array<IncidentEntity>;

  constructor(object) {
    super(object);
    Object.assign(this, object);
  }
}

@Exclude()
@ApiSchema({ name: 'SRsOrganizer' })
class SROrganizerEntity extends GenericRecordEntity {
  @Expose()
  @IsOptional()
  @ApiProperty({ isArray: true, type: SREntity, required: false })
  @Type(() => SREntity)
  items?: Array<SREntity>;

  constructor(object) {
    super(object);
    Object.assign(this, object);
  }
}

@Exclude()
@ApiSchema({ name: 'MemoOrganizer' })
class MemoOrganizerEntity extends GenericRecordEntity {
  @Expose()
  @IsOptional()
  @ApiProperty({ isArray: true, type: MemoEntity, required: false })
  @Type(() => MemoEntity)
  items?: Array<MemoEntity>;

  constructor(object) {
    super(object);
    Object.assign(this, object);
  }
}

@Exclude()
@ApiSchema({ name: 'CaseloadResponse' })
export class CaseloadEntity {
  @Expose()
  cases: CasesOrganizerEntity;

  @Expose()
  incidents: IncidentsOrganizerEntity;

  @Expose()
  srs: SROrganizerEntity;

  @Expose()
  memos: MemoOrganizerEntity;

  constructor(object) {
    Object.assign(this, object);
  }
}
