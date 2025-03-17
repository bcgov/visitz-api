import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

/*
 * Examples
 */
export const SafetyAssessmentSingleResponseIncidentExample = {
  'Approved By': 'Approved By Here',
  'Approved Date': '01/01/1970 00:00:00',
  'Approved To Finalize': 'Approved To Finalize Here',
  'Approved To Finalize Date': '01/01/1970 00:00:00',
  'Approved To Finalize DS': 'Approved To Finalize DS Here',
  'Child Contact Id': 'Child Contact Id Here',
  'Created By': 'Created By Here',
  'Created By Id': 'Created By Id Here',
  'Created Date': '01/01/1970 00:00:00',
  'Data Steward Role': 'Data Steward Role Here',
  'Date Of Assessment': '01/01/1970 00:00:00',
  'Factor Influence 1': 'N',
  'Factor Influence 2': 'N',
  'Factor Influence 3': 'N',
  'Factor Influence 4': 'N',
  'Factor Influence 5': 'N',
  'Family Name': 'Family Name Here',
  'Finalized Date': '01/01/1970 00:00:00',
  Id: 'Id Here',
  'Protective Capacity 01': 'N',
  'Protective Capacity 02': 'N',
  'Protective Capacity 03': 'N',
  'Protective Capacity 04': 'N',
  'Protective Capacity 05': 'N',
  'Protective Capacity 06': 'N',
  'Protective Capacity 07': 'N',
  'Protective Capacity 08': 'N',
  'Protective Capacity 09': 'N',
  'Protective Capacity 10': 'N',
  'Protective Capacity 11': 'N',
  'Protective Capacity 12': 'N',
  'Protective Capacity 12 Other': 'Protective Capacity 12 Other Here',
  'Protective Capacity Observations': 'Protective Capacity Observations Here',
  'Ready To Finalize': 'Ready To Finalize Here',
  'Ready To Finalize Date': '01/01/1970 00:00:00',
  'Row Id': 'Row Id Here',
  'Safety Decision Intervention': 'Safety Decision Intervention Here',
  'Safety Decision Narrative': 'Safety Decision Narrative Here',
  'Safety Decision Safe': 'Safety Decision Safe Here',
  'Safety Decision Safety Plan': 'Safety Decision Safety Plan Here',
  'Safety Decision Unsafe': 'Safety Decision Unsafe Here',
  'Safety Decision Unsafe Choice': 'Safety Decision Unsafe Choice Here',
  'Safety Decision Unsafe Choice Description':
    'Safety Decision Unsafe Choice Description Here',
  'Safety Factor 01': 'No',
  'Safety Factor 01 Comment': 'Safety Factor 01 Comment Here',
  'Safety Factor 01A': 'N',
  'Safety Factor 01B': 'N',
  'Safety Factor 01C': 'N',
  'Safety Factor 01D': 'N',
  'Safety Factor 01E': 'N',
  'Safety Factor 02': 'No',
  'Safety Factor 02 Comment': 'Safety Factor 02 Comment Here',
  'Safety Factor 03': 'No',
  'Safety Factor 03 Comment': 'Safety Factor 03 Comment Here',
  'Safety Factor 04': 'No',
  'Safety Factor 04 Comment': 'Safety Factor 04 Comment Here',
  'Safety Factor 05': 'No',
  'Safety Factor 05 Comment': 'Safety Factor 05 Comment Here',
  'Safety Factor 06': 'No',
  'Safety Factor 06 Comment': 'Safety Factor 06 Comment Here',
  'Safety Factor 07': 'No',
  'Safety Factor 07 Comment': 'Safety Factor 07 Comment Here',
  'Safety Factor 08': 'No',
  'Safety Factor 08 Comment': 'Safety Factor 08 Comment Here',
  'Safety Factor 09': 'No',
  'Safety Factor 09 Comment': 'Safety Factor 09 Comment Here',
  'Safety Factor 10': 'No',
  'Safety Factor 10 Comment': 'Safety Factor 10 Comment Here',
  'Safety Factor 11': 'No',
  'Safety Factor 11 Comment': 'Safety Factor 11 Comment Here',
  'Safety Factor 12': 'No',
  'Safety Factor 12 Comment': 'Safety Factor 12 Comment Here',
  'Safety Factor 13': 'No',
  'Safety Factor 13 Comment': 'Safety Factor 13 Comment Here',
  'Safety Factor 14': 'No',
  'Safety Factor 14 Comment': 'Safety Factor 14 Comment Here',
  'Safety Intervention 01': 'N',
  'Safety Intervention 02': 'N',
  'Safety Intervention 03': 'N',
  'Safety Intervention 04': 'N',
  'Safety Intervention 05': 'N',
  'Safety Intervention 06': 'N',
  'Safety Intervention 07': 'N',
  'Safety Intervention 08': 'N',
  'Safety Intervention 08 Other': 'Safety Intervention 08 Other Here',
  'Safety Intervention 09': 'N',
  'Safety Intervention 10': 'N',
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
  'Updated Date': '01/01/1970 00:00:00',
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
