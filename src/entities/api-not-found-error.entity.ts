import { ApiSchema, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
@ApiSchema({ name: 'NotFoundError' })
export class ApiNotFoundErrorEntity {
  @Expose()
  @ApiProperty({ example: 'no Route matched with those values' })
  message: string;
}
