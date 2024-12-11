import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { createdDateFieldName } from '../common/constants/upstream-constants';

/*
 * Examples
 */
export const AttachmentsSingleResponseCaseExample = {
  'Application No': '',
  Categorie: 'Attachment',
  Category: 'Assessment',
  'Client Flag': 'N',
  'End Date': '01/01/1970 00:00:00',
  'Final Flag': 'Y',
  'Form Description': 'Reportable Circumstance',
  'Incident Id': '',
  'Incident No': '',
  Internal: 'N',
  'No Intervention': 'Numeric-Case-Id-Here',
  'Portal Visible': 'No',
  'Show on Contact': 'N',
  Status: 'Complete',
  'Sub-Category': 'Identification',
  Template: 'CF0659',
  'Template Type': 'Form',
  'Case Id': 'Case-Id-Here',
  Comments: 'comments here',
  FileAutoUpdFlg: 'Y',
  FileDate: '01/01/1970 00:00:00',
  FileDeferFlg: 'P',
  FileDockReqFlg: 'N',
  FileDockStatFlg: 'E',
  FileExt: 'png',
  FileSize: '16635',
  FileSrcPath: 'file\\path\\here',
  FileSrcType: 'FILE',
  FileName: 'File_Name_Here',
  'Memo Id': '',
  MemoNumber: '',
  'SR Id': '',
  Id: 'Attachment-Id-Here',
  CreatedByName: 'Creator-Idir-Here',
  [createdDateFieldName]: '01/01/1970 00:00:00',
  UpdatedByName: 'Updater-Idir-Here',
  'Last Updated Date': '01/01/1970 00:00:00',
};

export const AttachmentDetailsCaseExample = {
  ...AttachmentsSingleResponseCaseExample,
  'Attachment Id': 'base64 inline attachment here',
};

export const AttachmentsSingleResponseIncidentExample = {
  ...AttachmentsSingleResponseCaseExample,
  'No Intervention': '',
  'Case Id': '',
  'Incident Id': 'Incident-Id-Here',
  'Incident No': 'Numeric-Incident-Id-Here',
};

export const AttachmentDetailsIncidentExample = {
  ...AttachmentsSingleResponseIncidentExample,
  'Attachment Id': 'base64 inline attachment here',
};

export const AttachmentsSingleResponseSRExample = {
  ...AttachmentsSingleResponseCaseExample,
  'No Intervention': '',
  'Case Id': '',
  'Application No': 'Numeric-SR-Id-Here',
  'SR Id': 'SR-Id-Here',
};

export const AttachmentDetailsSRExample = {
  ...AttachmentsSingleResponseSRExample,
  'Attachment Id': 'base64 inline attachment here',
};

export const AttachmentsSingleResponseMemoExample = {
  ...AttachmentsSingleResponseCaseExample,
  'No Intervention': '',
  'Case Id': '',
  MemoNumber: 'Numeric-Memo-Id-Here',
  'Memo Id': 'Memo-Id-Here',
};

export const AttachmentDetailsMemoExample = {
  ...AttachmentsSingleResponseMemoExample,
  'Attachment Id': 'base64 inline attachment here',
};

export const AttachmentsListResponseCaseExample = {
  items: [
    AttachmentsSingleResponseCaseExample,
    {
      ...AttachmentsSingleResponseCaseExample,
      'No Intervention': 'Another-Numeric-Case-Id-Here',
      'Case Id': 'Another-Case-Id-Here',
    },
  ],
};

export const AttachmentsListResponseIncidentExample = {
  items: [
    AttachmentsSingleResponseIncidentExample,
    {
      ...AttachmentsSingleResponseIncidentExample,
      'Incident No': 'Another-Numeric-Incident-Id-Here',
      'Incident Id': 'Another-Incident-Id-Here',
    },
  ],
};

export const AttachmentsListResponseSRExample = {
  items: [
    AttachmentsSingleResponseSRExample,
    {
      ...AttachmentsSingleResponseSRExample,
      'Application No': 'Another-Numeric-SR-Id-Here',
      'SR Id': 'Another-SR-Id-Here',
    },
  ],
};

export const AttachmentsListResponseMemoExample = {
  items: [
    AttachmentsSingleResponseMemoExample,
    {
      ...AttachmentsSingleResponseMemoExample,
      MemoNumber: 'Another-Numeric-Memo-Id-Here',
      'Memo Id': 'Another-Memo-Id-Here',
    },
  ],
};

/*
 * Model definitions
 */
@Exclude()
@ApiSchema({ name: 'Attachment' })
export class AttachmentsEntity {
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
    // "Service Request", "Attachment", "HLS Case"
  })
  @Expose()
  Categorie: string;

  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['Category'],
    // "Assessment", "Vineland", "Identification"
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
    // "Open", "Profiled", "Complete"
  })
  @Expose()
  Status: string;
  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['Sub-Category'],
    // "Resume", "Identification", "Language", "Legal/Court Documents", "Program Eligibility"
  })
  @Expose()
  'Sub-Category': string;

  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['Template'],
    // "CF0659"
  })
  @Expose()
  Template: string;

  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['Template Type'],
    // "Form", "Document"
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
    // "FILE"
  })
  @Expose()
  FileSrcType: string;

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
    example: AttachmentsSingleResponseCaseExample['Id'],
  })
  @Expose()
  Id: string;

  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['CreatedByName'],
  })
  @Expose()
  'CreatedByName': string;

  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample[createdDateFieldName],
  })
  @Expose()
  [createdDateFieldName]: string;

  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['UpdatedByName'],
  })
  @Expose()
  'UpdatedByName': string;

  @ApiProperty({
    example: AttachmentsSingleResponseCaseExample['Last Updated Date'],
  })
  @Expose()
  'Last Updated Date': string;

  constructor(partial: Partial<AttachmentsEntity>) {
    Object.assign(this, partial);
  }
}

@Exclude()
@ApiSchema({ name: 'AttachmentDetailsResponse' })
export class AttachmentDetailsEntity extends AttachmentsEntity {
  @ApiProperty({
    example: AttachmentDetailsCaseExample['Attachment Id'],
  })
  @Expose()
  'Attachment Id': string;
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
