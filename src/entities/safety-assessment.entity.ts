// TODO: Add actual field names once they are changed. Not putting in them now since most will change anyway

import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

/*
 * Examples
 */
export const SafetyAssessmentSingleResponseIncidentExample = {
  'Approved By': 'Approved By Here',
  'Approved Date': 'Approved Date Here',
  'Approved To Finalize': 'Approved To Finalize Here',
  'Approved To Finalize Date': 'Approved To Finalize Date Here',
  'Approved To Finalize DS': 'Approved To Finalize DS Here',
  'Child Contact Id': 'Child Contact Id Here',
  'Created By': 'Created By Here',
  'Created By Id': 'Created By Id Here',
  'Created Date': 'Created Date Here',
  'Data Steward Role': 'Data Steward Role Here',
  'Date Of Assessment': 'Date Of Assessment Here',
  'Factor Influence 1': 'Factor Influence 1 Here',
  'Factor Influence 2': 'Factor Influence 2 Here',
  'Factor Influence 3': 'Factor Influence 3 Here',
  'Factor Influence 4': 'Factor Influence 4 Here',
  'Factor Influence 5': 'Factor Influence 5 Here',
  'Family Name': 'Family Name Here',
  'Finalized Date': 'Finalized Date Here',
  Id: 'Id Here',
  'Protective Capacity 01': 'Protective Capacity 01 Here',
  'Protective Capacity 02': 'Protective Capacity 02 Here',
  'Protective Capacity 03': 'Protective Capacity 03 Here',
  'Protective Capacity 04': 'Protective Capacity 04 Here',
  'Protective Capacity 05': 'Protective Capacity 05 Here',
  'Protective Capacity 06': 'Protective Capacity 06 Here',
  'Protective Capacity 07': 'Protective Capacity 07 Here',
  'Protective Capacity 08': 'Protective Capacity 08 Here',
  'Protective Capacity 09': 'Protective Capacity 09 Here',
  'Protective Capacity 10': 'Protective Capacity 10 Here',
  'Protective Capacity 11': 'Protective Capacity 11 Here',
  'Protective Capacity 12': 'Protective Capacity 12 Here',
  'Protective Capacity 12 Other': 'Protective Capacity 12 Other Here',
  'Protective Capacity Observations': 'Protective Capacity Observations Here',
  'Ready To Finalize': 'Ready To Finalize Here',
  'Ready To Finalize Date': 'Ready To Finalize Date Here',
  'Row Id': 'Row Id Here',
  'Safety Decision Intervention': 'Safety Decision Intervention Here',
  'Safety Decision Narrative': 'Safety Decision Narrative Here',
  'Safety Decision Safe': 'Safety Decision Safe Here',
  'Safety Decision Safety Plan': 'Safety Decision Safety Plan Here',
  'Safety Decision Unsafe': 'Safety Decision Unsafe Here',
  'Safety Decision Unsafe Choice': 'Safety Decision Unsafe Choice Here',
  'Safety Decision Unsafe Choice Description':
    'Safety Decision Unsafe Choice Description Here',
  'Safety Factor 01': 'Safety Factor 01 Here',
  'Safety Factor 01 Comment': 'Safety Factor 01 Comment Here',
  'Safety Factor 01A': 'Safety Factor 01A Here',
  'Safety Factor 01B': 'Safety Factor 01B Here',
  'Safety Factor 01C': 'Safety Factor 01C Here',
  'Safety Factor 01D': 'Safety Factor 01D Here',
  'Safety Factor 01E': 'Safety Factor 01E Here',
  'Safety Factor 02': 'Safety Factor 02 Here',
  'Safety Factor 02 Comment': 'Safety Factor 02 Comment Here',
  'Safety Factor 03': 'Safety Factor 03 Here',
  'Safety Factor 03 Comment': 'Safety Factor 03 Comment Here',
  'Safety Factor 04': 'Safety Factor 04 Here',
  'Safety Factor 04 Comment': 'Safety Factor 04 Comment Here',
  'Safety Factor 05': 'Safety Factor 05 Here',
  'Safety Factor 05 Comment': 'Safety Factor 05 Comment Here',
  'Safety Factor 06': 'Safety Factor 06 Here',
  'Safety Factor 06 Comment': 'Safety Factor 06 Comment Here',
  'Safety Factor 07': 'Safety Factor 07 Here',
  'Safety Factor 07 Comment': 'Safety Factor 07 Comment Here',
  'Safety Factor 08': 'Safety Factor 08 Here',
  'Safety Factor 08 Comment': 'Safety Factor 08 Comment Here',
  'Safety Factor 09': 'Safety Factor 09 Here',
  'Safety Factor 09 Comment': 'Safety Factor 09 Comment Here',
  'Safety Factor 10': 'Safety Factor 10 Here',
  'Safety Factor 10 Comment': 'Safety Factor 10 Comment Here',
  'Safety Factor 11': 'Safety Factor 11 Here',
  'Safety Factor 11 Comment': 'Safety Factor 11 Comment Here',
  'Safety Factor 12': 'Safety Factor 12 Here',
  'Safety Factor 12 Comment': 'Safety Factor 12 Comment Here',
  'Safety Factor 13': 'Safety Factor 13 Here',
  'Safety Factor 13 Comment': 'Safety Factor 13 Comment Here',
  'Safety Factor 14': 'Safety Factor 14 Here',
  'Safety Factor 14 Comment': 'Safety Factor 14 Comment Here',
  'Safety Intervention 01': 'Safety Intervention 01 Here',
  'Safety Intervention 02': 'Safety Intervention 02 Here',
  'Safety Intervention 03': 'Safety Intervention 03 Here',
  'Safety Intervention 04': 'Safety Intervention 04 Here',
  'Safety Intervention 05': 'Safety Intervention 05 Here',
  'Safety Intervention 06': 'Safety Intervention 06 Here',
  'Safety Intervention 07': 'Safety Intervention 07 Here',
  'Safety Intervention 08': 'Safety Intervention 08 Here',
  'Safety Intervention 08 Other': 'Safety Intervention 08 Other Here',
  'Safety Intervention 09': 'Safety Intervention 09 Here',
  'Safety Intervention 10': 'Safety Intervention 10 Here',
  'Social Worker First Name': 'Social Worker First Name Here',
  'Social Worker Id': 'Social Worker Id Here',
  'Social Worker Last Name': 'Social Worker Last Name Here',
  'Team Leader First Name': 'Team Leader First Name Here',
  'Team Leader Id': 'Team Leader Id Here',
  'Team Leader Last Name': 'Team Leader Last Name Here',
  'Team Leader Login Name': 'Team Leader Login Name Here',
  Type: 'Type Here',
  'Updated By': 'Updated By Here',
  'Updated By Id': 'Updated By Id Here',
  'Updated Date': 'Updated Date Here',
};

