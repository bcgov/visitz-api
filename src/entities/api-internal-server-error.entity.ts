import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
@ApiSchema({ name: 'InternalServerError' })
export class ApiInternalServerErrorEntity {
  @Expose()
  @ApiProperty({ example: 500 })
  status: number = 500;

  @Expose()
  @ApiProperty({ example: 'Upstream auth failed' })
  error: string;
}
