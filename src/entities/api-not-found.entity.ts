import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ApiNotFoundEntity {
  @Expose()
  @ApiProperty({ example: 404 })
  status: number = 404;

  @Expose()
  @ApiProperty({ example: 'There is no data for the requested resource' })
  error: string;
}
