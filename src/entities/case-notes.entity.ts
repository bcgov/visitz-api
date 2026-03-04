import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

/*
 * Examples
 */
export const CaseNotesSingleExample = {
  Note: 'Note Here',
  'Note Period': 'Note Period Here',
  Keywords: 'Keywords Here',
  Id: 'Id Here',
  'Actual Date Noted': '01/01/1970 00:00:00',
  'Created By Name': 'Creator IDIR Here',
  'Created By': 'Creator Row Id Here',
  'Created By Office Name': 'Office Name Here',
  Created: '01/01/1970 00:00:00',
  'Last Updated By Name': 'Updater IDIR Here',
  'Updated By': 'Updater Row Id Here',
  Updated: '01/01/1970 00:00:00',
};

export const CaseNotesListResponseExample = {
  items: [
    {
      ...CaseNotesSingleExample,
      Updated: '12/25/2024 00:33:37',
    },
    CaseNotesSingleExample,
  ],
};

/*
 * Model definitions
 */
@Exclude()
@ApiSchema({ name: 'CaseNotes' })
export class CaseNotesEntity {
  @ApiProperty({
    example: CaseNotesSingleExample['Note'],
  })
  @Expose()
  Note: string;

  @ApiProperty({
    example: CaseNotesSingleExample['Note Period'],
  })
  @Expose()
  'Note Period': string;

  @ApiProperty({
    example: CaseNotesSingleExample['Keywords'],
  })
  @Expose()
  Keywords: string;

  @ApiProperty({
    example: CaseNotesSingleExample['Id'],
  })
  @Expose()
  Id: string;

  @ApiProperty({
    example: CaseNotesSingleExample['Actual Date Noted'],
  })
  @Expose()
  'Actual Date Noted': string;

  @ApiProperty({
    example: CaseNotesSingleExample['Created By Name'],
  })
  @Expose()
  'Created By Name': string;

  @ApiProperty({
    example: CaseNotesSingleExample['Created By'],
  })
  @Expose()
  'Created By': string;

  @ApiProperty({
    example: CaseNotesSingleExample['Created By Office Name'],
  })
  @Expose()
  'Created By Office Name': string;

  @ApiProperty({
    example: CaseNotesSingleExample['Created'],
  })
  @Expose()
  'Created': string;

  @ApiProperty({
    example: CaseNotesSingleExample['Last Updated By Name'],
  })
  @Expose()
  'Last Updated By Name': string;

  @ApiProperty({
    example: CaseNotesSingleExample['Updated By'],
  })
  @Expose()
  'Updated By': string;

  @ApiProperty({
    example: CaseNotesSingleExample['Updated'],
  })
  @Expose()
  'Updated': string;

  constructor(partial: Partial<CaseNotesEntity>) {
    Object.assign(this, partial);
  }
}

@Exclude()
@ApiSchema({ name: 'CaseNotesResponse' })
export class NestedCaseNotesEntity {
  @Expose()
  @ApiProperty({ type: CaseNotesEntity, isArray: true })
  @Type(() => CaseNotesEntity)
  items: Array<CaseNotesEntity>;

  constructor(object) {
    Object.assign(this, object);
  }
}
