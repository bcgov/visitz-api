import { ApiSchema, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { virusScanFailedError } from '../common/constants/error-constants';

@Exclude()
@ApiSchema({ name: 'UnprocessableEntityError' })
export class ApiUnprocessableEntityErrorEntity {
  @Expose()
  @ApiProperty({
    example: [virusScanFailedError],
  })
  message: string[];

  @Expose()
  @ApiProperty({ example: 'UnprocessableEntity' })
  error: string;

  @Expose()
  @ApiProperty({ example: 422 })
  statusCode: number = 422;
}
