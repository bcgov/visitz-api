import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { RecordCountNeededEnum } from '../common/constants/enumerations';
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
import { sinceParamName } from '../common/constants/parameter-constants';

export class FilterQueryParams {
  @IsOptional()
  @IsISO8601({ strict: true })
  @Expose()
  @ApiProperty({
    example: '2024-10-28T19:34:54',
    format: 'date-time',
    description:
      'The ISO8601 formatted date to narrow down searches with, expected to be provided in UTC.' +
      ' Only results after the selected datetime will appear.',
  })
  [sinceParamName]?: string;

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
      `The row from which to start displaying results, defaults to ${startRowNumDefault}. Records are returned in batches based` +
      `on the PageSize, or less if that quantity of further records are unavailable from the provided start point.` +
      ` If no records are available at the given start point, returns 204. Use in combination with the total-record-count` +
      ` response header and PageSize parameter to enable pagination.`,
  })
  [startRowNumParamName]?: number;
}
