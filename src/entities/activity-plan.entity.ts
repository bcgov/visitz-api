import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

/*
 * Examples
 */
export const ActivityPlanSingleResponseCaseExample = {
  Id: 'Id Here',
  'Activity SR Id': '',
  'Activity UID': 'Id Here',
  'Case #': 'Case Number Here',
  'Case Id': 'Case Id Here',
  'Case Type': 'Case Type Here',
  Comments: 'Comments Here',
  'Completed Date': '01/01/1970 00:00:00',
  'Created By First Name': 'First Name Here',
  'Created By Middle Name': 'Middle Name Here',
  'Created By Last Name': 'Last Name Here',
  'Created By Name': 'Created By Name Here',
  'Created By Login': 'IDIR Here',
  'ICM Created By Office': 'Created By Office Here',
  'ICM Created By Office Id': 'Created By Office Id Here',
  'ICP #': '',
  'ICP Id': '',
  'Incident #': '',
  'Incident Id': '',
  Numero: '',
  'Opportunity Id': '',
  'Order Id': '',
  'Program Id': '',
  'Project Id': '',
  'Restricted Flag': 'N',
  'SR Number': '',
  'SR Sub Type': '',
  'SR Type': '',
  'Shared Flag': 'N',
  Status: 'Status Here',
  Template: 'Template Here',
  'Template Flag': 'Y',
  'Template Id': 'Template Id Here',
};

export const ActivityPlanSingleResponseIncidentExample = {
  ...ActivityPlanSingleResponseCaseExample,
  'Case #': '',
  'Case Id': '',
  'Case Type': '',
  'Incident #': 'Incident Number Here',
  'Incident Id': 'Incident Id Here',
};

export const ActivityPlanSingleResponseSRExample = {
  ...ActivityPlanSingleResponseCaseExample,
  'Case #': '',
  'Case Id': '',
  'Case Type': '',
  'Activity SR Id': 'SR Id Here',
  'SR Number': 'SR Number Here',
  'SR Sub Type': 'SR Sub Type Here',
  'SR Type': 'SR Type Here',
};

export const ActivityPlanSingleResponseMemoExample = {
  ...ActivityPlanSingleResponseCaseExample,
  'Case #': '',
  'Case Id': '',
  'Case Type': '',
  'ICP #': 'Memo Number Here',
  'ICP Id': 'Memo Id Here',
};

export const ActivityPlanListResponseCaseExample = {
  items: [
    {
      ...ActivityPlanSingleResponseCaseExample,
      Id: 'Another Id Here',
      'Activity UID': 'Another Id Here',
    },
    ActivityPlanSingleResponseCaseExample,
  ],
};

export const ActivityPlanListResponseIncidentExample = {
  items: [
    {
      ...ActivityPlanSingleResponseIncidentExample,
      Id: 'Another Id Here',
      'Activity UID': 'Another Id Here',
    },
    ActivityPlanSingleResponseIncidentExample,
  ],
};

export const ActivityPlanListResponseSRExample = {
  items: [
    {
      ...ActivityPlanSingleResponseSRExample,
      Id: 'Another Id Here',
      'Activity UID': 'Another Id Here',
    },
    ActivityPlanSingleResponseSRExample,
  ],
};

export const ActivityPlanListResponseMemoExample = {
  items: [
    {
      ...ActivityPlanSingleResponseMemoExample,
      Id: 'Another Id Here',
      'Activity UID': 'Another Id Here',
    },
    ActivityPlanSingleResponseMemoExample,
  ],
};

export const PostActivityPlanResponseCaseExample = {
  ...ActivityPlanSingleResponseCaseExample,
};

export const PostActivityPlanResponseIncidentExample = {
  ...ActivityPlanSingleResponseIncidentExample,
};

export const PostActivityPlanResponseSRExample = {
  ...ActivityPlanSingleResponseSRExample,
};

export const PostActivityPlanResponseMemoExample = {
  ...ActivityPlanSingleResponseMemoExample,
};

/*
 * Model definitions
 */
@Exclude()
@ApiSchema({ name: 'ActivityPlan' })
export class ActivityPlanEntity {
  @ApiProperty({
    example: ActivityPlanSingleResponseCaseExample['Id'],
  })
  @Expose()
  'Id': string;

  @ApiProperty({
    example: ActivityPlanSingleResponseSRExample['Activity SR Id'],
  })
  @Expose()
  'Activity SR Id': string;

  @ApiProperty({
    example: ActivityPlanSingleResponseCaseExample['Activity UID'],
  })
  @Expose()
  'Activity UID': string;

  @ApiProperty({
    example: ActivityPlanSingleResponseCaseExample['Case #'],
  })
  @Expose()
  'Case #': string;

  @ApiProperty({
    example: ActivityPlanSingleResponseCaseExample['Case Id'],
  })
  @Expose()
  'Case Id': string;

