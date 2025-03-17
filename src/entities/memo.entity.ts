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

export const MemoExample = {
  'Additional Information': '',
  Address: 'Address Here',
  'Address Comments': 'Address Comments Here',
  'Are Any Of The Family Members Indigenous': 'N',
  'Assigned To': 'Assignee IDIR Here',
  'Assigned To Id': 'Assignee IDIR Row Id Here',
  'Call Date': '01/01/1970 00:00:00',
  'Call Information': '',
  'Call Time': '00:00:00',
  'Caller Address': 'Caller Address Here',
  'Caller Email': 'sample@example.com',
  'Caller Name': 'Caller Name Here',
  'Caller Phone': '123-456-7890',
  'Cell Phone': '123-456-7890',
  'Closed Date': '01/01/1970 00:00:00',
  [createdByFieldName]: 'Creator IDIR Here',
  [createdByIdFieldName]: 'Creator Row Id Here',
  'Created By Office': 'Creation Office Here',
  [createdDateFieldName]: '01/01/1970 00:00:00',
  'Given Names': 'First Names',
  'Home Phone': '123-456-7890',
  Id: 'Row Id Here',
  Kkcfs: 'KKCFS flag',
  'Last Name': 'Last Names',
  'Medical Exam Required': 'N',
  'Memo Number': 'Memo Number Here',
  'Memo Type': '',
  Method: '',
  'Narrative Locked By': '',
  'Nature Of Call': '',
  'Pcc Summary': 'Summary Here',
  'Police Force': '',
  'Police Investigation': '',
  'Police Notified Date': '01/01/1970 00:00:00',
  'Police Report Number': 'Report Number Here',
  'Police Report': '',
  'Preferred Contact Method': 'Phone',
  'Recorded By': '',
  Resolution: '',
  'Restricted Flag': 'N',
  'Row Id': 'Id Here',
  'Service Office': 'Office Here',
  Status: 'Open',
  'Type Of Caller': '',
  [updatedByFieldName]: '01/01/1970 00:00:00',
  [updatedByIdFieldName]: '01/01/1970 00:00:00',
  [updatedDateFieldName]: '01/01/1970 00:00:00',
  Urgent: 'N',
};

@Exclude()
@ApiSchema({ name: 'Memo' })
export class MemoEntity {
  @ApiProperty({
    example: MemoExample['Additional Information'],
  })
  @Expose()
  'Additional Information': string;

  @ApiProperty({
    example: MemoExample['Address'],
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
  [createdByFieldName]: string;

  @ApiProperty({
    example: MemoExample['Created By Id'],
  })
  @Expose()
  [createdByIdFieldName]: string;

  @ApiProperty({
    example: MemoExample['Created By Office'],
  })
  @Expose()
  'Created By Office': string;

  @ApiProperty({
    example: MemoExample['Created Date'],
  })
  @Expose()
  [createdDateFieldName]: string;

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
    example: MemoExample['Id'],
  })
  @Expose()
  Id: string;

  @ApiProperty({
    example: MemoExample['Kkcfs'],
  })
  @Expose()
  Kkcfs: string;

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
    example: MemoExample['Method'],
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
    example: MemoExample['Police Report Number'],
  })
  @Expose()
  'Police Report Number': string;

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
    example: MemoExample['Resolution'],
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
    example: MemoExample['Status'],
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
  [updatedByFieldName]: string;

  @ApiProperty({
    example: MemoExample['Updated By Id'],
  })
  @Expose()
  [updatedByIdFieldName]: string;

  @ApiProperty({
    example: MemoExample['Updated Date'],
  })
  @Expose()
  [updatedDateFieldName]: string;

  @ApiProperty({
    example: MemoExample['Urgent'],
  })
  @Expose()
  'Urgent': string;

  constructor(object) {
    Object.assign(this, object);
  }
}
