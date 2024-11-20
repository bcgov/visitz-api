import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

/*
 * Examples
 */
// TODO: Replace 'string' with something meaningful when I can actually hit the endpoint
const AttachmentsSingleResponseCaseExample = {
  'Application No': '',
  Categorie: 'string',
  Category: 'string',
  'Client Flag': 'string',
  'End Date': 'string',
  'Final Flag': 'string',
  'Form Description': 'string',
  'Incident Id': '',
  'Incident No': '',
  Internal: 'string',
  'Last Updated Date': 'string',
  'No Intervention': 'Case-Id-Here',
  'Portal Visible': 'string',
  'Show on Contact': 'string',
  Status: 'string',
  'Sub-Category': 'string',
  Template: 'string',
  'Template Type': 'string',
  'Case Id': 'string',
  Comments: 'string',
  'Created Date': 'string',
  CreatedByName: 'string',
  FileAutoUpdFlg: 'string',
  FileDate: 'string',
  FileDeferFlg: 'string',
  FileDockReqFlg: 'string',
  FileDockStatFlg: 'string',
  FileExt: 'string',
  FileSize: 'string',
  FileSrcPath: 'string',
  FileSrcType: 'string',
  UpdatedByName: 'string',
  FileName: 'string',
  'Memo Id': '',
  MemoNumber: '',
  'SR Id': '',
  'Attachment Id': 'string',
  Id: 'string',
};

const AttachmentsSingleResponseIncidentExample = {
  ...AttachmentsSingleResponseCaseExample,
  'No Intervention': '',
  'Incident No': 'Incident-Id-Here',
};

const AttachmentsSingleResponseSRExample = {
  ...AttachmentsSingleResponseCaseExample,
  'No Intervention': '',
  'Application No': 'SR-Id-Here',
};

const AttachmentsSingleResponseMemoExample = {
  ...AttachmentsSingleResponseCaseExample,
  'No Intervention': '',
  MemoNumber: 'Memo-Id-Here',
};

export const AttachmentsListResponseCaseExample = {
  items: [
    AttachmentsSingleResponseCaseExample,
    {
      ...AttachmentsSingleResponseCaseExample,
      'No Intervention': 'Another-Case-Id-Here',
    },
  ],
};

export const AttachmentsListResponseIncidentExample = {
  items: [
    AttachmentsSingleResponseIncidentExample,
    {
      ...AttachmentsSingleResponseIncidentExample,
      'Incident No': 'Another-Incident-Id-Here',
    },
  ],
};

export const AttachmentsListResponseSRExample = {
  items: [
    AttachmentsSingleResponseSRExample,
    {
      ...AttachmentsSingleResponseSRExample,
      'Application No': 'Another-SR-Id-Here',
    },
  ],
};

export const AttachmentsListResponseMemoExample = {
  items: [
    AttachmentsSingleResponseMemoExample,
    {
      ...AttachmentsSingleResponseMemoExample,
      MemoNumber: 'Another-Memo-Id-Here',
    },
  ],
};

/*
 * Model definitions
 */
@Exclude()
@ApiSchema({ name: 'Attachment' })
class AttachmentsEntity {
  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['Name'],
  })
  @Expose()
  Name: string;

  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['Application No'],
  })
  @Expose()
  'Application No': string;

  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['Categorie'],
  })
  @Expose()
  Categorie: string;

  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['Category'],
  })
  @Expose()
  Category: string;

  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['Client Flag'],
  })
  @Expose()
  'Client Flag': string;

  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['End Date'],
  })
  @Expose()
  'End Date': string;

  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['Final Flag'],
  })
  @Expose()
  'Final Flag': string;

  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['Form Description'],
  })
  @Expose()
  'Form Description': string;

  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['Incident Id'],
  })
  @Expose()
  'Incident Id': string;

  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['Incident No'],
  })
  @Expose()
  'Incident No': string;

  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['Internal'],
  })
  @Expose()
  Internal: string;

  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['Last Updated Date'],
  })
  @Expose()
  'Last Updated Date': string;

  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['No Intervention'],
  })
  @Expose()
  'No Intervention': string;

  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['Portal Visible'],
  })
  @Expose()
  'Portal Visible': string;

  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['Show on Contact'],
  })
  @Expose()
  'Show on Contact': string;

  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['Status'],
  })
  @Expose()
  Status: string;
  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['Sub-Category'],
  })
  @Expose()
  'Sub-Category': string;

  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['Template'],
  })
  @Expose()
  Template: string;

  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['Template Type'],
  })
  @Expose()
  'Template Type': string;

  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['Case Id'],
  })
  @Expose()
  'Case Id': string;

  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['Comments'],
  })
  @Expose()
  Comments: string;

  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['Created Date'],
  })
  @Expose()
  'Created Date': string;

  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['CreatedByName'],
  })
  @Expose()
  CreatedByName: string;

  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['FileAutoUpdFlg'],
  })
  @Expose()
  FileAutoUpdFlg: string;

  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['FileDate'],
  })
  @Expose()
  FileDate: string;

  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['FileDeferFlg'],
  })
  @Expose()
  FileDeferFlg: string;

  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['FileDockReqFlg'],
  })
  @Expose()
  FileDockReqFlg: string;

  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['FileDockStatFlg'],
  })
  @Expose()
  FileDockStatFlg: string;

  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['FileExt'],
  })
  @Expose()
  FileExt: string;

  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['FileSize'],
  })
  @Expose()
  FileSize: string;

  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['FileSrcPath'],
  })
  @Expose()
  FileSrcPath: string;

  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['FileSrcType'],
  })
  @Expose()
  FileSrcType: string;

  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['UpdatedByName'],
  })
  @Expose()
  UpdatedByName: string;

  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['FileName'],
  })
  @Expose()
  FileName: string;

  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['Memo Id'],
  })
  @Expose()
  'Memo Id': string;

  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['MemoNumber'],
  })
  @Expose()
  MemoNumber: string;

  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['SR Id'],
  })
  @Expose()
  'SR Id': string;

  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['Attachment Id'],
  })
  @Expose()
  'Attachment Id': string;

  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['Id'],
  })
  @Expose()
  Id: string;

  constructor(partial: Partial<AttachmentsEntity>) {
    Object.assign(this, partial);
  }
}

@Exclude()
@ApiSchema({ name: 'AttachmentsResponse' })
export class NestedAttachmentsEntity {
  @Expose()
  @ApiProperty({ type: AttachmentsEntity, isArray: true })
  @Type(() => AttachmentsEntity)
  items: Array<AttachmentsEntity>;

  constructor(object) {
    Object.assign(this, object);
  }
}
