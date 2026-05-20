import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

/*
 * Examples
 */

export const ActivitiesSingleResponseCaseExample = {
  Id: 'Id Here',
  'Row Id': 'Id Here',
  'Activity Id': 'Id Here',
  'Activity UID': 'Id Here',
  'Case Id': 'Case Id Here',
  'Case Number': 'Case Number Here',
  'Case Owner': 'Case Owner Here',
  'Case Restricted': 'N',
  'Case Status': 'Case Status Here',
  'Case Type': 'Case Type Here',
  'Incident Id': '',
  'Incident #': '',
  'Activity SR Id': '',
  'SR Number': '',
  'SR Owner': '',
  'SR Sub Type': '',
  'SR Type': '',
  'ICM Memo Id': '',
  'ICM Memo #': '',
  'ICM Memo Owner': '',
  'ICM Memo Restricted': '',
  'ICM Memo Type': '',
  'Primary Contact Id': 'Primary Contact Id Here',
  'Contact First Name': 'First Name Here',
  'Contact Given Name': 'Given Name Here',
  'Contact Middle Name': '',
  'Contact Last Name': 'Last Name Here',
  'Show In Contact Profile': 'N',
  Status: 'Status Here',
  Category: 'General',
  Type: 'Type Here',
  'ICM Type': 'ICM Type Here',
  'ICM Sub Type': 'ICM Sub Type Here',
  Description: 'Description Here',
  'Action By': 'Action By Here',
  'Action Code': '',
  Alarm: 'N',
  'Appt Alarm Time Min': '',
  Delay: '',
  Display: 'Display Here',
  Done: '',
  'Done Flag': 'N',
  Due: '01/01/1970 00:00:00',
  'Duration Minutes': 'Duration Minutes Here',
  'ICM Service Region': 'Service Region Here',
  'Last Updated By Name': 'Last Updated By Name Here',
  MeetingLocation: '',
  Ministry: 'Ministry Here',
  'Ministry Id': 'Ministry Id Here',
  'Notification Status Calc': 'Y',
  Overdue: 'Y',
  'Plan Name': '',
  Planned: '01/01/1970 00:00:00',
  Priority: 'Priority Here',
  Repeating: 'N',
  'Repeating Expires': '',
  'Result Code': '',
  Sequence: '',
  'Service Office': 'Service Office Here',
  'Created By Name': 'Created By Name Here',
  'ICM Created By Office': 'Created By Office Here',
  'Primary Owned By': 'Primary Owner Here',
  'Primary Owner Id': 'Primary Owner Id Here',
};

export const ActivitiesSingleResponseIncidentExample = {
  ...ActivitiesSingleResponseCaseExample,
  'Case Id': '',
  'Case Number': '',
  'Case Owner': '',
  'Case Restricted': '',
  'Case Status': '',
  'Case Type': '',
  'Incident Id': 'Incident Id Here',
  'Incident #': 'Incident Number Here',
};

export const ActivitiesSingleResponseSRExample = {
  ...ActivitiesSingleResponseCaseExample,
  'Case Id': '',
  'Case Number': '',
  'Case Owner': '',
  'Case Restricted': '',
  'Case Status': '',
  'Case Type': '',
  'Activity SR Id': 'SR Id Here',
  'SR Number': 'SR Number Here',
  'SR Owner': 'SR Owner Here',
  'SR Sub Type': 'SR Sub Type Here',
  'SR Type': 'SR Type Here',
};

export const ActivitiesSingleResponseMemoExample = {
  ...ActivitiesSingleResponseCaseExample,
  'Case Id': '',
  'Case Number': '',
  'Case Owner': '',
  'Case Restricted': '',
  'Case Status': '',
  'Case Type': '',
  'ICM Memo Id': 'Memo Id Here',
  'ICM Memo #': 'Memo Number Here',
  'ICM Memo Owner': 'Memo Owner Here',
  'ICM Memo Restricted': 'N',
  'ICM Memo Type': 'Memo Type Here',
};

export const ActivitiesListResponseCaseExample = {
  items: [
    {
      ...ActivitiesSingleResponseCaseExample,
      Id: 'Another Id Here',
      'Row Id': 'Another Id Here',
      'Activity Id': 'Another Id Here',
      'Activity UID': 'Another Id Here',
    },
    ActivitiesSingleResponseCaseExample,
  ],
};

export const ActivitiesListResponseIncidentExample = {
  items: [
    {
      ...ActivitiesSingleResponseIncidentExample,
      Id: 'Another Id Here',
      'Row Id': 'Another Id Here',
      'Activity Id': 'Another Id Here',
      'Activity UID': 'Another Id Here',
    },
    ActivitiesSingleResponseIncidentExample,
  ],
};

export const ActivitiesListResponseSRExample = {
  items: [
    {
      ...ActivitiesSingleResponseSRExample,
      Id: 'Another Id Here',
      'Row Id': 'Another Id Here',
      'Activity Id': 'Another Id Here',
      'Activity UID': 'Another Id Here',
    },
    ActivitiesSingleResponseSRExample,
  ],
};

export const ActivitiesListResponseMemoExample = {
  items: [
    {
      ...ActivitiesSingleResponseMemoExample,
      Id: 'Another Id Here',
      'Row Id': 'Another Id Here',
      'Activity Id': 'Another Id Here',
      'Activity UID': 'Another Id Here',
    },
    ActivitiesSingleResponseMemoExample,
  ],
};

/*
 * Model definitions
 */
