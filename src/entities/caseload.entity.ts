import { HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

// TODO: Add actual examples
/*
 * Examples
 */
const IncidentExample = {
  Id: 'Id Here',
  'Activity UID': 'Id Here',
  'After Hours Flag': 'N',
  'Contact First Name': 'First Name',
  'Contact Middle Name': '',
  'Contact Last Name': 'Last Name',
  Description: '',
  Display: 'Calendar and Activities',
  'ICM Service Region': 'Region',
  'ICM Service Region Code': 'Region',
  'Incident City': '',
  'Incident Location': '',
  'Incident Postal Code': '',
  'Incident Sub Type': '',
  'Incident Type': 'Child Protection',
  'Integration Error Description': '',
  'Integration State': '',
  Location: '',
  Name: '',
  Organization: 'MCFD',
  'Owned By': 'Idir Here',
  'Primary Suspect Id': '',
  Priority: '3 - Standard',
  Resolution: '',
  'Response Time': '5 Days',
  'Restricted Flag': 'N',
  'Row Status Old': 'Y',
  'Service Office': 'Office',
  'Source Id': '',
  'Suppress Calendar': 'N',
  'System Asgn Flag': 'N',
  'Template Flag': 'N',
  Status: 'Open',
  'Sub Status': '',
  'Sub Sub Type': '',
  'Created By Login': 'Idir Here',
  'Date Created': '01/01/1970 00:00:00',
  'Date Occurred': '01/01/1970 00:00:00',
  'Date Reported': '01/01/1970 00:00:00',
  Planned: '01/01/1970 00:00:00',
  'Date Closed': '',
  'Days Open': '600',
  'Last Updated': '01/01/1970 00:00:00',
  'Last Updated Login': 'Id Here',
};

const CaseExample = {
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
    example: IncidentExample['Activity UID'],
  })
  @Expose()
  'Activity UID': string;

  @ApiProperty({
    example: IncidentExample['After Hours Flag'],
  })
  @Expose()
  'After Hours Flag': string;

  @ApiProperty({
    example: IncidentExample['Contact First Name'],
  })
  @Expose()
  'Contact First Name': string;

  @ApiProperty({
    example: IncidentExample['Contact Last Name'],
  })
  @Expose()
  'Contact Last Name': string;

  @ApiProperty({
    example: IncidentExample['Contact Middle Name'],
  })
  @Expose()
  'Contact Middle Name': string;

  @ApiProperty({
    example: IncidentExample['Created By Login'],
  })
  @Expose()
  'Created By Login': string;

  @ApiProperty({
    example: IncidentExample['Date Closed'],
  })
  @Expose()
  'Date Closed': string;

  @ApiProperty({
    example: IncidentExample['Date Created'],
  })
  @Expose()
  'Date Created': string;

  @ApiProperty({
    example: IncidentExample['Date Occurred'],
  })
  @Expose()
  'Date Occurred': string;

  @ApiProperty({
    example: IncidentExample['Date Reported'],
  })
  @Expose()
  'Date Reported': string;

  @ApiProperty({
    example: IncidentExample['Days Open'],
  })
  @Expose()
  'Days Open': string;

  @ApiProperty({
    example: IncidentExample['Description'],
  })
  @Expose()
  'Description': string;

  @ApiProperty({
    example: IncidentExample['Display'],
  })
  @Expose()
  'Display': string;

  @ApiProperty({
    example: IncidentExample['ICM Service Region'],
  })
  @Expose()
  'ICM Service Region': string;

  @ApiProperty({
    example: IncidentExample['ICM Service Region Code'],
  })
  @Expose()
  'ICM Service Region Code': string;

  @ApiProperty({
    example: IncidentExample['Id'],
  })
  @Expose()
  'Id': string;

  @ApiProperty({
    example: IncidentExample['Incident City'],
  })
  @Expose()
  'Incident City': string;

  @ApiProperty({
    example: IncidentExample['Incident Location'],
  })
  @Expose()
  'Incident Location': string;

  @ApiProperty({
    example: IncidentExample['Incident Postal Code'],
  })
  @Expose()
  'Incident Postal Code': string;

  @ApiProperty({
    example: IncidentExample['Incident Sub Type'],
  })
  @Expose()
  'Incident Sub Type': string;

  @ApiProperty({
    example: IncidentExample['Incident Type'],
  })
  @Expose()
  'Incident Type': string;

  @ApiProperty({
    example: IncidentExample['Integration Error Description'],
  })
  @Expose()
  'Integration Error Description': string;

  @ApiProperty({
    example: IncidentExample['Integration State'],
  })
  @Expose()
  'Integration State': string;

  @ApiProperty({
    example: IncidentExample['Last Updated'],
  })
  @Expose()
  'Last Updated': string;

  @ApiProperty({
    example: IncidentExample['Last Updated Login'],
  })
  @Expose()
  'Last Updated Login': string;

  @ApiProperty({
    example: IncidentExample['Location'],
  })
  @Expose()
  'Location': string;

  @ApiProperty({
    example: IncidentExample['Name'],
  })
  @Expose()
  'Name': string;

  @ApiProperty({
    example: IncidentExample['Organization'],
  })
  @Expose()
  'Organization': string;

  @ApiProperty({
    example: IncidentExample['Owned By'],
  })
  @Expose()
  'Owned By': string;

  @ApiProperty({
    example: IncidentExample['Planned'],
  })
  @Expose()
  'Planned': string;

  @ApiProperty({
    example: IncidentExample['Primary Suspect Id'],
  })
  @Expose()
  'Primary Suspect Id': string;

  @ApiProperty({
    example: IncidentExample['Priority'],
  })
  @Expose()
  'Priority': string;

  @ApiProperty({
    example: IncidentExample['Resolution'],
  })
  @Expose()
  'Resolution': string;

  @ApiProperty({
    example: IncidentExample['Response Time'],
  })
  @Expose()
  'Response Time': string;

  @ApiProperty({
    example: IncidentExample['Restricted Flag'],
  })
  @Expose()
  'Restricted Flag': string;

  @ApiProperty({
    example: IncidentExample['Row Status Old'],
  })
  @Expose()
  'Row Status Old': string;

  @ApiProperty({
    example: IncidentExample['Service Office'],
  })
  @Expose()
  'Service Office': string;

  @ApiProperty({
    example: IncidentExample['Source Id'],
  })
  @Expose()
  'Source Id': string;

  @ApiProperty({
    example: IncidentExample['Status'],
  })
  @Expose()
  'Status': string;

  @ApiProperty({
    example: IncidentExample['Sub Status'],
  })
  @Expose()
  'Sub Status': string;

  @ApiProperty({
    example: IncidentExample['Sub Sub Type'],
  })
  @Expose()
  'Sub Sub Type': string;

  @ApiProperty({
    example: IncidentExample['Suppress Calendar'],
  })
  @Expose()
  'Suppress Calendar': string;

  @ApiProperty({
    example: IncidentExample['System Asgn Flag'],
  })
  @Expose()
  'System Asgn Flag': string;

  @ApiProperty({
    example: IncidentExample['Template Flag'],
  })
  @Expose()
  'Template Flag': string;

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
@ApiSchema({ name: 'CasesOrganizer' })
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
@ApiSchema({ name: 'CaseloadResponse' })
export class CaseloadEntity {
  @Expose()
  cases: CasesOrganizerEntity;

  @Expose()
  incidents: IncidentsOrganizerEntity;

  constructor(object) {
    Object.assign(this, object);
  }
}
