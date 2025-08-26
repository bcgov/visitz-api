import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
/*
 * Examples
 */
export const SubmitSafetyAssessmentResponseExample = {
  Status: 'Status Here',
  'Error Code': 'Error Code Here',

  'Error Message': 'Error Message Here',
};

/*
 * Model definitions
 */
@Exclude()
export class SubmitSafetyAssessmentWorkflowEntity {
  @ApiProperty({
    example: SubmitSafetyAssessmentResponseExample['Status'],
  })
  @Expose()
  'Status': string;

  @ApiProperty({
    example: SubmitSafetyAssessmentResponseExample['Error Code'],
  })
  @Expose()
  'Error Code': string;

  @ApiProperty({
    example: SubmitSafetyAssessmentResponseExample['Error Message'],
  })
  @Expose()
  'Error Message': string;

  constructor(partial: Partial<SubmitSafetyAssessmentWorkflowEntity>) {
    Object.assign(this, partial);
  }
}
