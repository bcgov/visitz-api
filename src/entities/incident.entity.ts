import { ApiSchema, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import {
  createdByFieldName,
  createdByIdFieldName,
  createdDateFieldName,
  updatedByFieldName,
  updatedByIdFieldName,
  updatedDateFieldName,
} from '../common/constants/upstream-constants';

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
  [createdByFieldName]: 'Creator IDIR Here',
  [createdByIdFieldName]: 'Creator Row Id Here',
  'Created By Office': 'Creation Office Here',
  [createdDateFieldName]: '01/01/1970 00:00:00',
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
  [updatedByIdFieldName]: 'Updater Row Id Here',
  [updatedByFieldName]: 'Updater IDIR Here',
  [updatedDateFieldName]: '01/01/1970 00:00:00',
};

@Exclude()
@ApiSchema({ name: 'Incident' })
export class IncidentEntity {
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
    example: IncidentExample['Assigned To Id'],
  })
  @Expose()
  'Assigned To Id': string;

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
