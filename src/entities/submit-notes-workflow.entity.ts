import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
/*
 * Examples
 */
export const SubmitNotesResponseExample = {
  Status: 'Status Here',
  'Error Code': 'Error Code Here',
  NoteId: 'Id Here',
  'Error Message': 'Error Message Here',
};

/*
 * Model definitions
 */
@Exclude()
export class SubmitNotesWorkflowEntity {
  @ApiProperty({
    example: SubmitNotesResponseExample['Status'],
  })
  @Expose()
  'Status': string;

  @ApiProperty({
    example: SubmitNotesResponseExample['Error Code'],
  })
  @Expose()
  'Error Code': string;

  @ApiProperty({
    example: SubmitNotesResponseExample['NoteId'],
  })
  @Expose()
  NoteId: string;

  @ApiProperty({
    example: SubmitNotesResponseExample['Error Message'],
  })
  @Expose()
  'Error Message': string;

  constructor(partial: Partial<SubmitNotesWorkflowEntity>) {
    Object.assign(this, partial);
  }
}