export const SafetyAssessmentListResponseIncidentExample = {
  Id: 'Row-Id-Here',
  'ICM Incident SafetyAssessment BC': [
    SafetyAssessmentSingleResponseIncidentExample,
  ],
};

/*
 * Model definitions
 */
@Exclude()
@ApiSchema({ name: 'SafetyAssessment' })
export class SafetyAssessmentEntity {
  @ApiProperty({
    example: SafetyAssessmentSingleResponseIncidentExample['Id'],
  })
  @Expose()
  Id: string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample[
        'ICM Incident SafetyAssessment BC'
      ],
  })
  @Expose()
  'ICM Incident SafetyAssessment BC': Array<NestedSafetyAssessmentEntity>;

  constructor(object) {
    Object.assign(this, object);
  }
}

@Exclude()
@ApiSchema({ name: 'SafetyAssessmentResponse' })
export class NestedSafetyAssessmentEntity {
  @Expose()
  @ApiProperty({ type: SafetyAssessmentEntity, isArray: true })
  @Type(() => SafetyAssessmentEntity)
  items: Array<SafetyAssessmentEntity>;

  constructor(object) {
    Object.assign(this, object);
  }

  @ApiProperty({
    example: SafetyAssessmentSingleResponseIncidentExample['Approved By'],
  })
  @Expose()
  'Approved By': string;

