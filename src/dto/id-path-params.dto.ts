import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';
import {
  attachmentIdName,
  idMaxLength,
  idName,
  idRegex,
} from '../common/constants/parameter-constants';

export class IdPathParams {
  @Matches(idRegex)
  @ApiProperty({
    example: 'Entity-Id-Here',
    description: 'The Entity Id for your selected record type.',
    maxLength: idMaxLength,
    pattern: idRegex.toString().replaceAll('/', ''),
  })
  [idName]: string;
}

export class AttachmentIdPathParams extends IdPathParams {
  @Matches(idRegex)
  @ApiProperty({
    example: 'Attachment-Id-Here',
    description: 'The Id of the attachment you wish to download.',
    maxLength: idMaxLength,
    pattern: idRegex.toString().replaceAll('/', ''),
  })
  [attachmentIdName]: string;
}
