import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { isISO8601, IsOptional } from 'class-validator';

export class SinceQueryParams {
  @IsOptional()
  @Transform(({ value }) => {
    if (isISO8601(value, { strict: true })) {
      return value as string;
    }
    return undefined;
  })
  @Expose()
  @ApiProperty({
    example: '2024-10-28T19:34:54+0000',
    format: 'date-time',
    description:
      'The ISO8601 formatted date to narrow down searches with. Only results after the selected datetime will appear.',
  })
  since?: string;
}
