import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class StartRowNumQueryParams {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Expose()
  @ApiProperty({
    example: 300,
    default: 0,
    description:
      'The row from which to start displaying results, defaults to 0. Records are returned in batches of 100, or less if 100 further records are unavailable from the provided start point. If no records are available at the given start point, returns 204. Use in combination with the total-record-count response header to enable pagination.',
  })
  StartRowNum?: number;
}
