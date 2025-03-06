import { ApiSchema, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

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

@Exclude()
@ApiSchema({ name: 'Case' })
export class CaseEntity {
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
