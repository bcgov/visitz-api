import { HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { MemoEntity, MemoExample } from './memo.entity';
import { SREntity, SRExample } from './sr.entity';
import { IncidentEntity, IncidentExample } from './incident.entity';
import { CaseEntity, CaseExample } from './case.entity';

/*
 * Examples
 */
export const CaseloadCompleteResponseExample = {
  cases: {
    assignedIds: [CaseExample['Id']],
    status: 200,
    items: [CaseExample],
  },
  incidents: {
    assignedIds: [IncidentExample['Id']],
    status: 200,
    items: [IncidentExample],
  },
  srs: {
    assignedIds: [SRExample['Id']],
    status: 200,
    items: [SRExample],
  },
  memos: {
    assignedIds: [MemoExample['Id']],
    status: 200,
    items: [MemoExample],
  },
};

export const OfficeCaseloadCompleteResponseExample = {
  ...CaseloadCompleteResponseExample,
  officeNames: ['Office Name 1', 'Office Name 2'],
};

export const CaseloadLaterDateResponseExample = {
  cases: {
    assignedIds: [CaseExample['Id']],
    status: 200,
    items: [{ ...CaseExample, 'Last Updated Date': '01/01/2025 00:00:00' }],
  },
  incidents: {
    assignedIds: [IncidentExample['Id']],
    status: 200,
    items: [IncidentExample],
  },
  srs: {
    assignedIds: [SRExample['Id']],
    status: 200,
    items: [SRExample],
  },
  memos: {
    assignedIds: [MemoExample['Id']],
    status: 200,
    items: [MemoExample],
  },
};

export const OfficeCaseloadLaterDateResponseExample = {
  ...CaseloadLaterDateResponseExample,
  officeNames: ['Office Name 1', 'Office Name 2'],
};

export const CaseloadEmptyArrayResponseExample = {
  cases: {
    assignedIds: [],
    status: 204,
    message: {
      ERROR: 'There is no data for the requested resource',
    },
  },
  incidents: {
    assignedIds: [],
    status: 204,
    message: {
      ERROR: 'There is no data for the requested resource',
    },
  },
  srs: {
    assignedIds: [],
    status: 204,
    message: {
      ERROR: 'There is no data for the requested resource',
    },
  },
  memos: {
    assignedIds: [],
    status: 204,
    message: {
      ERROR: 'There is no data for the requested resource',
    },
  },
};

export const OfficeCaseloadEmptyArrayResponseExample = {
  ...CaseloadEmptyArrayResponseExample,
  officeNames: ['Office Name 1', 'Office Name 2'],
};

/*
 * Model definitions
 */

@Exclude()
@ApiSchema({ name: 'GenericRecordOrganizer' })
class GenericRecordEntity {
  @Expose()
  @ApiProperty({
    example: ['example here'],
    isArray: true,
    type: 'string',
  })
  assignedIds: Array<string>;

  @Expose()
  @ApiProperty({
    example: 25,
    default: HttpStatus.OK,
    format: 'integer',
    description: `The HTTP status of this upstream call.`,
  })
  status: number = 200;

  @Expose()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  message?: object;

  constructor(object) {
    Object.assign(this, object);
  }
}

@Exclude()
@ApiSchema({ name: 'CasesOrganizer' })
class CasesOrganizerEntity extends GenericRecordEntity {
  @Expose()
  @IsOptional()
  @ApiProperty({ isArray: true, type: CaseEntity, required: false })
  @Type(() => CaseEntity)
  items?: Array<CaseEntity>;

  constructor(object) {
    super(object);
    Object.assign(this, object);
  }
}

@Exclude()
@ApiSchema({ name: 'IncidentsOrganizer' })
class IncidentsOrganizerEntity extends GenericRecordEntity {
  @Expose()
  @IsOptional()
  @ApiProperty({ isArray: true, type: IncidentEntity, required: false })
  @Type(() => IncidentEntity)
  items?: Array<IncidentEntity>;

  constructor(object) {
    super(object);
    Object.assign(this, object);
  }
}

@Exclude()
@ApiSchema({ name: 'SRsOrganizer' })
class SROrganizerEntity extends GenericRecordEntity {
  @Expose()
  @IsOptional()
  @ApiProperty({ isArray: true, type: SREntity, required: false })
  @Type(() => SREntity)
  items?: Array<SREntity>;

  constructor(object) {
    super(object);
    Object.assign(this, object);
  }
}

@Exclude()
@ApiSchema({ name: 'MemoOrganizer' })
class MemoOrganizerEntity extends GenericRecordEntity {
  @Expose()
  @IsOptional()
  @ApiProperty({ isArray: true, type: MemoEntity, required: false })
  @Type(() => MemoEntity)
  items?: Array<MemoEntity>;

  constructor(object) {
    super(object);
    Object.assign(this, object);
  }
}

@Exclude()
@ApiSchema({ name: 'CaseloadResponse' })
export class CaseloadEntity {
  @Expose()
  cases: CasesOrganizerEntity;

  @Expose()
  incidents: IncidentsOrganizerEntity;

  @Expose()
  srs: SROrganizerEntity;

  @Expose()
  memos: MemoOrganizerEntity;

  constructor(object) {
    Object.assign(this, object);
  }
}

@Exclude()
@ApiSchema({ name: 'OfficeCaseloadResponse' })
export class OfficeCaseloadEntity extends CaseloadEntity {
  @Expose()
  @IsOptional()
  @ApiProperty({
    isArray: true,
    type: 'string',
    required: false,
    example: OfficeCaseloadCompleteResponseExample['officeNames'],
    description: `The office names that this user has access to.`,
  })
  officeNames?: Array<string>;

  constructor(object) {
    super(object);
    Object.assign(this, object);
  }
}
