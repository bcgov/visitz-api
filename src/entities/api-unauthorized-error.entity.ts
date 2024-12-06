import { ApiSchema, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
@ApiSchema({ name: 'UnauthorizedError' })
export class ApiUnauthorizedErrorEntity {
  @Expose()
  @ApiProperty({ example: 'Unauthorized' })
  message: string;
}
