import { ApiSchema, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

/*
 * Examples
 */
export const IncidentAdditionalInformationExample = {
  Id: 'Id Here',
  'Additional Information': 'Additional Information Here',
};

export const SRAdditionalInformationExample = {
  ...IncidentAdditionalInformationExample,
};

export const MemoAdditionalInformationExample = {
  ...IncidentAdditionalInformationExample,
};

/*
 * Model definitions
 */
@Exclude()
@ApiSchema({ name: 'BaseAdditionalInformationValue' })
export class BaseAdditionalInformationValue {
  @ApiProperty({
    example: IncidentAdditionalInformationExample['Id'],
  })
  @Expose()
  Id: string;

  @ApiProperty({
    example: IncidentAdditionalInformationExample['Additional Information'],
  })
  @Expose()
  'Additional Information': string;

  constructor(object) {
    Object.assign(this, object);
  }
}
