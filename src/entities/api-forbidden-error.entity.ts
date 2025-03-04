import { ApiSchema, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
@ApiSchema({ name: 'ForbiddenError' })
export class ApiForbiddenErrorEntity {
  @Expose()
  @ApiProperty({ example: 'Forbidden resource' })
  message: string;

  @Expose()
  @ApiProperty({ example: 'Forbidden' })
  error: string;

  @Expose()
  @ApiProperty({ example: 403 })
  statusCode: number = 403;
}