  @ApiProperty({
    example: SafetyAssessmentSingleResponseIncidentExample['Approved Date'],
  })
  @Expose()
  'Approved Date': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Approved To Finalize'],
  })
  @Expose()
  'Approved To Finalize': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample[
        'Approved To Finalize Date'
      ],
  })
  @Expose()
  'Approved To Finalize Date': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Approved To Finalize DS'],
  })
  @Expose()
  'Approved To Finalize DS': string;

  @ApiProperty({
    example: SafetyAssessmentSingleResponseIncidentExample['Child Contact Id'],
  })
  @Expose()
  'Child Contact Id': string;

  @ApiProperty({
    example: SafetyAssessmentSingleResponseIncidentExample['Created By'],
  })
  @Expose()
  'Created By': string;

  @ApiProperty({
    example: SafetyAssessmentSingleResponseIncidentExample['Created By Id'],
  })
  @Expose()
  'Created By Id': string;

  @ApiProperty({
    example: SafetyAssessmentSingleResponseIncidentExample['Created Date'],
  })
  @Expose()
  'Created Date': string;

  @ApiProperty({
    example: SafetyAssessmentSingleResponseIncidentExample['Data Steward Role'],
  })
  @Expose()
  'Data Steward Role': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Date Of Assessment'],
  })
  @Expose()
  'Date Of Assessment': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Factor Influence 1'],
  })
  @Expose()
  'Factor Influence 1': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Factor Influence 2'],
  })
  @Expose()
  'Factor Influence 2': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Factor Influence 3'],
  })
  @Expose()
  'Factor Influence 3': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Factor Influence 4'],
  })
  @Expose()
  'Factor Influence 4': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Factor Influence 5'],
  })
  @Expose()
  'Factor Influence 5': string;

  @ApiProperty({
    example: SafetyAssessmentSingleResponseIncidentExample['Family Name'],
  })
  @Expose()
  'Family Name': string;

  @ApiProperty({
    example: SafetyAssessmentSingleResponseIncidentExample['Finalized Date'],
  })
  @Expose()
  'Finalized Date': string;

  @ApiProperty({
    example: SafetyAssessmentSingleResponseIncidentExample['Id'],
  })
  @Expose()
  Id: string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Protective Capacity 01'],
  })
  @Expose()
  'Protective Capacity 01': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Protective Capacity 02'],
  })
  @Expose()
  'Protective Capacity 02': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Protective Capacity 03'],
  })
  @Expose()
  'Protective Capacity 03': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Protective Capacity 04'],
  })
  @Expose()
  'Protective Capacity 04': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Protective Capacity 05'],
  })
  @Expose()
  'Protective Capacity 05': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Protective Capacity 06'],
  })
  @Expose()
  'Protective Capacity 06': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Protective Capacity 07'],
  })
  @Expose()
  'Protective Capacity 07': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Protective Capacity 08'],
  })
  @Expose()
  'Protective Capacity 08': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Protective Capacity 09'],
  })
  @Expose()
  'Protective Capacity 09': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Protective Capacity 10'],
  })
  @Expose()
  'Protective Capacity 10': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Protective Capacity 11'],
  })
  @Expose()
  'Protective Capacity 11': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Protective Capacity 12'],
  })
  @Expose()
  'Protective Capacity 12': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample[
        'Protective Capacity 12 Other'
      ],
  })
  @Expose()
  'Protective Capacity 12 Other': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample[
        'Protective Capacity Observations'
      ],
  })
  @Expose()
  'Protective Capacity Observations': string;

  @ApiProperty({
    example: SafetyAssessmentSingleResponseIncidentExample['Ready To Finalize'],
  })
  @Expose()
  'Ready To Finalize': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Ready To Finalize Date'],
  })
  @Expose()
  'Ready To Finalize Date': string;

  @ApiProperty({
    example: SafetyAssessmentSingleResponseIncidentExample['Row Id'],
  })
  @Expose()
  'Row Id': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample[
        'Safety Decision Intervention'
      ],
  })
  @Expose()
  'Safety Decision Intervention': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample[
        'Safety Decision Narrative'
      ],
  })
  @Expose()
  'Safety Decision Narrative': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Safety Decision Safe'],
  })
  @Expose()
  'Safety Decision Safe': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample[
        'Safety Decision Safety Plan'
      ],
  })
  @Expose()
  'Safety Decision Safety Plan': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Safety Decision Unsafe'],
  })
  @Expose()
  'Safety Decision Unsafe': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample[
        'Safety Decision Unsafe Choice'
      ],
  })
  @Expose()
  'Safety Decision Unsafe Choice': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample[
        'Safety Decision Unsafe Choice Description'
      ],
  })
  @Expose()
  'Safety Decision Unsafe Choice Description': string;

  @ApiProperty({
    example: SafetyAssessmentSingleResponseIncidentExample['Safety Factor 01'],
  })
  @Expose()
  'Safety Factor 01': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Safety Factor 01 Comment'],
  })
  @Expose()
  'Safety Factor 01 Comment': string;

  @ApiProperty({
    example: SafetyAssessmentSingleResponseIncidentExample['Safety Factor 01A'],
  })
  @Expose()
  'Safety Factor 01A': string;

  @ApiProperty({
    example: SafetyAssessmentSingleResponseIncidentExample['Safety Factor 01B'],
  })
  @Expose()
  'Safety Factor 01B': string;

  @ApiProperty({
    example: SafetyAssessmentSingleResponseIncidentExample['Safety Factor 01C'],
  })
  @Expose()
  'Safety Factor 01C': string;

  @ApiProperty({
    example: SafetyAssessmentSingleResponseIncidentExample['Safety Factor 01D'],
  })
  @Expose()
  'Safety Factor 01D': string;

  @ApiProperty({
    example: SafetyAssessmentSingleResponseIncidentExample['Safety Factor 01E'],
  })
  @Expose()
  'Safety Factor 01E': string;

  @ApiProperty({
    example: SafetyAssessmentSingleResponseIncidentExample['Safety Factor 02'],
  })
  @Expose()
  'Safety Factor 02': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Safety Factor 02 Comment'],
  })
  @Expose()
  'Safety Factor 02 Comment': string;

  @ApiProperty({
    example: SafetyAssessmentSingleResponseIncidentExample['Safety Factor 03'],
  })
  @Expose()
  'Safety Factor 03': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Safety Factor 03 Comment'],
  })
  @Expose()
  'Safety Factor 03 Comment': string;

  @ApiProperty({
    example: SafetyAssessmentSingleResponseIncidentExample['Safety Factor 04'],
  })
  @Expose()
  'Safety Factor 04': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Safety Factor 04 Comment'],
  })
  @Expose()
  'Safety Factor 04 Comment': string;

  @ApiProperty({
    example: SafetyAssessmentSingleResponseIncidentExample['Safety Factor 05'],
  })
  @Expose()
  'Safety Factor 05': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Safety Factor 05 Comment'],
  })
  @Expose()
  'Safety Factor 05 Comment': string;

  @ApiProperty({
    example: SafetyAssessmentSingleResponseIncidentExample['Safety Factor 06'],
  })
  @Expose()
  'Safety Factor 06': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Safety Factor 06 Comment'],
  })
  @Expose()
  'Safety Factor 06 Comment': string;

  @ApiProperty({
    example: SafetyAssessmentSingleResponseIncidentExample['Safety Factor 07'],
  })
  @Expose()
  'Safety Factor 07': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Safety Factor 07 Comment'],
  })
  @Expose()
  'Safety Factor 07 Comment': string;

  @ApiProperty({
    example: SafetyAssessmentSingleResponseIncidentExample['Safety Factor 08'],
  })
  @Expose()
  'Safety Factor 08': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Safety Factor 08 Comment'],
  })
  @Expose()
  'Safety Factor 08 Comment': string;

  @ApiProperty({
    example: SafetyAssessmentSingleResponseIncidentExample['Safety Factor 09'],
  })
  @Expose()
  'Safety Factor 09': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Safety Factor 09 Comment'],
  })
  @Expose()
  'Safety Factor 09 Comment': string;

  @ApiProperty({
    example: SafetyAssessmentSingleResponseIncidentExample['Safety Factor 10'],
  })
  @Expose()
  'Safety Factor 10': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Safety Factor 10 Comment'],
  })
  @Expose()
  'Safety Factor 10 Comment': string;

  @ApiProperty({
    example: SafetyAssessmentSingleResponseIncidentExample['Safety Factor 11'],
  })
  @Expose()
  'Safety Factor 11': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Safety Factor 11 Comment'],
  })
  @Expose()
  'Safety Factor 11 Comment': string;

  @ApiProperty({
    example: SafetyAssessmentSingleResponseIncidentExample['Safety Factor 12'],
  })
  @Expose()
  'Safety Factor 12': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Safety Factor 12 Comment'],
  })
  @Expose()
  'Safety Factor 12 Comment': string;

  @ApiProperty({
    example: SafetyAssessmentSingleResponseIncidentExample['Safety Factor 13'],
  })
  @Expose()
  'Safety Factor 13': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Safety Factor 13 Comment'],
  })
  @Expose()
  'Safety Factor 13 Comment': string;

  @ApiProperty({
    example: SafetyAssessmentSingleResponseIncidentExample['Safety Factor 14'],
  })
  @Expose()
  'Safety Factor 14': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Safety Factor 14 Comment'],
  })
  @Expose()
  'Safety Factor 14 Comment': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Safety Intervention 01'],
  })
  @Expose()
  'Safety Intervention 01': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Safety Intervention 02'],
  })
  @Expose()
  'Safety Intervention 02': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Safety Intervention 03'],
  })
  @Expose()
  'Safety Intervention 03': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Safety Intervention 04'],
  })
  @Expose()
  'Safety Intervention 04': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Safety Intervention 05'],
  })
  @Expose()
  'Safety Intervention 05': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Safety Intervention 06'],
  })
  @Expose()
  'Safety Intervention 06': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Safety Intervention 07'],
  })
  @Expose()
  'Safety Intervention 07': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Safety Intervention 08'],
  })
  @Expose()
  'Safety Intervention 08': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample[
        'Safety Intervention 08 Other'
      ],
  })
  @Expose()
  'Safety Intervention 08 Other': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Safety Intervention 09'],
  })
  @Expose()
  'Safety Intervention 09': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Safety Intervention 10'],
  })
  @Expose()
  'Safety Intervention 10': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Social Worker First Name'],
  })
  @Expose()
  'Social Worker First Name': string;

  @ApiProperty({
    example: SafetyAssessmentSingleResponseIncidentExample['Social Worker Id'],
  })
  @Expose()
  'Social Worker Id': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Social Worker Last Name'],
  })
  @Expose()
  'Social Worker Last Name': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Team Leader First Name'],
  })
  @Expose()
  'Team Leader First Name': string;

  @ApiProperty({
    example: SafetyAssessmentSingleResponseIncidentExample['Team Leader Id'],
  })
  @Expose()
  'Team Leader Id': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Team Leader Last Name'],
  })
  @Expose()
  'Team Leader Last Name': string;

  @ApiProperty({
    example:
      SafetyAssessmentSingleResponseIncidentExample['Team Leader Login Name'],
  })
  @Expose()
  'Team Leader Login Name': string;

  @ApiProperty({
    example: SafetyAssessmentSingleResponseIncidentExample['Type'],
  })
  @Expose()
  Type: string;

  @ApiProperty({
    example: SafetyAssessmentSingleResponseIncidentExample['Updated By'],
  })
  @Expose()
  'Updated By': string;

  @ApiProperty({
    example: SafetyAssessmentSingleResponseIncidentExample['Updated By Id'],
  })
  @Expose()
  'Updated By Id': string;

  @ApiProperty({
    example: SafetyAssessmentSingleResponseIncidentExample['Updated Date'],
  })
  @Expose()
  'Updated Date': string;
}
