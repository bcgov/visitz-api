import { ApiSchema, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

/*
 * Examples
 */
export const IncidentCallInformationExample = {
  Id: 'Id Here',
  'Call Information': 'Call Information Here',
};

export const SRCallInformationExample = {
  ...IncidentCallInformationExample,
};

export const MemoCallInformationExample = {
  ...IncidentCallInformationExample,
  'Narrative Locked By': 'IDIR Here',
};

/*
 * Model definitions
 */
@Exclude()
@ApiSchema({ name: 'BaseCallInformationValue' })
export class BaseCallInformationValue {
  @ApiProperty({
    example: IncidentCallInformationExample['Id'],
  })
  @Expose()
  Id: string;

  @ApiProperty({
    example: IncidentCallInformationExample['Call Information'],
  })
  @Expose()
  'Call Information': string;

  constructor(object) {
    Object.assign(this, object);
  }
}

@Exclude()
@ApiSchema({ name: 'MemoCallInformationValue' })
export class MemoCallInformationValue extends BaseCallInformationValue {
  @ApiProperty({
    example: MemoCallInformationExample['Narrative Locked By'],
  })
  @Expose()
  'Narrative Locked By': string;

  constructor(object) {
    super(object);
    Object.assign(this, object);
  }
}
