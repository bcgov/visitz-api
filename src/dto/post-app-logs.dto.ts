import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { AppLogLevel } from '../common/constants/enumerations';

@Exclude()
@ApiSchema({ name: 'PostAppLogDevice' })
export class PostAppLogDevice {
  @IsString()
  @IsOptional()
  @Expose()
  @ApiProperty({ example: 'iPhone 15', description: 'The device model.' })
  'model'?: string;

  @IsString()
  @IsOptional()
  @Expose()
  @ApiProperty({ example: 'Apple', description: 'The device manufacturer.' })
  'manufacturer'?: string;

  @IsString()
  @IsOptional()
  @Expose()
  @ApiProperty({
    example: '17.4.1',
    description: 'The device operating system version.',
  })
  'os-version'?: string;

  @IsString()
  @IsOptional()
  @Expose()
  @ApiProperty({ example: 'phone', description: 'The device idiom.' })
  'idiom'?: string;

  @IsString()
  @IsOptional()
  @Expose()
  @ApiProperty({ example: 'ios', description: 'The device platform.' })
  'platform'?: string;
}

@Exclude()
@ApiSchema({ name: 'PostAppLogEntry' })
export class PostAppLogEntry {
  @IsEnum(AppLogLevel)
  @Expose()
  @ApiProperty({
    example: AppLogLevel.Log,
    description: 'The severity level of the log entry.',
    enum: AppLogLevel,
    default: AppLogLevel.Log,
  })
  'level'?: AppLogLevel = AppLogLevel.Log;

  @IsInt()
  @Min(0)
  @Expose()
  @ApiProperty({
    example: 1970000000,
    description:
      'The unix timestamp of when the log entry was created, in milliseconds format.',
    format: 'int64',
  })
  'app-timestamp': number;

  @IsString()
  @IsOptional()
  @Expose()
  @ApiProperty({
    example: '8.0.1',
    description: 'The .NET runtime version used by the app.',
  })
  'dotnet-runtime'?: string;

  @IsString()
  @IsOptional()
  @Expose()
  @ApiProperty({ example: '1.0.0', description: 'The version of the app.' })
  'app-version'?: string;

  @IsString()
  @IsOptional()
  @Expose()
  @ApiProperty({
    example: 'ClassNameHere',
    description: 'The name of the source that generated the log entry.',
  })
  'source-name'?: string;

  @ValidateNested()
  @Expose()
  @ApiProperty({
    type: PostAppLogDevice,
    description: 'Details about the device the log entry originated from.',
  })
  @Type(() => PostAppLogDevice)
  'device': PostAppLogDevice;

  @IsObject()
  @Expose()
  @ApiProperty({
    example: { detail: 'Additional structured log data' },
    description: 'Freeform JSON object containing the log message.',
    type: 'object',
    additionalProperties: true,
  })
  'message': Record<string, unknown>;
}

// The request body for this endpoint is a raw JSON array
export type PostAppLogsDto = Array<PostAppLogEntry>;
