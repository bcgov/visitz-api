import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import {
  IsArray,
  IsBooleanString,
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { YNEnum, BooleanStringEnum } from '../common/constants/enumerations';
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
  caseIncludeParam,
  incidentIncludeParam,
  srIncludeParam,
  memoIncludeParam,
  checkIdsParamName,
} from '../common/constants/parameter-constants';
import { isIdArray } from '../helpers/utilities/utilities.service';

@Exclude()
export class FilterQueryParams {
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
  @IsEnum(BooleanStringEnum)
  @Expose()
  @ApiProperty({
    example: BooleanStringEnum.False,
    default: BooleanStringEnum.False,
    enum: BooleanStringEnum,
    description:
      `Whether or not a record count is needed. Set to` +
      ` ${BooleanStringEnum.True} if you wish to use pagination.`,
  })
  [recordCountNeededParamName]?: string = BooleanStringEnum.False;

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

  @IsOptional()
  @IsEnum(YNEnum)
  @Expose()
  @ApiProperty({
    example: YNEnum.False,
    default: YNEnum.False,
    enum: YNEnum,
    description:
      `Whether or not empty fields should be removed from the response. Set to` +
      ` ${YNEnum.True} if you want these fields to be removed.`,
  })
  [excludeEmptyFieldsParamName]?: string = YNEnum.False;
}

@Exclude()
export class CaseloadQueryParams extends FilterQueryParams {
  @IsOptional()
  @IsEnum(BooleanStringEnum)
  @Expose()
  @ApiProperty({
    example: BooleanStringEnum.True,
    default: BooleanStringEnum.True,
    enum: BooleanStringEnum,
    description:
      `Whether or not to include cases in caseload return. Set to` +
      ` ${BooleanStringEnum.False} if you wish to exclude cases.`,
  })
  [caseIncludeParam]?: string = BooleanStringEnum.True;

  @IsOptional()
  @IsEnum(BooleanStringEnum)
  @Expose()
  @ApiProperty({
    example: BooleanStringEnum.True,
    default: BooleanStringEnum.True,
    enum: BooleanStringEnum,
    description:
      `Whether or not to include incidents in caseload return. Set to` +
      ` ${BooleanStringEnum.False} if you wish to exclude incidents.`,
  })
  [incidentIncludeParam]?: string = BooleanStringEnum.True;

  @IsOptional()
  @IsEnum(BooleanStringEnum)
  @Expose()
  @ApiProperty({
    example: BooleanStringEnum.True,
    default: BooleanStringEnum.True,
    enum: BooleanStringEnum,
    description:
      `Whether or not to include service requests in caseload return. Set to` +
      ` ${BooleanStringEnum.False} if you wish to exclude service requests.`,
  })
  [srIncludeParam]?: string = BooleanStringEnum.True;

  @IsOptional()
  @IsEnum(BooleanStringEnum)
  @Expose()
  @ApiProperty({
    example: BooleanStringEnum.True,
    default: BooleanStringEnum.True,
    enum: BooleanStringEnum,
    description:
      `Whether or not to include memos in caseload return. Set to` +
      ` ${BooleanStringEnum.False} if you wish to exclude memos.`,
  })
  [memoIncludeParam]?: string = BooleanStringEnum.True;
}

@Exclude()
export class CheckIdQueryParams extends FilterQueryParams {
  @IsOptional()
  @Transform(({ value }) => {
    if (value === null || value === undefined) {
      return value;
    }
    return isIdArray(value);
  })
  @IsArray()
  @Expose()
  @ApiProperty({
    example: 'Id-1-Here,Id-2-Here',
    description: `Ids of child objects to check for existence of. Note that they must be children of the parent entity id provided.`,
  })
  [checkIdsParamName]?: Array<string>;
}

@Exclude()
export class AttachmentDetailsQueryParams extends CheckIdQueryParams {
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
export class VisitDetailsQueryParams extends CheckIdQueryParams {
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
