import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  createdByFieldName,
  createdByIdFieldName,
  createdDateFieldName,
  updatedByFieldName,
  updatedByIdFieldName,
  updatedDateFieldName,
} from '../common/constants/upstream-constants';

/*
 * Examples
 */
export const CaseNotesSingleExample = {
  Note: 'Note Here',
  'Note Period': 'Note Period Here',
  Keywords: 'Keywords Here',
  'Row Id': 'Id Here',
  Id: 'Id Here',
  'Actual Date Created': '01/01/1970 00:00:00',
  [createdByFieldName]: 'Creator IDIR Here',
  [createdByIdFieldName]: 'Creator Row Id Here',
  'Created By Office': 'Office Name Here',
  [createdDateFieldName]: '01/01/1970 00:00:00',
  [updatedByFieldName]: 'Updater IDIR Here',
  [updatedByIdFieldName]: 'Updater Row Id Here',
  [updatedDateFieldName]: '01/01/1970 00:00:00',
};

export const CaseNotesListResponseExample = {
  items: [
    {
      ...CaseNotesSingleExample,
      [updatedDateFieldName]: '12/25/2024 00:33:37',
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
    example: CaseNotesSingleExample['Row Id'],
  })
  @Expose()
  'Row Id': string;

  @ApiProperty({
    example: CaseNotesSingleExample['Id'],
  })
  @Expose()
  Id: string;

  @ApiProperty({
    example: CaseNotesSingleExample['Actual Date Created'],
  })
  @Expose()
  'Actual Date Created': string;

  @ApiProperty({
    example: CaseNotesSingleExample[createdByFieldName],
  })
  @Expose()
  [createdByFieldName]: string;

  @ApiProperty({
    example: CaseNotesSingleExample[createdByIdFieldName],
  })
  @Expose()
  [createdByIdFieldName]: string;

  @ApiProperty({
    example: CaseNotesSingleExample['Created By Office'],
  })
  @Expose()
  'Created By Office': string;

  @ApiProperty({
    example: CaseNotesSingleExample[createdDateFieldName],
  })
  @Expose()
  [createdDateFieldName]: string;

  @ApiProperty({
    example: CaseNotesSingleExample[updatedByFieldName],
  })
  @Expose()
  [updatedByFieldName]: string;

  @ApiProperty({
    example: CaseNotesSingleExample[updatedByIdFieldName],
  })
  @Expose()
  [updatedByIdFieldName]: string;

  @ApiProperty({
    example: CaseNotesSingleExample[updatedDateFieldName],
  })
  @Expose()
  [updatedDateFieldName]: string;

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
