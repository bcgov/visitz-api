// TODO: Add actual field names once they are changed. Not putting in them now since most will change anyway

import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

/*
 * Examples
 */
export const SafetyAssessmentSingleResponseIncidentExample = {
  Id: 'Row-Id-Here',
  'Incident Id': 'Incident-Row-Id-Here',
  'Updated Date': '01/01/1970 00:00:00',
};

export const SafetyAssessmentListResponseIncidentExample = {
  items: [
    SafetyAssessmentSingleResponseIncidentExample,
    {
      ...SafetyAssessmentSingleResponseIncidentExample,
      Id: 'Another-Row-Id-Here',
    },
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
    example: SafetyAssessmentSingleResponseIncidentExample['Incident Id'],
  })
  @Expose()
  'Incident Id': string;

  @ApiProperty({
    example: SafetyAssessmentSingleResponseIncidentExample['Updated Date'],
  })
  @Expose()
  'Updated Date': string;

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
}
