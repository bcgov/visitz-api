import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { isNotEmoji } from '../helpers/utilities/utilities.service';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  Matches,
  ValidateNested,
} from 'class-validator';
import { EntityType } from '../common/constants/enumerations';
import {
  entityNumberFieldName,
  entityTypeFieldName,
} from '../common/constants/upstream-constants';
import { idMaxLength, idRegex } from '../common/constants/parameter-constants';

@Exclude()
@ApiSchema({ name: 'SubmitNotesItem' })
export class SubmitNotesItem {
  @Matches(idRegex)
  @ApiProperty({
    example: 'Entity-Number-Here',
    description: 'The Entity Number for your selected entity type.',
    maxLength: idMaxLength,
    pattern: idRegex.toString().replaceAll('/', ''),
  })
  @Expose()
  [entityNumberFieldName]: string;

  @IsEnum(EntityType)
  @Expose()
  @ApiProperty({
    example: EntityType.Case,
    description: 'The entity type.',
    enum: EntityType,
  })
  [entityTypeFieldName]: string;

  @IsNotEmpty()
  @Transform(({ value }) => {
    return isNotEmoji(value);
  })
  @Expose()
  @ApiProperty({
    example: 'Note period here',
    description: 'Note period.',
  })
  'notePeriod': string;

  @IsNotEmpty()
  @Transform(({ value }) => {
    return isNotEmoji(value);
  })
  @Expose()
  @ApiProperty({
    example: 'Notes',
    description: 'Notes',
  })
  'notes': string;

  constructor(object) {
    Object.assign(this, object);
  }
}

@Exclude()
@ApiSchema({ name: 'SubmitNotesWorkflowDto' })
export class SubmitNotesWorkflowDto {
  @ValidateNested()
  @IsArray()
  @ArrayNotEmpty()
  @Expose()
  @ApiProperty({
    type: SubmitNotesItem,
    isArray: true,
  })
  @Type(() => SubmitNotesItem)
  RequestSubmitNotes: Array<SubmitNotesItem>;

  constructor(object) {
    Object.assign(this, object);
  }
}
