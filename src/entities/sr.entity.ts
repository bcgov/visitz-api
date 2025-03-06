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
  [createdByFieldName]: 'Creator IDIR Here',
  [createdByIdFieldName]: 'Creator Row Id Here',
  'Created By Office': 'Creation Office Here',
  [createdDateFieldName]: '01/01/1970 00:00:00',
  'Given Names': 'First Names',
  'Home Phone': '123-456-7890',
  Id: 'Id Here',
  'Indigenous Authority': 'Authority Here',
  'Integration Id': 'Id Here',
  Kkcfs: 'N',
  'Last Name': 'Last Name',
  Method: '',
  'Nature Of Call': '',
  'Pcc Summary': 'Summary Here',
  'Preferred Contact Method': 'Phone',
  Priority: 'Priority Here',
  'Referral Date': '01/01/1970 00:00:00',
  Resolution: '',
  'Restricted Flag': 'N',
  'Row Id': 'Id Here',
  'Service Office': 'Service Office Here',
  'Service Request Number': 'SR Number Here',
  Status: 'Open',
  Type: 'Type Here',
  'Type Of Caller': '',
  [updatedByFieldName]: '01/01/1970 00:00:00',
  [updatedByIdFieldName]: '01/01/1970 00:00:00',
  [updatedDateFieldName]: '01/01/1970 00:00:00',
};

@Exclude()
@ApiSchema({ name: 'SR' })
export class SREntity {
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
    example: SRExample['Address'],
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
  [createdByFieldName]: string;

  @ApiProperty({
    example: SRExample['Created By Id'],
  })
  @Expose()
  [createdByIdFieldName]: string;

  @ApiProperty({
    example: SRExample['Created By Office'],
  })
  @Expose()
  'Created By Office': string;

  @ApiProperty({
    example: SRExample['Created Date'],
  })
  @Expose()
  [createdDateFieldName]: string;

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
    example: SRExample['Id'],
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
    example: SRExample['Kkcfs'],
  })
  @Expose()
  Kkcfs: string;

  @ApiProperty({
    example: SRExample['Last Name'],
  })
  @Expose()
  'Last Name': string;

  @ApiProperty({
    example: SRExample['Method'],
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
    example: SRExample['Priority'],
  })
  @Expose()
  Priority: string;

  @ApiProperty({
    example: SRExample['Referral Date'],
  })
  @Expose()
  'Referral Date': string;

  @ApiProperty({
    example: SRExample['Resolution'],
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
    example: SRExample['Status'],
  })
  @Expose()
  Status: string;

  @ApiProperty({
    example: SRExample['Type'],
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
  [updatedByFieldName]: string;

  @ApiProperty({
    example: SRExample['Updated By Id'],
  })
  @Expose()
  [updatedByIdFieldName]: string;

  @ApiProperty({
    example: SRExample['Updated Date'],
  })
  @Expose()
  [updatedDateFieldName]: string;

  constructor(object) {
    Object.assign(this, object);
  }
}
