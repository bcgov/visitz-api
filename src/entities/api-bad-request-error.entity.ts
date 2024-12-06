import { ApiSchema, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
@ApiSchema({ name: 'BadRequestError' })
export class ApiBadRequestErrorEntity {
  @Expose()
  @ApiProperty({
    example: ['String user error 1 here.', 'String user error 2 here.'],
  })
  message: string[];

  @Expose()
  @ApiProperty({ example: 'BadRequest' })
  error: string;

  @Expose()
  @ApiProperty({ example: 400 })
  statusCode: number = 400;
}
