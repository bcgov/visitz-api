import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class SupportNetworkEntity {
  @Expose()
  'Cell Phone Number': string;

  @Expose()
  'Entity Name': string;

  @Expose()
  Name: string;

  @Expose()
  Updated: string;

  @Expose()
  Comments: string;

  @Expose()
  'ICM SNC SR Con Flag': string;

  @Expose()
  'Emergency Contact': string;

  @Expose()
  'Entity Id': string;

  @Expose()
  'Agency Name': string;

  @Expose()
  'Phone Number': string;

  @Expose()
  Relationship: string;

  @Expose()
  Id: string;

  @Expose()
  Address: string;

  @Expose()
  Active: string;

  @Expose()
  Created: string;

  @Expose()
  'Updated By': string;

  @Expose()
  'ICM SNC Case Con Flag': string;

  @Expose()
  'Created By': string;

  constructor(partial: Partial<SupportNetworkEntity>) {
    Object.assign(this, partial);
  }
}

@Exclude()
export class NestedSupportNetworkEntity {
  @Expose()
  @Type(() => SupportNetworkEntity)
  items: Array<SupportNetworkEntity>;

  constructor(object) {
    Object.assign(this, object);
  }
}
