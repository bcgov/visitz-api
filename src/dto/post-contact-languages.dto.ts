import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { YNEnum } from '../common/constants/enumerations';
import { isNotEmoji } from '../helpers/utilities/utilities.service';
import {
  contactLanguagesCommentsMax,
  contactLanguagesIcmTypeMax,
  contactLanguagesLanguageNameMax,
  contactLanguagesOtherLanguageMax,
} from '../common/constants/upstream-constants';

@Exclude()
@ApiSchema({ name: 'PostContactLanguagesRequest' })
export class PostContactLanguagesDto {
  @IsNotEmpty()
  @MaxLength(contactLanguagesLanguageNameMax)
  @Transform(({ value }) => {
    if (value != undefined) return isNotEmoji(value);
    else return value;
  })
  @Expose()
  @ApiProperty({
    example: 'American Sign Language',
    description: 'The Language the contact uses.',
    maxLength: contactLanguagesLanguageNameMax,
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
    required: false,
  })
  'Other Language'?: string;

  @IsOptional()
  @IsEnum(YNEnum)
  @Expose()
  @ApiProperty({
    example: YNEnum.True,
    description: 'Whether or not the contact requires a translator.',
    enum: YNEnum,
    required: false,
  })
  'Translator Req'?: string;

  @IsOptional()
  @IsNotEmpty()
  @MaxLength(contactLanguagesIcmTypeMax)
  @Transform(({ value }) => {
    if (value != undefined) return isNotEmoji(value);
    else return value;
  })
  @Expose()
  @ApiProperty({
    example: 'Sign Language',
    description: 'The type of language.',
    maxLength: contactLanguagesIcmTypeMax,
    required: false,
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
    required: false,
  })
  'Comments'?: string;
}

// For use upstream only. Validation not done on parameters here
// as it should have already been done previously
export class PostContactLanguagesDtoUpstream {
  Id: string;
  'Language Name': string;
  'Other Language'?: string;
  'Translator Req'?: YNEnum;
  'ICM Type'?: string;
  'Type': string;
  Comments?: string;
  'SSA Primary Field'?: YNEnum;

  constructor(object) {
    Object.assign(this, object);
  }
}
