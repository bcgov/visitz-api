import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import {
  ContactLanguage,
  ContactLanguageType,
  YNEnum,
} from '../common/constants/enumerations';
import { isNotEmoji } from '../helpers/utilities/utilities.service';
import {
  contactLanguagesCommentsMax,
  contactLanguagesOtherLanguageMax,
} from '../common/constants/upstream-constants';

@Exclude()
@ApiSchema({ name: 'PostContactLanguagesRequest' })
export class PostContactLanguagesDto {
  @IsEnum(ContactLanguage)
  @Expose()
  @ApiProperty({
    example: ContactLanguage.AmericanSignLanguage,
    description: 'The Language the contact uses.',
    enum: ContactLanguage,
  })
  'Language Name': string;

  @IsOptional()
  @IsNotEmpty()
  @MaxLength(contactLanguagesOtherLanguageMax)
  @Transform(({ value }) => {
    if (value != undefined) return isNotEmoji(value);
    else return value;
  })
  @Expose()
  @ApiProperty({
    example: 'Other Language Here',
    description: 'Other Language for the contact.',
    maxLength: contactLanguagesOtherLanguageMax,
  })
  'Other Language'?: string;

  @IsOptional()
  @IsEnum(YNEnum)
  @Expose()
  @ApiProperty({
    example: YNEnum.True,
    description: 'Whether or not the contact requires a translator.',
    enum: YNEnum,
  })
  'Translator Req'?: string;

  @IsOptional()
  @IsEnum(ContactLanguageType)
  @Expose()
  @ApiProperty({
    example: ContactLanguageType.SignLanguage,
    description: 'The type of language.',
    enum: ContactLanguageType,
  })
  'ICM Type'?: string;

  @IsOptional()
  @IsNotEmpty()
  @MaxLength(contactLanguagesCommentsMax)
  @Transform(({ value }) => {
    if (value != undefined) return isNotEmoji(value);
    else return value;
  })
  @Expose()
  @ApiProperty({
    example: 'Comments here',
    description: 'Comments for contact language.',
    maxLength: contactLanguagesCommentsMax,
  })
  'Comments'?: string;
}

// For use upstream only. Validation not done on parameters here
// as it should have already been done previously
export class PostContactLanguagesDtoUpstream {
  Id: string;
  'Language Name': ContactLanguage;
  'Other Language'?: string;
  'Translator Req'?: YNEnum;
  'ICM Type'?: ContactLanguageType;
  'Type': string;
  Comments?: string;
  'SSA Primary Field'?: YNEnum;

  constructor(object) {
    Object.assign(this, object);
  }
}