  @ApiProperty({
    example: ActivityPlanSingleResponseCaseExample['Case Type'],
  })
  @Expose()
  'Case Type': string;

  @ApiProperty({
    example: ActivityPlanSingleResponseCaseExample['Comments'],
  })
  @Expose()
  'Comments': string;

  @ApiProperty({
    example: ActivityPlanSingleResponseCaseExample['Completed Date'],
  })
  @Expose()
  'Completed Date': string;

  @ApiProperty({
    example: ActivityPlanSingleResponseCaseExample['Created By First Name'],
  })
  @Expose()
  'Created By First Name': string;

  @ApiProperty({
    example: ActivityPlanSingleResponseCaseExample['Created By Middle Name'],
  })
  @Expose()
  'Created By Middle Name': string;

  @ApiProperty({
    example: ActivityPlanSingleResponseCaseExample['Created By Last Name'],
  })
  @Expose()
  'Created By Last Name': string;

  @ApiProperty({
    example: ActivityPlanSingleResponseCaseExample['Created By Name'],
  })
  @Expose()
  'Created By Name': string;

  @ApiProperty({
    example: ActivityPlanSingleResponseCaseExample['Created By Login'],
  })
  @Expose()
  'Created By Login': string;

  @ApiProperty({
    example: ActivityPlanSingleResponseCaseExample['ICM Created By Office'],
  })
  @Expose()
  'ICM Created By Office': string;

  @ApiProperty({
    example: ActivityPlanSingleResponseCaseExample['ICM Created By Office Id'],
  })
  @Expose()
  'ICM Created By Office Id': string;

  @ApiProperty({
    example: ActivityPlanSingleResponseMemoExample['ICP #'],
  })
  @Expose()
  'ICP #': string;

  @ApiProperty({
    example: ActivityPlanSingleResponseMemoExample['ICP Id'],
  })
  @Expose()
  'ICP Id': string;

  @ApiProperty({
    example: ActivityPlanSingleResponseIncidentExample['Incident #'],
  })
  @Expose()
  'Incident #': string;

  @ApiProperty({
    example: ActivityPlanSingleResponseIncidentExample['Incident Id'],
  })
  @Expose()
  'Incident Id': string;

  @ApiProperty({
    example: ActivityPlanSingleResponseCaseExample['Numero'],
  })
  @Expose()
  'Numero': string;

  @ApiProperty({
    example: ActivityPlanSingleResponseCaseExample['Opportunity Id'],
  })
  @Expose()
  'Opportunity Id': string;

  @ApiProperty({
    example: ActivityPlanSingleResponseCaseExample['Order Id'],
  })
  @Expose()
  'Order Id': string;

  @ApiProperty({
    example: ActivityPlanSingleResponseCaseExample['Program Id'],
  })
  @Expose()
  'Program Id': string;

  @ApiProperty({
    example: ActivityPlanSingleResponseCaseExample['Project Id'],
  })
  @Expose()
  'Project Id': string;

  @ApiProperty({
    example: ActivityPlanSingleResponseCaseExample['Restricted Flag'],
  })
  @Expose()
  'Restricted Flag': string;

  @ApiProperty({
    example: ActivityPlanSingleResponseSRExample['SR Number'],
  })
  @Expose()
  'SR Number': string;

  @ApiProperty({
    example: ActivityPlanSingleResponseSRExample['SR Sub Type'],
  })
  @Expose()
  'SR Sub Type': string;

  @ApiProperty({
    example: ActivityPlanSingleResponseSRExample['SR Type'],
  })
  @Expose()
  'SR Type': string;

  @ApiProperty({
    example: ActivityPlanSingleResponseCaseExample['Shared Flag'],
  })
  @Expose()
  'Shared Flag': string;

  @ApiProperty({
    example: ActivityPlanSingleResponseCaseExample['Status'],
  })
  @Expose()
  'Status': string;

  @ApiProperty({
    example: ActivityPlanSingleResponseCaseExample['Template'],
  })
  @Expose()
  'Template': string;

  @ApiProperty({
    example: ActivityPlanSingleResponseCaseExample['Template Flag'],
  })
  @Expose()
  'Template Flag': string;

  @ApiProperty({
    example: ActivityPlanSingleResponseCaseExample['Template Id'],
  })
  @Expose()
  'Template Id': string;

  constructor(partial: Partial<ActivityPlanEntity>) {
    Object.assign(this, partial);
  }
}

@Exclude()
@ApiSchema({ name: 'ActivityPlanResponse' })
export class NestedActivityPlanEntity {
  @Expose()
  @ApiProperty({ type: ActivityPlanEntity, isArray: true })
  @Type(() => ActivityPlanEntity)
  items: Array<ActivityPlanEntity>;

  constructor(object) {
    Object.assign(this, object);
  }
}
