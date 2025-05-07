import { Exclude, Expose, Transform } from 'class-transformer';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import {
  IsByteLength,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  attachmentIdFieldName,
  casesAttachmentsFieldName,
  incidentsAttachmentsFieldName,
  memoAttachmentsFieldName,
  srAttachmentsFieldName,
} from '../common/constants/parameter-constants';
import { isNotEmoji } from '../helpers/utilities/utilities.service';
import {
  attachmentCategoryMax,
  attachmentFormDescriptionMax,
  attachmentStatusMax,
  attachmentTemplateMax,
  upstreamAttachmentConstraintNull,
} from '../common/constants/upstream-constants';
import { AttachmentStatusEnum } from '../common/constants/enumerations';

/*
 * Examples
 */
const PostAttachmentsReturnExampleBase = {
  Category: 'Documentation',
  'Form Description': 'KKCFS Document',
  Status: AttachmentStatusEnum.Profiled,
  Template: 'TEMPLATENAMEHERE',
  [memoAttachmentsFieldName]: upstreamAttachmentConstraintNull,
  FileExt: 'pdf',
  FileName: 'file_name_here',
  Id: 'Id Here',
};

export const PostAttachmentsCaseReturnExample = {
  items: [
    {
      ...PostAttachmentsReturnExampleBase,
      [casesAttachmentsFieldName]: 'Case Id Here',
    },
  ],
};

export const PostAttachmentsIncidentReturnExample = {
  items: [
    {
      ...PostAttachmentsReturnExampleBase,
      [incidentsAttachmentsFieldName]: 'Incident Id Here',
    },
  ],
};

export const PostAttachmentsSRReturnExample = {
  items: [
    {
      ...PostAttachmentsReturnExampleBase,
      [srAttachmentsFieldName]: 'SR Id Here',
    },
  ],
};

export const PostAttachmentsMemoReturnExample = {
  items: [
    {
      ...PostAttachmentsReturnExampleBase,
      [memoAttachmentsFieldName]: 'Memo Id Here',
    },
  ],
};

/**
 * Models
 */
@Exclude()
@ApiSchema({ name: 'PostAttachmentRequest' })
export class PostAttachmentDto {
  @ApiProperty({
    description:
      `The file to upload, in binary format. Max file size` +
      ` defaults to 5 megabytes.`,
    required: true,
    format: 'binary',
  })
  @Expose()
  [attachmentIdFieldName]?: string;

  @IsNotEmpty()
  @IsString()
  @IsByteLength(1, attachmentCategoryMax)
  @Transform(({ value }) => {
    return isNotEmoji(value);
  })
  @Expose()
  @ApiProperty({
    example: 'Documentation',
    description: 'Category of the file uploaded.',
    maxLength: attachmentCategoryMax,
  })
  Category: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsByteLength(1, attachmentFormDescriptionMax)
  @Transform(({ value }) => {
    return isNotEmoji(value);
  })
  @Expose()
  @ApiProperty({
    example: 'KKCFS Document',
    description: 'Description of the file uploaded.',
    maxLength: attachmentFormDescriptionMax,
    required: false,
  })
  'Form Description'?: string;

  @IsEnum(AttachmentStatusEnum)
  @IsByteLength(1, attachmentStatusMax)
  @Expose()
  @ApiProperty({
    example: AttachmentStatusEnum.Profiled,
    description: 'The status of the attachment.',
    enum: AttachmentStatusEnum,
    maxLength: attachmentStatusMax,
  })
  Status: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsByteLength(1, attachmentTemplateMax)
  @Transform(({ value }) => {
    return isNotEmoji(value);
  })
  @Expose()
  @ApiProperty({
    example: 'TEMPLATENAMEHERE',
    description: 'Template name.',
    maxLength: attachmentTemplateMax,
    required: false,
  })
  Template?: string;
}

// For use upstream only. Validation not done on parameters here
// as it should have already been done previously
export class PostAttachmentDtoUpstream {
  Id: string | undefined;
  FileExt: string;
  FileName: string;
  Template?: string;
  Category: string;
  'Form Description'?: string;
  Status: string;
  [attachmentIdFieldName]: string;
  [casesAttachmentsFieldName]: string | undefined;
  [incidentsAttachmentsFieldName]: string | undefined;
  [srAttachmentsFieldName]: string | undefined;
  [memoAttachmentsFieldName]: string;

  constructor(object) {
    Object.assign(this, object);
  }
}
