import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';
import {
  attachmentIdName,
  contactIdName,
  caseNotesIdName,
  idMaxLength,
  idName,
  idRegex,
  responseNarrativeIdName,
  safetyAssessmentIdName,
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

export class SafetyAssessmentIdPathParams extends IdPathParams {
  @Matches(idRegex)
  @ApiProperty({
    example: 'Safety-Assessment-Id-Here',
    description: 'The Id of the safety assessment you wish to find.',
    maxLength: idMaxLength,
    pattern: idRegex.toString().replaceAll('/', ''),
  })
  [safetyAssessmentIdName]: string;
}

export class ResponseNarrativeIdPathParams extends IdPathParams {
  @Matches(idRegex)
  @ApiProperty({
    example: 'Response-Narrative-Id-Here',
    description: 'The Id of the response narrative you wish to find.',
    maxLength: idMaxLength,
    pattern: idRegex.toString().replaceAll('/', ''),
  })
  [responseNarrativeIdName]: string;
}

export class CaseNotesIdPathParams extends IdPathParams {
  @Matches(idRegex)
  @ApiProperty({
    example: 'Case-Note-Id-Here',
    description: 'The Id of the case note you wish to find.',
    maxLength: idMaxLength,
    pattern: idRegex.toString().replaceAll('/', ''),
  })
  [caseNotesIdName]: string;
}
