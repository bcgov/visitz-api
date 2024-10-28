import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';
import { idRegex } from '../common/constants/constants';

export class IdPathParams {
  @Matches(idRegex)
  @ApiProperty({
    example: 'Entity-Id-Here',
    description: 'The Entity Id for your selected record type',
  })
  id: string;
}