@Exclude()
@ApiSchema({ name: 'Activities' })
export class ActivitiesEntity {
  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Id'],
  })
  @Expose()
  'Id': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Row Id'],
  })
  @Expose()
  'Row Id': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Activity Id'],
  })
  @Expose()
  'Activity Id': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Activity UID'],
  })
  @Expose()
  'Activity UID': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Case Id'],
  })
  @Expose()
  'Case Id': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Case Number'],
  })
  @Expose()
  'Case Number': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Case Owner'],
  })
  @Expose()
  'Case Owner': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Case Restricted'],
  })
  @Expose()
  'Case Restricted': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Case Status'],
  })
  @Expose()
  'Case Status': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Case Type'],
  })
  @Expose()
  'Case Type': string;

  @ApiProperty({
    example: ActivitiesSingleResponseIncidentExample['Incident Id'],
  })
  @Expose()
  'Incident Id': string;

  @ApiProperty({
    example: ActivitiesSingleResponseIncidentExample['Incident #'],
  })
  @Expose()
  'Incident #': string;

  @ApiProperty({
    example: ActivitiesSingleResponseSRExample['Activity SR Id'],
  })
  @Expose()
  'Activity SR Id': string;

  @ApiProperty({
    example: ActivitiesSingleResponseSRExample['SR Number'],
  })
  @Expose()
  'SR Number': string;

  @ApiProperty({
    example: ActivitiesSingleResponseSRExample['SR Owner'],
  })
  @Expose()
  'SR Owner': string;

  @ApiProperty({
    example: ActivitiesSingleResponseSRExample['SR Sub Type'],
  })
  @Expose()
  'SR Sub Type': string;

  @ApiProperty({
    example: ActivitiesSingleResponseSRExample['SR Type'],
  })
  @Expose()
  'SR Type': string;

  @ApiProperty({
    example: ActivitiesSingleResponseMemoExample['ICM Memo Id'],
  })
  @Expose()
  'ICM Memo Id': string;

  @ApiProperty({
    example: ActivitiesSingleResponseMemoExample['ICM Memo #'],
  })
  @Expose()
  'ICM Memo #': string;

  @ApiProperty({
    example: ActivitiesSingleResponseMemoExample['ICM Memo Owner'],
  })
  @Expose()
  'ICM Memo Owner': string;

  @ApiProperty({
    example: ActivitiesSingleResponseMemoExample['ICM Memo Restricted'],
  })
  @Expose()
  'ICM Memo Restricted': string;

  @ApiProperty({
    example: ActivitiesSingleResponseMemoExample['ICM Memo Type'],
  })
  @Expose()
  'ICM Memo Type': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Primary Contact Id'],
  })
  @Expose()
  'Primary Contact Id': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Contact First Name'],
  })
  @Expose()
  'Contact First Name': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Contact Given Name'],
  })
  @Expose()
  'Contact Given Name': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Contact Middle Name'],
  })
  @Expose()
  'Contact Middle Name': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Contact Last Name'],
  })
  @Expose()
  'Contact Last Name': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Show In Contact Profile'],
  })
  @Expose()
  'Show In Contact Profile': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Status'],
  })
  @Expose()
  'Status': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Category'],
  })
  @Expose()
  'Category': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Type'],
  })
  @Expose()
  'Type': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['ICM Type'],
  })
  @Expose()
  'ICM Type': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['ICM Sub Type'],
  })
  @Expose()
  'ICM Sub Type': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Description'],
  })
  @Expose()
  'Description': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Action By'],
  })
  @Expose()
  'Action By': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Action Code'],
  })
  @Expose()
  'Action Code': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Alarm'],
  })
  @Expose()
  'Alarm': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Appt Alarm Time Min'],
  })
  @Expose()
  'Appt Alarm Time Min': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Delay'],
  })
  @Expose()
  'Delay': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Display'],
  })
  @Expose()
  'Display': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Done'],
  })
  @Expose()
  'Done': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Done Flag'],
  })
  @Expose()
  'Done Flag': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Due'],
  })
  @Expose()
  'Due': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Duration Minutes'],
  })
  @Expose()
  'Duration Minutes': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['ICM Service Region'],
  })
  @Expose()
  'ICM Service Region': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Last Updated By Name'],
  })
  @Expose()
  'Last Updated By Name': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['MeetingLocation'],
  })
  @Expose()
  'MeetingLocation': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Ministry'],
  })
  @Expose()
  'Ministry': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Ministry Id'],
  })
  @Expose()
  'Ministry Id': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Notification Status Calc'],
  })
  @Expose()
  'Notification Status Calc': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Overdue'],
  })
  @Expose()
  'Overdue': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Plan Name'],
  })
  @Expose()
  'Plan Name': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Planned'],
  })
  @Expose()
  'Planned': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Priority'],
  })
  @Expose()
  'Priority': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Repeating'],
  })
  @Expose()
  'Repeating': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Repeating Expires'],
  })
  @Expose()
  'Repeating Expires': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Result Code'],
  })
  @Expose()
  'Result Code': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Sequence'],
  })
  @Expose()
  'Sequence': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Service Office'],
  })
  @Expose()
  'Service Office': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Created By Name'],
  })
  @Expose()
  'Created By Name': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['ICM Created By Office'],
  })
  @Expose()
  'ICM Created By Office': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Primary Owned By'],
  })
  @Expose()
  'Primary Owned By': string;

  @ApiProperty({
    example: ActivitiesSingleResponseCaseExample['Primary Owner Id'],
  })
  @Expose()
  'Primary Owner Id': string;

  constructor(partial: Partial<ActivitiesEntity>) {
    Object.assign(this, partial);
  }
}

@Exclude()
@ApiSchema({ name: 'ActivitiesResponse' })
export class NestedActivitiesEntity {
  @Expose()
  @ApiProperty({ type: ActivitiesEntity, isArray: true })
  @Type(() => ActivitiesEntity)
  items: Array<ActivitiesEntity>;

  constructor(object) {
    Object.assign(this, object);
  }
}
