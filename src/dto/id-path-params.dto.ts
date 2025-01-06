import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';
import {
  attachmentIdName,
  contactIdName,
  idMaxLength,
  idName,
  idRegex,
  supportNetworkIdName,
  visitIdName,
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

export class ContactIdPathParams extends IdPathParams {
  @Matches(idRegex)
  @ApiProperty({
    example: 'Contact-Id-Here',
    description: 'The Id of the contact you wish to find.',
    maxLength: idMaxLength,
    pattern: idRegex.toString().replaceAll('/', ''),
  })
  [contactIdName]: string;
}

export class SupportNetworkIdPathParams extends IdPathParams {
  @Matches(idRegex)
  @ApiProperty({
    example: 'Support-Network-Id-Here',
    description: 'The Id of the support network you wish to find.',
    maxLength: idMaxLength,
    pattern: idRegex.toString().replaceAll('/', ''),
  })
  [supportNetworkIdName]: string;
}

export class VisitIdPathParams extends IdPathParams {
  @Matches(idRegex)
  @ApiProperty({
    example: 'Visit-Id-Here',
    description: 'The Id of the visit you wish to find.',
    maxLength: idMaxLength,
    pattern: idRegex.toString().replaceAll('/', ''),
  })
  [visitIdName]: string;
}
