import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import {
  IsBooleanString,
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import {
  ExcludeEmptyFieldsEnum,
  RecordCountNeededEnum,
} from '../common/constants/enumerations';
import {
  pageSizeDefault,
  pageSizeMax,
  pageSizeMin,
  pageSizeParamName,
  recordCountNeededParamName,
  startRowNumDefault,
  startRowNumMin,
  startRowNumParamName,
} from '../common/constants/upstream-constants';
import {
  inlineAttachmentParamName,
  afterParamName,
  excludeEmptyFieldsParamName,
} from '../common/constants/parameter-constants';

@Exclude()
export class AfterQueryParams {
  @IsOptional()
  @IsISO8601({ strict: true })
  @Expose()
  @ApiProperty({
    example: '1970-01-01T00:00:00',
    format: 'date-time',
    description:
      'The ISO8601 formatted date to narrow down searches with, expected to be provided in UTC.' +
      ' Only results after the selected datetime will appear.',
  })
  [afterParamName]?: string;

  @IsOptional()
  @IsEnum(ExcludeEmptyFieldsEnum)
  @Expose()
  @ApiProperty({
    example: ExcludeEmptyFieldsEnum.False,
    default: ExcludeEmptyFieldsEnum.False,
    enum: ExcludeEmptyFieldsEnum,
    description:
      `Whether or not empty fields should be removed from the response. Set to` +
      ` ${ExcludeEmptyFieldsEnum.True} if you want these fields to be removed.`,
  })
  [excludeEmptyFieldsParamName]?: string = ExcludeEmptyFieldsEnum.False;
}

@Exclude()
export class FilterQueryParams extends AfterQueryParams {
  @IsOptional()
  @IsEnum(RecordCountNeededEnum)
  @Expose()
  @ApiProperty({
    example: RecordCountNeededEnum.False,
    default: RecordCountNeededEnum.False,
    enum: RecordCountNeededEnum,
    description:
      `Whether or not a record count is needed. Set to` +
      ` ${RecordCountNeededEnum.True} if you wish to use pagination.`,
  })
  [recordCountNeededParamName]?: string = RecordCountNeededEnum.False;

  @IsOptional()
  @IsInt()
  @Min(pageSizeMin)
  @Max(pageSizeMax)
  @Expose()
  @ApiProperty({
    example: 25,
    default: pageSizeDefault,
    maximum: pageSizeMax,
    minimum: pageSizeMin,
    format: 'integer',
    description:
      `The maximum number of records to return. This parameter has a maximum of` +
      ` ${pageSizeMax}. Used to enable pagination.`,
  })
  [pageSizeParamName]?: number = pageSizeDefault;

  @IsOptional()
  @IsInt()
  @Min(startRowNumMin)
  @Expose()
  @ApiProperty({
    example: 300,
    default: startRowNumDefault,
    minimum: startRowNumMin,
    format: 'integer',
    description:
      `The row from which to start displaying results, defaults to ${startRowNumDefault}. Records are returned in batches based ` +
      `on the PageSize, or less if that quantity of further records are unavailable from the provided start point.` +
      ` If no records are available at the given start point, returns 204. Use in combination with the total-record-count` +
      ` response header and PageSize parameter to enable pagination.`,
  })
  [startRowNumParamName]?: number;
}

@Exclude()
export class AttachmentDetailsQueryParams extends FilterQueryParams {
  @IsOptional()
  @IsBooleanString()
  @Expose()
  @ApiProperty({
    example: true,
    default: true,
    type: 'boolean',
    description:
      'Whether or not you want the inline attachment download to be included in the request.',
  })
  [inlineAttachmentParamName]?: string = 'true';
}

@Exclude()
export class VisitDetailsQueryParams extends FilterQueryParams {
  @IsOptional()
  @IsBooleanString()
  @Expose()
  @ApiProperty({
    example: false,
    default: false,
    type: 'boolean',
    description:
      'Whether or not you want the visit details to be displayed as multiple values.',
  })
  multivalue?: string = 'false';
}
