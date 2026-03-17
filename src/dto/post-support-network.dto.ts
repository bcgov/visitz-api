import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Matches,
  MaxLength,
} from 'class-validator';
import { EntityType, YesNoEnum } from '../common/constants/enumerations';
import { phoneNumberRegex } from '../common/constants/parameter-constants';
import {
  supportNetworkAddressMax,
  supportNetworkAgencyMax,
  supportNetworkCellMax,
  supportNetworkCommentsMax,
  supportNetworkNameMax,
  supportNetworkRelationshipMax,
} from '../common/constants/upstream-constants';
import { isNotEmoji } from '../helpers/utilities/utilities.service';

@Exclude()
@ApiSchema({ name: 'PostSupportNetworkRequest' })
export class PostSupportNetworkDto {
  @IsNotEmpty()
  @MaxLength(supportNetworkNameMax)
  @Transform(({ value }) => {
    return isNotEmoji(value);
  })
  @Expose()
  @ApiProperty({
    example: 'First Last',
    description: 'Name of support network person.',
    maxLength: supportNetworkNameMax,
  })
  'Name': string;

  @IsOptional()
  @Matches(phoneNumberRegex)
  @Expose()
  @ApiProperty({
    example: '12345678901',
    description: 'Cell phone number of support network person.',
    maxLength: supportNetworkCellMax,
    pattern: phoneNumberRegex.toString().replaceAll('/', ''),
  })
  'Cell'?: string;

  @IsOptional()
  @Matches(phoneNumberRegex)
  @Expose()
  @ApiProperty({
    example: '12345678901',
    description: 'Phone number of support network person.',
    maxLength: supportNetworkCellMax,
    pattern: phoneNumberRegex.toString().replaceAll('/', ''),
  })
  'Phone'?: string;

  @IsOptional()
  @IsNotEmpty()
  @MaxLength(supportNetworkAddressMax)
  @Transform(({ value }) => {
    if (value != undefined) return isNotEmoji(value);
    else return value;
  })
  @Expose()
  @ApiProperty({
    example: 'Address Here',
    description: 'Address for support network person.',
    maxLength: supportNetworkAddressMax,
  })
  'Address'?: string;

  @IsOptional()
  @IsNotEmpty()
  @MaxLength(supportNetworkRelationshipMax)
  @Transform(({ value }) => {
    if (value != undefined) return isNotEmoji(value);
    else return value;
  })
  @Expose()
  @ApiProperty({
    example: 'Parent',
    description: 'Relationship for support network person.',
    maxLength: supportNetworkRelationshipMax,
  })
  'Relationship'?: string;

  @IsOptional()
  @IsNotEmpty()
  @MaxLength(supportNetworkAgencyMax)
  @Transform(({ value }) => {
    if (value != undefined) return isNotEmoji(value);
    else return value;
  })
  @Expose()
  @ApiProperty({
    example: 'Agency Name',
    description: 'Agency name for support network person.',
    maxLength: supportNetworkAgencyMax,
  })
  'Agency Name'?: string;

  @IsOptional()
  @IsNotEmpty()
  @MaxLength(supportNetworkCommentsMax)
  @Transform(({ value }) => {
    if (value != undefined) return isNotEmoji(value);
    else return value;
  })
  @Expose()
  @ApiProperty({
    example: 'Comments here',
    description: 'Comments for support network person.',
    maxLength: supportNetworkCommentsMax,
  })
  'Comments'?: string;

  @IsOptional()
  @IsEnum(YesNoEnum)
  @Expose()
  @ApiProperty({
    example: YesNoEnum.True,
    default: YesNoEnum.True,
    description: 'Whether the support network person is active.',
    enum: YesNoEnum,
  })
  'Active'?: string = YesNoEnum.True;
}

// For use upstream only. Validation not done on parameters here
// as it should have already been done previously
export class PostSupportNetworkDtoUpstream {
  'Name': string;

  'Cell'?: string;

  'Phone'?: string;

  'Address'?: string;

  'Relationship'?: string;

  'Agency'?: string;

  'Comments'?: string;

  'Active': YesNoEnum;

  'Id': string;

  'Entity Id': string;

  'Entity Name': EntityType;

  constructor(object) {
    Object.assign(this, object);
  }
}
